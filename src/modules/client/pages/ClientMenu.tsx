import { useState } from 'react';
import { menu, type Item } from '../../../data/menu';
import MenuCard from '../../../components/MenuCard';

export default function ClientMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [cart, setCart] = useState<{item: Item, quantity: number}[]>([]);

  const categories = ['Todos', 'Parrillas', 'Bebidas', 'Postres'];
  
  const filteredMenu = selectedCategory === 'Todos' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  const addToCart = (item: Item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Menú</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre los auténticos sabores peruanos en cada plato. 
              Preparados con ingredientes frescos y recetas tradicionales.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Content */}
          <div className="flex-1">
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <div key={item.id} className="relative">
                  <MenuCard 
                    title={item.title}
                    price={item.price}
                    desc={item.desc}
                    category={item.category}
                  />
                  <button
                    onClick={() => addToCart(item)}
                    className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-colors"
                    title="Agregar al carrito"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>

            {filteredMenu.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No hay platos disponibles en esta categoría.</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🛒 Mi Pedido
                {getTotalItems() > 0 && (
                  <span className="bg-orange-600 text-white text-sm px-2 py-1 rounded-full">
                    {getTotalItems()}
                  </span>
                )}
              </h3>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
              ) : (
                <div>
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{cartItem.item.title}</h4>
                          <p className="text-orange-600 font-semibold">S/ {cartItem.item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCart(prevCart => 
                                prevCart.map(item => 
                                  item.item.id === cartItem.item.id && item.quantity > 1
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                                ).filter(item => item.quantity > 0)
                              );
                            }}
                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                          <button
                            onClick={() => addToCart(cartItem.item)}
                            className="w-6 h-6 bg-orange-600 hover:bg-orange-700 text-white rounded-full flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-xl text-orange-600">S/ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors">
                      Realizar Pedido
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}