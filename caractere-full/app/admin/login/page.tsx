'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Employee {
  id: string
  first_name: string
  last_name: string
}

export default function AdminLoginPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const router = useRouter()

  // Charger la liste des employés
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/auth/employees')
        const data = await res.json()
        if (data.employees) {
          setEmployees(data.employees)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des employés:', err)
      } finally {
        setLoadingEmployees(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!selectedEmployee || !password) {
      setError('Choisissez un employé et entrez un mot de passe')
      setLoading(false)
      return
    }

    if (isFirstLogin && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (isFirstLogin && password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: selectedEmployee.first_name,
          lastName: selectedEmployee.last_name,
          password,
          isFirstLogin,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion')
        setLoading(false)
        return
      }

      // Connexion réussie
      router.push('/admin')
    } catch (err) {
      setError('Erreur serveur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[420px] shadow-lg border border-slate-200">
        {/* Logo */}
        <div className="w-14 h-14 bg-brand-dark rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-8 mx-auto">
          C
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-center">Caractère Store</h1>
        <p className="text-sm text-slate-600 text-center mb-8">
          {isFirstLogin ? 'Créer votre mot de passe' : 'Connexion'}
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dropdown Employés */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Employé</label>
            <select
              value={selectedEmployee?.id || ''}
              onChange={(event) => {
                const emp = employees.find(e => e.id === event.target.value)
                setSelectedEmployee(emp || null)
              }}
              className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent bg-white"
              autoFocus
              disabled={loading || loadingEmployees}
            >
              <option value="">
                {loadingEmployees ? 'Chargement...' : 'Sélectionnez votre nom'}
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isFirstLogin ? 'Minimum 8 caractères' : '••••••••'}
              className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Confirmer mot de passe (première connexion) */}
          {isFirstLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Confirmer mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                disabled={loading}
              />
            </div>
          )}

          {/* Toggle première connexion */}
          <button
            type="button"
            onClick={() => {
              setIsFirstLogin(!isFirstLogin)
              setPassword('')
              setConfirmPassword('')
              setError('')
            }}
            className="text-sm text-brand-dark hover:underline text-left py-1"
          >
            {isFirstLogin ? '← Revenir à la connexion' : 'Première connexion ?'}
          </button>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading || !selectedEmployee || !password || loadingEmployees}
            className="bg-brand-dark text-white py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Chargement...' : isFirstLogin ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-slate-500 text-center mt-8">
          Connexion sécurisée • © 2024 Caractère Store
        </p>
      </div>
    </div>
  )
}
