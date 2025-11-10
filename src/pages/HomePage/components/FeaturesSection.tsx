export default function FeaturesSection () {
    return(
        <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Parrilla Tradicional</h3>
                  <p className="text-gray-600 text-sm">Carnes a la parrilla con técnicas ancestrales</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌶️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sabores Únicos</h3>
                  <p className="text-gray-600 text-sm">Especias y salsas de la cocina peruana</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Delivery Rápido</h3>
                  <p className="text-gray-600 text-sm">Entrega en 30-45 minutos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Calidad Premium</h3>
                  <p className="text-gray-600 text-sm">Ingredientes frescos y de primera</p>
                </div>
              </div>
            </div>
    )
}