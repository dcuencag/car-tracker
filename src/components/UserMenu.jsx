import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MENU_ITEMS = [
  { label: 'Mi perfil',    icon: '👤', route: '/profile'  },
  { label: 'Estadísticas', icon: '📊', route: '/stats'    },
  { label: 'Ajustes',      icon: '⚙️',  route: '/settings' },
]

export default function UserMenu({ onExportAll, exporting }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = user?.email?.[0]?.toUpperCase() ?? '?'

  function go(route) {
    setOpen(false)
    navigate(route)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          {/* Email */}
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Opciones principales */}
          {MENU_ITEMS.map(item => (
            <button
              key={item.route}
              onClick={() => go(item.route)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Exportar todo */}
          <button
            onClick={() => { setOpen(false); onExportAll() }}
            disabled={exporting}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
          >
            <span>📄</span>
            {exporting ? 'Generando PDF...' : 'Exportar todo'}
          </button>

          {/* Cerrar sesión */}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); signOut() }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-medium"
            >
              <span>🚪</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
