export default function TrekCard({ trek, onSelect }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden cursor-pointer" onClick={() => onSelect?.(trek)}>
      <div className="h-44 bg-gray-100 bg-cover bg-center" style={{backgroundImage:`url(${trek.images?.[0] || 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?q=80&w=2070&auto=format&fit=crop'})`}} />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{trek.title}</h3>
        <p className="text-sm text-gray-600">{trek.region} • {trek.difficulty} • {trek.duration_days} days</p>
        <p className="mt-2 text-blue-700 font-semibold">From ${trek.price_usd}</p>
      </div>
    </div>
  )
}
