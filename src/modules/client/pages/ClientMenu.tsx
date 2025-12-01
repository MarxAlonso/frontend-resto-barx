import { useEffect, useState } from 'react';
import MenuCard from '../components/MenuCard';
import { menuAPI } from '../../../services/api';
import type { MenuItem } from '../../../services/api';
import { orderAPI, paymentAPI } from '../../../services/api';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import jsPDF from 'jspdf';

// Inicializar Mercado Pago
initMercadoPago('TEST-096d6244-9884-4a8c-bcb3-5230ad195c30');

export default function ClientMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cargar menú del backend
  useEffect(() => {
    /*const fetchMenu = async () => {
      try {
        const data = await menuAPI.getMenu();
        setMenuItems(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error al cargar el menú');
        } else {
          setError('Error al cargar el menú');
        }
      } finally {
        setLoading(false);
      }
    };*/
    const fetchMenu = async () => {
      try {
        const response = await menuAPI.getMenu();
        setMenuItems(response.data); // 👈 aquí usas el array
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error al cargar el menú');
        } else {
          setError('Error al cargar el menú');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = ['Todos', 'Parrillas', 'Bebidas', 'Postres'];

  // Filtrar
  const filteredMenu =
    selectedCategory === 'Todos'
      ? menuItems
      : menuItems.filter(
        (item) => item.category?.name === selectedCategory
      );

  // Carrito
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      return existing
        ? prev.map((c) =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
        : [...prev, { item, quantity: 1 }];
    });
  };

  const getTotalItems = () =>
    cart.reduce((total, c) => total + c.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, c) => total + c.item.price * c.quantity, 0);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text('RestoBarX', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.text('Boleta de Pago', 105, 30, { align: 'center' });

    // Fecha
    doc.setFontSize(10);
    const fecha = new Date().toLocaleString('es-PE');
    doc.text(`Fecha: ${fecha}`, 20, 45);

    // Línea separadora
    doc.line(20, 50, 190, 50);

    // Encabezados de tabla
    doc.setFontSize(12);
    doc.text('Producto', 20, 60);
    doc.text('Cant.', 120, 60);
    doc.text('Precio', 145, 60);
    doc.text('Subtotal', 170, 60);

    // Línea debajo de encabezados
    doc.line(20, 63, 190, 63);

    // Items del carrito
    let yPos = 73;
    doc.setFontSize(10);
    cart.forEach((c) => {
      const subtotal = c.item.price * c.quantity;
      doc.text(c.item.title.substring(0, 30), 20, yPos);
      doc.text(c.quantity.toString(), 125, yPos);
      doc.text(`S/ ${c.item.price.toFixed(2)}`, 145, yPos);
      doc.text(`S/ ${subtotal.toFixed(2)}`, 170, yPos);
      yPos += 10;
    });

    // Línea antes del total
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Total
    doc.setFontSize(14);
    doc.text('TOTAL:', 145, yPos);
    doc.text(`S/ ${getTotalPrice().toFixed(2)}`, 170, yPos);

    // Pie de página
    yPos += 20;
    doc.setFontSize(10);
    doc.text('¡Gracias por su compra!', 105, yPos, { align: 'center' });
    doc.text('RestoBarX - Sabores Peruanos', 105, yPos + 7, { align: 'center' });

    // Descargar PDF
    const fileName = `boleta_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando menú…</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    // Solo mostrar el formulario de pago, NO crear la orden todavía
    setShowPayment(true);
  };



  const customization = {
    paymentMethods: {
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  } as const;

  const onSubmit = async ({ formData }: any) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 1. Primero crear la orden
        const orderData = {
          items: cart.map(c => ({
            menuId: c.item.id,
            quantity: c.quantity
          })),
          totalPrice: getTotalPrice()
        };

        const orderResponse = await orderAPI.createOrder(orderData);
        const createdOrderId = orderResponse?.data?.orderId;

        // 2. Luego procesar el pago con el orderId
        await paymentAPI.processPayment({
          ...formData,
          orderId: createdOrderId
        });

        // 3. Si todo salió bien, generar PDF y mostrar modal
        resolve();
        generatePDF();
        setShowSuccessModal(true);
        setCart([]);
        setShowPayment(false);
      } catch (error) {
        console.error(error);
        reject();
        alert('❌ Error al procesar el pago');
      }
    });
  };

  const onError = async (error: any) => {
    console.log(error);
  };

  const onReady = async () => {
    // Brick listo
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestro Menú
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los auténticos sabores peruanos en cada plato.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Contenido menú */}
        <div className="flex-1">
          {/* Filtro categorías */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lista de items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <div key={item.id} className="relative">
                <MenuCard
                  title={item.title}
                  price={item.price}
                  desc={item.description}
                  category={item.category?.name as 'Parrillas' | 'Bebidas' | 'Postres'}
                  imageUrl={item.imageUrl}
                />
                <button
                  onClick={() => addToCart(item)}
                  className="cursor-pointer absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-colors"
                  title="Agregar al carrito"
                >
                  🛒
                </button>
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

        {/* Carrito */}
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

            {showPayment ? (
              <div className="payment-container">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Pago</h4>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
                <Payment
                  initialization={{ amount: getTotalPrice() }}
                  customization={customization}
                  onSubmit={onSubmit}
                  onReady={onReady}
                  onError={onError}
                />
              </div>
            ) : (
              <>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Tu carrito está vacío
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {cart.map((c) => (
                        <div
                          key={c.item.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {c.item.title}
                            </h4>
                            <p className="text-orange-600 font-semibold">
                              S/ {c.item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev
                                    .map((ci) =>
                                      ci.item.id === c.item.id && ci.quantity > 1
                                        ? { ...ci, quantity: ci.quantity - 1 }
                                        : ci
                                    )
                                    .filter((ci) => ci.quantity > 0)
                                )
                              }
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">
                              {c.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(c.item)}
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
                        <span className="font-bold text-xl text-orange-600">
                          S/ {getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={handleOrder}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors"
                      >
                        Realizar Pedido
                      </button>

                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Pago Exitoso!
              </h3>
              <p className="text-gray-600 mb-4">
                Tu pedido ha sido procesado correctamente.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-800">
                  📄 Tu boleta se ha descargado automáticamente
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
