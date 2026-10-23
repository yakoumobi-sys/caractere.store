'use client'

import { useState } from 'react'

const contacts = [
  { title: 'Simulations & devis', description: 'Échantillons gratuits', number: '213557440522', message: 'Bonjour, je souhaite une simulation ou un devis pour des vêtements personnalisés.' },
  { title: 'Service client & SAV', description: 'Suivi de commande et assistance', number: '213784463207', message: 'Bonjour, je souhaite contacter le service client Caractère.' },
  { title: 'Réclamations', description: 'Signaler un problème', number: '213776886556', message: 'Bonjour, je souhaite déposer une réclamation.' },
]

export default function WhatsAppContact() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div id="caractere-whatsapp-menu" className="w-[min(340px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 text-neutral-900 shadow-2xl">
          <div className="px-2 pb-3 pt-1">
            <p className="font-semibold">Contactez Caractère</p>
            <p className="text-sm text-neutral-500">Choisissez votre service</p>
          </div>
          {contacts.map((contact) => (
            <a key={contact.number} href={`https://wa.me/${contact.number}?text=${encodeURIComponent(contact.message)}`} target="_blank" rel="noopener noreferrer" className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✆</span>
              <span className="flex-1"><span className="block text-sm font-semibold">{contact.title}</span><span className="block text-xs text-neutral-500">{contact.description}</span></span>
              <span aria-hidden="true" className="text-neutral-400">↗</span>
            </a>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setOpen((previous) => !previous)} aria-expanded={open} aria-controls="caractere-whatsapp-menu" aria-label={open ? 'Fermer les contacts WhatsApp' : 'Contacter Caractère sur WhatsApp'} className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1faf54] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        <span aria-hidden="true" className="text-xl">{open ? '×' : '✆'}</span><span>{open ? 'Fermer' : 'WhatsApp'}</span>
      </button>
    </div>
  )
}
