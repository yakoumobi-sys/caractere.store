const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const ts=require('typescript')
const vm=require('node:vm')
const {NextRequest}=require('next/server')

function harness({configured=true, dbError=false, mailError=false}={}) {
  const records=new Map();let notifications=0
  const env=configured?{NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test-server-key',RESEND_API_KEY:'test',ADMIN_EMAIL:'test@example.invalid'}:{}
  const module={exports:{}}
  const db={from:()=>({upsert:row=>({select:async()=>{
    if(dbError)return {data:null,error:{code:'TEST'}}
    const duplicate=records.has(row.request_id)
    if(!duplicate)records.set(row.request_id,row)
    return {data:duplicate?[]:[{id:row.request_id}],error:null}
  }})})}
  const mocks={
    '@supabase/supabase-js':{createClient:()=>db},
    '@/lib/rate-limit':{getIP:()=> 'test-client',publicApiLimiter:{limit:async()=>({success:true})}},
    resend:{Resend:class {emails={send:async()=>{notifications++;return {error:mailError?{name:'TEST'}:null}}}}},
  }
  const js=ts.transpileModule(fs.readFileSync('app/api/contact/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText
  vm.runInNewContext(js,{exports:module.exports,module,require:name=>mocks[name]||require(name),process:{env},console:{error:()=>{}},URL,Map,Date})
  return {post:body=>module.exports.POST(new NextRequest('https://site.example/api/contact',{method:'POST',body:JSON.stringify(body)})),records,notifications:()=>notifications}
}
const valid={nom:'Test Client',telephone:'0550000000',quantite:'10',details:'Brief client',request_id:'32c224b0-7689-42fe-a623-32bba2f302f8'}
test('records a quote before reporting success, and retries do not duplicate it',async()=>{
  const h=harness();const first=await h.post(valid);assert.equal(first.status,200);assert.equal((await first.json()).reference,valid.request_id)
  assert.equal(h.records.size,1);assert.equal(h.records.get(valid.request_id).payload.details,'Brief client')
  assert.equal((await h.post(valid)).status,200);assert.equal(h.records.size,1);assert.equal(h.notifications(),1)
})
test('database failures do not produce a success confirmation',async()=>{const h=harness({dbError:true});assert.equal((await h.post(valid)).status,503);assert.equal(h.notifications(),0)})
test('a notification failure does not discard a saved quote',async()=>{const h=harness({mailError:true});assert.equal((await h.post(valid)).status,200);assert.equal(h.records.size,1)})
test('missing server credentials return unavailable',async()=>{assert.equal((await harness({configured:false}).post(valid)).status,503)})
test('rejects invalid contacts and oversized requests',async()=>{const h=harness();for(const body of [null,[],{}, {...valid,nom:'A'}, {...valid,telephone:'abc'}, {...valid,details:'x'.repeat(2001)}]) assert.equal((await h.post(body)).status,400);assert.equal((await h.post({...valid,details:'x'.repeat(13000)})).status,413);assert.equal(h.records.size,0)})
test('rejects external attachment URLs',async()=>{const h=harness();assert.equal((await h.post({...valid,logo:'https://malicious.example/file.pdf'})).status,400);assert.equal(h.records.size,0)})
test('rate limits repeated submissions without Upstash',async()=>{const h=harness();for(let i=0;i<5;i++)assert.equal((await h.post(valid)).status,200);assert.equal((await h.post(valid)).status,429)})
