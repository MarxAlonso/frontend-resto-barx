import { useEffect, useState } from "react";
import MenuCard from "../../../components/MenuCard";
import { menuAPI, MenuItem } from "../../../services/api"; // Llamando al api para el menu

// Estos son los tipos de categorias que existen en la tabla menu base al backend
type Category = "Todas" | "Parrillas" | "Bebidas" | "Postres";

export default function MenuSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todas");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: Category[] = ["Todas", "Parrillas", "Bebidas", "Postres"];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuAPI.getMenu(); // llamada a tu backend
        setMenuItems(data);
      } catch (err: any) {
        console.error(err);
        setError("Error al cargar el menú");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenu =
    selectedCategory === "Todas"
      ? menuItems
      : menuItems.filter(
          (item) => item.category.name === selectedCategory
        );

  return (
    <section id="menu" className="py-16 md:py-20">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestro Menú
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de platos preparados con los mejores
            ingredientes y técnicas tradicionales de la parrilla peruana.
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
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] cursor-pointer"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Estado de carga / error */}
        {loading && <div className="text-center py-12">Cargando menú...</div>}
        {error && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {/* Menu Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <div key={item.id} className="fade-in">
                <MenuCard
                  title={item.title}
                  price={item.price}
                  desc={item.description}
                  category={item.category.name as Category}
                  imageUrl={item.imageUrl}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredMenu.length === 0 && (
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
