'use client';

import React, { useState } from 'react';
import ConfigModal from '../components/ConfigModal';

export default function Home() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-slate-800">
      {/* Panel superior */}
      <div className="bg-slate-900 border-b border-slate-600 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TPV</h1>
          <div className="flex gap-3">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center gap-2 text-lg">
              💳 Cobrar
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
              ❌ Cancelar
            </button>
            <button 
              onClick={() => setIsConfigOpen(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Panel izquierdo: Resumen del ticket y calculadora */}
        <div className="w-1/3 bg-slate-900 border-r border-slate-600 flex flex-col">
          {/* Resumen del ticket */}
          <div className="flex-1 p-4 border-b border-slate-600 flex flex-col">
            <div className="bg-slate-800 rounded-lg p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-white">Ticket</h2>
              <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                {/* Líneas de ejemplo */}
                <div className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-white">Artículo ejemplo</div>
                    <div className="text-sm text-gray-400">2 ud. × 6.25€</div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-white mr-4">12.50€</span>
                    <div className="flex gap-1">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors">
                        ✏️
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-white">Otro artículo</div>
                    <div className="text-sm text-gray-400">1 ud. × 8.75€</div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-white mr-4">8.75€</span>
                    <div className="flex gap-1">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors">
                        ✏️
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-600 pt-4 mt-auto">
                <div className="flex justify-between font-bold text-2xl text-white">
                  <span>Total:</span>
                  <span>21.25€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculadora */}
          <div className="flex-1 p-4">
            <div className="bg-slate-800 rounded-lg p-4 h-full flex flex-col">
              <div className="mb-4">
                <input 
                  type="text" 
                  className="w-full text-right text-2xl font-bold p-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                  value="0.00"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 grid-rows-4 gap-1 flex-1">
                {/* Fila 1 */}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">7</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">8</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">9</button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Dto%</button>
                
                {/* Fila 2 */}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">4</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">5</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">6</button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Dto€</button>
                
                {/* Fila 3 */}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">1</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">2</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">3</button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Can</button>
                
                {/* Fila 4 */}
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">0</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">.</button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">C</button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Prec</button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho: Familias y artículos */}
        <div className="w-2/3 bg-slate-900 flex flex-col">
          {/* Familias */}
          <div className="h-1/2 p-4 border-b border-slate-600">
            <h2 className="text-xl font-bold mb-4 text-white">Familias</h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Botones de familias de ejemplo */}
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-lg text-center transition-colors">
                Bebidas
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-lg text-center transition-colors">
                Comidas
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-lg text-center transition-colors">
                Postres
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-lg text-center transition-colors">
                Snacks
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-4 rounded-lg text-center transition-colors">
                Otros
              </button>
            </div>
          </div>

          {/* Artículos */}
          <div className="h-1/2 p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Artículos</h2>
            <div className="grid grid-cols-3 gap-3">
              {/* Botones de artículos de ejemplo */}
              <button className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300">
                <div className="text-sm">Café</div>
                <div className="text-lg font-bold text-blue-400">1.20€</div>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300">
                <div className="text-sm">Refresco</div>
                <div className="text-lg font-bold text-blue-400">1.50€</div>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300">
                <div className="text-sm">Agua</div>
                <div className="text-lg font-bold text-blue-400">1.00€</div>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300">
                <div className="text-sm">Bocadillo</div>
                <div className="text-lg font-bold text-blue-400">3.50€</div>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300">
                <div className="text-sm">Ensalada</div>
                <div className="text-lg font-bold text-blue-400">4.25€</div>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300">
                <div className="text-sm">Helado</div>
                <div className="text-lg font-bold text-blue-400">2.00€</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Configuración */}
      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
    </div>
  );
}