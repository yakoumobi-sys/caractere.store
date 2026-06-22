return (
  <main className="min-h-screen bg-white flex items-center justify-center px-4">
    <div className="w-full max-w-sm">
      <h1 className="text-[24px] font-bold text-center mb-6">Connexion</h1>
      {error && (
        <div className="bg-red-100 text-red-700 text-[13px] rounded-xl px-4 py-3 mb-4 break-all">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-[14px]" />
        <button onClick={handleLogin} disabled={loading} className="w-full bg-black text-white py-3 rounded-full text-[15px]">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p className="text-center text-[12px] text-gray-500">Status: {loading ? 'loading' : 'idle'}</p>
      </div>
    </div>
  </main>
)
