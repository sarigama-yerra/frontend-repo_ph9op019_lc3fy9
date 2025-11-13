export default function Hero({ onExplore }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="relative max-w-6xl mx-auto px-4 py-32 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">Explore Nepal with Juma Trek</h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow">
          Authentic trekking experiences across the Himalayas. Expert guides, small groups, unforgettable memories.
        </p>
        <div className="mt-8 flex gap-3">
          <button onClick={onExplore} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md font-semibold">
            Explore Treks
          </button>
          <a href="#contact" className="bg-white/90 hover:bg-white text-gray-900 px-5 py-3 rounded-md font-semibold">
            Get in Touch
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30" />
    </section>
  )
}
