import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  async function handleChangePassword(e) {
    e.preventDefault()
    if (newPassword.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (newPassword !== confirm) { setError('Las contraseñas no coinciden'); return }

    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setSuccess(true)
      setNewPassword('')
      setConfirm('')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate('/')} className="text-blue-600 text-sm mb-4 flex items-center gap-1">
          ← Volver
        </button>

        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mi perfil</h1>

        {/* Email */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Cuenta</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.email}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Miembro desde {new Date(user?.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Cambiar contraseña</h2>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
              Contraseña actualizada correctamente.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={saving || !newPassword || !confirm}
              className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
