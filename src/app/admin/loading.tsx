// Shown instantly while an admin page loads, so moving between pages never flashes a blank or coloured screen.
export default function AdminLoading() {
  return (
    <div className="w-full p-4 lg:p-5" aria-busy="true" aria-label="Loading">
      <div className="admin-skeleton h-6 w-48 mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[0, 1, 2, 3].map(i => <div key={i} className="admin-skeleton h-20" />)}
      </div>
      <div className="admin-skeleton h-64" />
    </div>
  )
}
