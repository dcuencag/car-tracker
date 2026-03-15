import MaintenanceItem from './MaintenanceItem'

export default function MaintenanceList({ maintenances, onEdit, onDelete, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900">Historial de mantenimientos</h2>
        <button
          onClick={onAdd}
          className="text-sm text-blue-600 font-medium"
        >
          + Añadir
        </button>
      </div>

      {maintenances.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🔧</p>
          <p className="text-sm text-gray-500 mb-4">Aún no hay mantenimientos registrados</p>
          <button
            onClick={onAdd}
            className="text-sm text-blue-600 font-medium border border-blue-200 px-4 py-2 rounded-xl"
          >
            Registrar el primero
          </button>
        </div>
      ) : (
        <div>
          {maintenances.map(m => (
            <MaintenanceItem
              key={m.id}
              maintenance={m}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
