'use client';

import React, { useState, useEffect } from 'react';
import ConfigModal from '../components/ConfigModal';

interface Articulo {
  id: number;
  name: string;
  price: number;
  family_id: number;
}

interface Familia {
  id: number;
  name: string;
}

interface LineaTicket {
  id: number;
  articulo: Articulo;
  cantidad: number;
  precioUnitario: number;
  descuentoTipo: 'fixed' | 'percent' | null;
  descuentoValor: number;
  total: number;
}

export default function Home() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<Familia | null>(null);
  const [mostrarModalCobro, setMostrarModalCobro] = useState(false);
  const [lineasTicket, setLineasTicket] = useState<LineaTicket[]>([]);
  const [valorCalculadora, setValorCalculadora] = useState('0');
  const [lineaSeleccionada, setLineaSeleccionada] = useState<number | null>(null);
  const [cantidadArticulo, setCantidadArticulo] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [dineroRecibido, setDineroRecibido] = useState('');
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  const agregarArticulo = (articulo: Articulo) => {
    const precioFinal = articulo.price;
    const indiceExistente = lineasTicket.findIndex(
      linea => linea.articulo.id === articulo.id && linea.precioUnitario === precioFinal
    );

    if (indiceExistente >= 0) {
      const lineasActualizadas = [...lineasTicket];
      lineasActualizadas[indiceExistente].cantidad += cantidadArticulo;
      lineasActualizadas[indiceExistente].total = 
        lineasActualizadas[indiceExistente].cantidad * precioFinal;
      setLineasTicket(lineasActualizadas);
    } else {
      const nuevaLinea: LineaTicket = {
        id: Date.now(),
        articulo,
        cantidad: cantidadArticulo,
        precioUnitario: precioFinal,
        descuentoTipo: null,
        descuentoValor: 0,
        total: precioFinal * cantidadArticulo
      };
      
      setLineasTicket([...lineasTicket, nuevaLinea]);
    }
    
    limpiarCalculadora();
    setCantidadArticulo(1);
    setPrecioUnitario('');
  };

  const mostrarPrecioUnitario = (articulo: Articulo) => {
    setPrecioUnitario(articulo.price.toString());
    setValorCalculadora(articulo.price.toString());
  };

  const mostrarCantidad = () => {
    setCantidadArticulo(parseInt(valorCalculadora) || 1);
    setValorCalculadora('0');
  };

  const agregarDigito = (digito: string) => {
    let nuevoValor;
    if (valorCalculadora === '0') {
      nuevoValor = digito;
    } else {
      nuevoValor = valorCalculadora + digito;
    }
    setValorCalculadora(nuevoValor);
    
    // Actualizar precio del artículo seleccionado en tiempo real
    if (lineaSeleccionada !== null) {
      const nuevoPrecio = parseFloat(nuevoValor) || 0;
      const lineasActualizadas = lineasTicket.map(linea => {
        if (linea.id === lineaSeleccionada) {
          return {
            ...linea,
            precioUnitario: nuevoPrecio,
            total: nuevoPrecio * linea.cantidad
          };
        }
        return linea;
      });
      setLineasTicket(lineasActualizadas);
    }
  };

  const agregarPunto = () => {
    if (!valorCalculadora.includes('.')) {
      const nuevoValor = valorCalculadora + '.';
      setValorCalculadora(nuevoValor);
      
      // Actualizar precio del artículo seleccionado en tiempo real
      if (lineaSeleccionada !== null) {
        const nuevoPrecio = parseFloat(nuevoValor) || 0;
        const lineasActualizadas = lineasTicket.map(linea => {
          if (linea.id === lineaSeleccionada) {
            return {
              ...linea,
              precioUnitario: nuevoPrecio,
              total: nuevoPrecio * linea.cantidad
            };
          }
          return linea;
        });
        setLineasTicket(lineasActualizadas);
      }
    }
  };

  const limpiarCalculadora = () => {
    setValorCalculadora('0');
  };

  const aplicarDescuentoPorcentaje = () => {
    const porcentaje = parseFloat(valorCalculadora) || 0;
    if (lineasTicket.length > 0) {
      const ultimaLinea = lineasTicket[lineasTicket.length - 1];
      const descuentoValor = (ultimaLinea.total * porcentaje) / 100;
      ultimaLinea.descuentoTipo = 'percent';
      ultimaLinea.descuentoValor = porcentaje;
      ultimaLinea.total = ultimaLinea.total - descuentoValor;
      setLineasTicket([...lineasTicket]);
      limpiarCalculadora();
    }
  };

  const aplicarDescuentoFijo = () => {
    const descuento = parseFloat(valorCalculadora) || 0;
    if (lineasTicket.length > 0) {
      const ultimaLinea = lineasTicket[lineasTicket.length - 1];
      ultimaLinea.descuentoTipo = 'fixed';
      ultimaLinea.descuentoValor = descuento;
      ultimaLinea.total = Math.max(0, ultimaLinea.total - descuento);
      setLineasTicket([...lineasTicket]);
      limpiarCalculadora();
    }
  };

  const articulosFiltrados = familiaSeleccionada 
    ? articulos.filter(a => a.family_id === familiaSeleccionada.id)
    : [];



  const calcularVueltas = () => {
    const total = calcularTotal();
    const recibido = parseFloat(dineroRecibido) || 0;
    return recibido - total;
  };

  const seleccionarLinea = (id: number) => {
    const linea = lineasTicket.find(l => l.id === id);
    if (linea) {
      setLineaSeleccionada(id);
      setValorCalculadora(linea.precioUnitario.toString());
    }
  };

  const eliminarLinea = (id: number) => {
    setLineasTicket(lineasTicket.filter(linea => linea.id !== id));
    if (lineaSeleccionada === id) {
      setLineaSeleccionada(null);
      setValorCalculadora('0');
    }
  };

  const cancelarTicket = () => {
    setLineasTicket([]);
    limpiarCalculadora();
    setDineroRecibido('');
  };

  const calcularTotal = () => {
    return lineasTicket.reduce((total, linea) => total + linea.total, 0);
  };

  useEffect(() => {
    // Datos de prueba para familias
    const familiasDePrueba: Familia[] = [
      { id: 1, name: 'Bebidas' },
      { id: 2, name: 'Comidas' },
      { id: 3, name: 'Postres' },
      { id: 4, name: 'Snacks' },
      { id: 5, name: 'Otros' }
    ];

    // Datos de prueba para artículos
    const articulosDePrueba: Articulo[] = [
      { id: 1, name: 'Café', price: 1.20, family_id: 1 },
      { id: 2, name: 'Refresco', price: 1.50, family_id: 1 },
      { id: 3, name: 'Agua', price: 1.00, family_id: 1 },
      { id: 4, name: 'Zumo', price: 2.00, family_id: 1 },
      { id: 5, name: 'Bocadillo', price: 3.50, family_id: 2 },
      { id: 6, name: 'Ensalada', price: 4.25, family_id: 2 },
      { id: 7, name: 'Pizza', price: 6.50, family_id: 2 },
      { id: 8, name: 'Hamburguesa', price: 5.75, family_id: 2 },
      { id: 9, name: 'Helado', price: 2.00, family_id: 3 },
      { id: 10, name: 'Tarta', price: 3.00, family_id: 3 },
      { id: 11, name: 'Fruta', price: 1.50, family_id: 3 },
      { id: 12, name: 'Patatas', price: 2.50, family_id: 4 },
      { id: 13, name: 'Galletas', price: 1.75, family_id: 4 },
      { id: 14, name: 'Nueces', price: 2.00, family_id: 4 },
      { id: 15, name: 'Chicles', price: 0.50, family_id: 4 }
    ];

    setFamilias(familiasDePrueba);
    setArticulos(articulosDePrueba);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-800">
      {/* Panel superior */}
      <div className="bg-slate-900 border-b border-slate-600 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TPV</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setMostrarModalCobro(true)}
              disabled={lineasTicket.length === 0}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-white font-bold py-3 px-12 rounded-lg transition-colors flex items-center gap-2 text-lg"
            >
              💳 Cobrar
            </button>
            <button 
              onClick={cancelarTicket}
              disabled={lineasTicket.length === 0}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
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
                {lineasTicket.map((linea) => (
                  <div 
                    key={linea.id} 
                    className={`rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      lineaSeleccionada === linea.id 
                        ? 'bg-blue-600 border-2 border-blue-400' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    onClick={() => seleccionarLinea(linea.id)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${lineaSeleccionada === linea.id ? 'text-white' : 'text-white'}`}>
                        {linea.articulo.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {linea.cantidad} ud. × {linea.precioUnitario.toFixed(2)}€
                        {linea.descuentoTipo && (
                          <span className="text-orange-400 ml-2">
                            -{linea.descuentoValor}{linea.descuentoTipo === 'percent' ? '%' : '€'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-bold text-lg mr-4 ${lineaSeleccionada === linea.id ? 'text-white' : 'text-white'}`}>
                        {linea.total.toFixed(2)}€
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarLinea(linea.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-600 pt-4 mt-auto">
                <div className="flex justify-between font-bold text-2xl text-white">
                  <span>Total:</span>
                  <span>{calcularTotal().toFixed(2)}€</span>
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
                  value={parseFloat(valorCalculadora).toFixed(2)}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 grid-rows-4 gap-1 flex-1">
                {/* Fila 1 */}
                <button onClick={() => agregarDigito('7')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">7</button>
                <button onClick={() => agregarDigito('8')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">8</button>
                <button onClick={() => agregarDigito('9')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">9</button>
                <button onClick={aplicarDescuentoPorcentaje} disabled={!lineaSeleccionada} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Dto%</button>
                
                {/* Fila 2 */}
                <button onClick={() => agregarDigito('4')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">4</button>
                <button onClick={() => agregarDigito('5')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">5</button>
                <button onClick={() => agregarDigito('6')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">6</button>
                <button onClick={aplicarDescuentoFijo} disabled={!lineaSeleccionada} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Dto€</button>
                
                {/* Fila 3 */}
                <button onClick={() => agregarDigito('1')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">1</button>
                <button onClick={() => agregarDigito('2')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">2</button>
                <button onClick={() => agregarDigito('3')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">3</button>
                <button onClick={mostrarCantidad} disabled={!lineaSeleccionada} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Can</button>
                
                {/* Fila 4 */}
                <button onClick={() => agregarDigito('0')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">0</button>
                <button onClick={agregarPunto} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">.</button>
                <button onClick={limpiarCalculadora} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">C</button>
                <button onClick={() => {setPrecioUnitario(valorCalculadora); limpiarCalculadora();}} disabled={!lineaSeleccionada} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Prec</button>
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
              {familias.map((familia) => (
                <button
                  key={familia.id}
                  onClick={() => setFamiliaSeleccionada(familia)}
                  className={`font-semibold py-6 px-4 rounded-lg text-center transition-colors ${
                    familiaSeleccionada?.id === familia.id 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-400 ring-opacity-50' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {familia.name}
                </button>
              ))}
            </div>
          </div>

          {/* Artículos */}
          <div className="h-1/2 p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Artículos</h2>
            <div className="grid grid-cols-3 gap-3">
              {articulosFiltrados.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  Selecciona una familia para ver los artículos
                </div>
              ) : (
                articulosFiltrados.map((articulo) => (
                  <button
                    key={articulo.id}
                    onClick={() => agregarArticulo(articulo)}
                    onDoubleClick={() => mostrarPrecioUnitario(articulo)}
                    className="bg-slate-700 border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-600 font-medium py-4 px-3 rounded-lg text-center transition-all text-gray-300"
                  >
                    <div className="text-sm font-bold">{articulo.name}</div>
                    <div className="text-lg font-bold text-blue-400">{articulo.price.toFixed(2)}€</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Configuración */}
      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        esTemaOscuro={true}
        setEsTemaOscuro={() => {}}
      />

      {/* Modal de Cobro */}
      {mostrarModalCobro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Cobrar</h2>
            <div className="mb-4">
              <div className="text-lg text-white mb-2">Total a pagar:</div>
              <div className="text-3xl font-bold text-yellow-400">{calcularTotal().toFixed(2)}€</div>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Dinero recibido:</label>
              <input
                type="number"
                value={dineroRecibido}
                onChange={(e) => setDineroRecibido(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 text-white rounded-lg"
                placeholder="0.00"
              />
            </div>
            {dineroRecibido && (
              <div className="mb-4">
                <div className="text-lg text-white mb-2">Vueltas:</div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.max(0, calcularVueltas()).toFixed(2)}€
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Simulación de cobro - solo visual
                  cancelarTicket();
                  setMostrarModalCobro(false);
                  setDineroRecibido('');
                }}
                disabled={!dineroRecibido || parseFloat(dineroRecibido) < calcularTotal()}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cobrar
              </button>
              <button
                onClick={() => {
                  setMostrarModalCobro(false);
                  setDineroRecibido('');
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}