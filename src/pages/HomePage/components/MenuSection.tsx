import { useState } from "react";
import { menu } from "../../../data/menu";
import MenuCard from "../../../components/MenuCard";

type Category = "Todas" | "Parrillas" | "Bebidas" | "Postres";

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todas");

  const categories: Category[] = ["Todas", "Parrillas", "Bebidas", "Postres"];

  const filteredMenu = selectedCategory === "Todas" 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  return (
    <section id="menu" className="py-16 md:py-20">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestro Menú
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de platos preparados con los mejores ingredientes 
            y técnicas tradicionales de la parrilla peruana.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-[color:var(--brand)] text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <div key={item.id} className="fade-in">
              <MenuCard 
                title={item.title}
                price={item.price}
                desc={item.desc}
                category={item.category}
              />
            </div>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay platos disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}