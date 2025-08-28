type Props = { 
  title: string; 
  price: number; 
  desc: string;
  category: "Parrillas" | "Bebidas" | "Postres";
};

export default function MenuCard({ title, price, desc, category }: Props) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Parrillas": return "🥩";
      case "Bebidas": return "🥤";
      case "Postres": return "🍰";
      default: return "🍽️";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Parrillas": return "bg-red-100 text-red-700";
      case "Bebidas": return "bg-blue-100 text-blue-700";
      case "Postres": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
          <span>{getCategoryIcon(category)}</span>
          {category}
        </span>
        <span className="text-2xl font-bold text-[color:var(--brand)]">S/ {price.toFixed(2)}</span>
      </div>
      
      <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 flex-1 leading-relaxed">{desc}</p>
      
      <button className="w-full py-3 px-4 rounded-xl bg-[color:var(--brand)] text-white font-semibold hover:bg-[color:var(--brand-dark)] transition-colors duration-200 flex items-center justify-center gap-2">
        <span>🛒</span>
        Agregar al pedido
      </button>
    </article>
  );
}