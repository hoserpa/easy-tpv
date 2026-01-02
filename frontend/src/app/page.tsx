'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ConfigModal from '../components/ConfigModal';
import { apiService, Familia, Articulo } from '../services/api';
import { useToast } from '../hooks/useToast';
import { getApiErrorMessage } from '../utils/errorUtils';
import Skeleton, { CardSkeleton } from '../components/Skeleton';



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
  const [modoEdicion, setModoEdicion] = useState<'precio' | 'cantidad' | 'dtoFijo' | 'dtoPorcentaje' | null>(null);
  const [nextId, setNextId] = useState(1);
  const [dineroRecibido, setDineroRecibido] = useState('');
  const [esTemaOscuro, setEsTemaOscuro] = useState(true);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const { success, error } = useToast();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos desde la API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [familiasData, articulosData] = await Promise.all([
        apiService.getFamilias(),
        apiService.getArticulos()
      ]);
      const sortedFamilias = [...familiasData].sort((a, b) => a.id - b.id);
      setFamilias(sortedFamilias);
      setArticulos(articulosData);
    } catch (error) {
      // Error loading data
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarArticulo = (articulo: Articulo) => {
    const precioFinal = parseFloat(String(articulo.price));
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
        id: nextId,
        articulo,
        cantidad: cantidadArticulo,
        precioUnitario: precioFinal,
        descuentoTipo: null,
        descuentoValor: 0,
        total: precioFinal * cantidadArticulo
      };
      setNextId(nextId + 1);
      
      setLineasTicket([...lineasTicket, nuevaLinea]);
    }
    
    limpiarCalculadora();
    setCantidadArticulo(1);
  };



  const agregarDigito = useCallback((digito: string) => {
    let nuevoValor;
    if (valorCalculadora === '0') {
      nuevoValor = digito;
    } else {
      nuevoValor = valorCalculadora + digito;
    }
    
    // Limitar a 2 decimales para modos de descuento y precio
    if ((modoEdicion === 'dtoFijo' || modoEdicion === 'dtoPorcentaje' || modoEdicion === 'precio') && nuevoValor.includes('.')) {
      const partes = nuevoValor.split('.');
      if (partes[1] && partes[1].length > 2) {
        return; // No agregar más dígitos si ya hay 2 decimales
      }
    }
    
    setValorCalculadora(nuevoValor);
    
    // Actualizar artículo seleccionado en tiempo real según el modo
    if (lineaSeleccionada !== null && modoEdicion) {
      const lineasActualizadas = lineasTicket.map(linea => {
        if (linea.id === lineaSeleccionada) {
          if (modoEdicion === 'precio') {
            const nuevoPrecio = parseFloat(nuevoValor) || 0;
            return {
              ...linea,
              precioUnitario: nuevoPrecio,
              total: nuevoPrecio * linea.cantidad
            };
          } else if (modoEdicion === 'cantidad') {
            const nuevaCantidad = parseInt(nuevoValor) || 1;
            return {
              ...linea,
              cantidad: nuevaCantidad,
              total: nuevaCantidad * linea.precioUnitario
            };
          } else if (modoEdicion === 'dtoFijo') {
            const dtoValor = parseFloat(nuevoValor) || 0;
            const totalSinDto = linea.precioUnitario * linea.cantidad;
            const nuevoTotal = Math.max(0, totalSinDto - dtoValor);
            return {
              ...linea,
              descuentoTipo: 'fixed' as const,
              descuentoValor: dtoValor,
              total: nuevoTotal
            };
          } else if (modoEdicion === 'dtoPorcentaje') {
            const dtoValor = parseFloat(nuevoValor) || 0;
            const totalSinDto = linea.precioUnitario * linea.cantidad;
            const nuevoTotal = Math.max(0, totalSinDto - (totalSinDto * dtoValor / 100));
            return {
              ...linea,
              descuentoTipo: 'percent' as const,
              descuentoValor: dtoValor,
              total: nuevoTotal
            };
          }
        }
        return linea;
      });
      setLineasTicket(lineasActualizadas);
    }
  }, [valorCalculadora, lineaSeleccionada, modoEdicion, lineasTicket]);

  const agregarPunto = useCallback(() => {
    // Permitir punto decimal solo para modos que lo necesiten
    if (!valorCalculadora.includes('.') && (modoEdicion === 'dtoFijo' || modoEdicion === 'dtoPorcentaje' || modoEdicion === 'precio')) {
      const nuevoValor = valorCalculadora + '.';
      setValorCalculadora(nuevoValor);
      
      // Actualizar precio del artículo seleccionado en tiempo real (solo para precio)
      if (lineaSeleccionada !== null && (modoEdicion === 'precio' || modoEdicion === 'dtoFijo')) {
        const nuevoPrecio = parseFloat(nuevoValor) || 0;
        const lineasActualizadas = lineasTicket.map(linea => {
          if (linea.id === lineaSeleccionada) {
            if (modoEdicion === 'precio') {
              return {
                ...linea,
                precioUnitario: nuevoPrecio,
                total: nuevoPrecio * linea.cantidad
              };
            } else if (modoEdicion === 'dtoFijo') {
              const totalSinDto = linea.precioUnitario * linea.cantidad;
              const nuevoTotal = Math.max(0, totalSinDto - nuevoPrecio);
              return {
                ...linea,
                descuentoTipo: 'fixed' as const,
                descuentoValor: nuevoPrecio,
                total: nuevoTotal
              };
            }
          }
          return linea;
        });
        setLineasTicket(lineasActualizadas);
      }
    }
  }, [valorCalculadora, lineaSeleccionada, modoEdicion, lineasTicket]);

  const limpiarCalculadora = useCallback(() => {
    setValorCalculadora('0');
  }, []);

  const articulosFiltrados = familiaSeleccionada 
    ? articulos.filter(a => a.familia_id === familiaSeleccionada.id)
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



  if (loading) {
    return (
      <div className={`flex flex-col h-screen ${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-100'}`}>
        {/* Panel superior */}
        <div className={`${esTemaOscuro ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'} border-b p-4`}>
          <div className="flex justify-between items-center">
            <Skeleton height="h-8" width="w-16" />
            <div className="flex gap-3">
              <Skeleton height="h-12" width="w-32" />
              <Skeleton height="h-12" width="w-12" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-1">
          {/* Panel izquierdo: Resumen del ticket y calculadora */}
          <div className={`w-1/3 ${esTemaOscuro ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'} border-r flex flex-col`}>
            {/* Resumen del ticket */}
            <div className={`flex-1 p-4 ${esTemaOscuro ? 'border-slate-600' : 'border-gray-200'} border-b flex flex-col`}>
              <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4 flex-1 flex flex-col`}>
                <Skeleton height="h-7" width="w-20" className="mb-4" />
                <div className="flex-1 space-y-3 mb-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className={`rounded-lg p-3 flex items-center justify-between ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div className="flex-1">
                        <Skeleton height="h-4" width="w-32" />
                        <Skeleton height="h-3" width="w-20" className="mt-1" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Skeleton height="h-6" width="w-16" />
                        <Skeleton variant="circular" height="h-6" width="w-6" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Resumen de totales */}
                <div className={`p-3 rounded-lg ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div className="flex justify-between mb-2">
                    <Skeleton height="h-4" width="w-16" />
                    <Skeleton height="h-5" width="w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton height="h-5" width="w-12" />
                    <Skeleton height="h-6" width="w-24" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calculadora */}
            <div className={`p-4 ${esTemaOscuro ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="mb-3">
                <Skeleton height="h-10" width="w-full" />
              </div>
              <div className="grid grid-cols-4 gap-2 h-40">
                {Array.from({ length: 16 }).map((_, index) => (
                  <Skeleton key={index} height="h-full" className="rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Panel derecho: Familias y artículos */}
          <div className={`w-2/3 ${esTemaOscuro ? 'bg-slate-900' : 'bg-white'} flex flex-col`}>
            {/* Familias */}
            <div className={`h-1/2 p-4 ${esTemaOscuro ? 'border-slate-600' : 'border-gray-300'} border-b`}>
              <Skeleton height="h-7" width="w-24" className="mb-4" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <CardSkeleton key={index} height="h-20" />
                ))}
              </div>
            </div>

            {/* Artículos */}
            <div className="h-1/2 p-4">
              <Skeleton height="h-7" width="w-28" className="mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, index) => (
                  <CardSkeleton key={index} height="h-20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-100'}`}>
      {/* Panel superior */}
      <div className={`${esTemaOscuro ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'} border-b p-4`}>
        <div className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>TPV</h1>
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
              onClick={() => {
                setIsConfigOpen(true);
                // No necesitamos recargar aquí, el modal ya cargará los datos
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1">
        {/* Panel izquierdo: Resumen del ticket y calculadora */}
        <div className={`w-1/3 ${esTemaOscuro ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'} border-r flex flex-col`}>
          {/* Resumen del ticket */}
          <div className={`flex-1 p-4 ${esTemaOscuro ? 'border-slate-600' : 'border-gray-200'} border-b flex flex-col`}>
            <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4 flex-1 flex flex-col`}>
              <h2 className={`text-xl font-bold mb-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Ticket</h2>
              <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                {lineasTicket.map((linea) => (
                  <div 
                    key={linea.id} 
                     className={`rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${
                       lineaSeleccionada === linea.id 
                         ? 'bg-blue-600 border-2 border-blue-400' 
                         : esTemaOscuro ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'
                     }`}
                     onClick={() => seleccionarLinea(linea.id)}
                   >
                     <div className="flex-1">
                       <div className={`font-medium ${lineaSeleccionada === linea.id ? 'text-white' : esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                         {linea.articulo.name}
                       </div>
                        <div className={`text-sm ${lineaSeleccionada === linea.id ? 'text-white' : esTemaOscuro ? 'text-gray-400' : 'text-gray-700'}`}>
                          {linea.cantidad} ud. × {parseFloat(String(linea.precioUnitario)).toFixed(2)}€
                          {linea.descuentoTipo && (
                            <span className="text-orange-400 ml-2">
                              -{linea.descuentoValor}{linea.descuentoTipo === 'percent' ? '%' : '€'}
                            </span>
                          )}
                        </div>
                     </div>
                     <div className="flex items-center">
                         <span className={`font-bold text-lg mr-4 ${lineaSeleccionada === linea.id ? 'text-white' : esTemaOscuro ? 'text-white' : 'text-gray-900'}`}>
                          {parseFloat(String(linea.total)).toFixed(2)}€
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
              <div className={`border-t ${esTemaOscuro ? 'border-slate-600' : 'border-gray-300'} pt-4 mt-auto`}>
                <div className={`flex justify-between font-bold text-2xl ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                  <span>Total:</span>
                   <span>{parseFloat(String(calcularTotal())).toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculadora */}
          <div className="flex-1 p-4">
            <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-50'} rounded-lg p-4 h-full flex flex-col`}>
              <div className="mb-4">
                <input 
                  type="text" 
                  className={`w-full text-right text-2xl font-bold p-3 ${esTemaOscuro ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg`}
                  value={parseFloat(valorCalculadora).toFixed(2)}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 grid-rows-4 gap-1 flex-1">
                {/* Fila 1 */}
                <button onClick={() => agregarDigito('7')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">7</button>
                <button onClick={() => agregarDigito('8')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">8</button>
                <button onClick={() => agregarDigito('9')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">9</button>
                <button onClick={() => {setModoEdicion('dtoPorcentaje'); limpiarCalculadora();}} disabled={!lineaSeleccionada} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Dto%</button>
                
                {/* Fila 2 */}
                <button onClick={() => agregarDigito('4')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">4</button>
                <button onClick={() => agregarDigito('5')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">5</button>
                <button onClick={() => agregarDigito('6')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">6</button>
                <button onClick={() => {setModoEdicion('dtoFijo'); limpiarCalculadora();}} disabled={!lineaSeleccionada} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Dto€</button>
                
                {/* Fila 3 */}
                <button onClick={() => agregarDigito('1')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">1</button>
                <button onClick={() => agregarDigito('2')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">2</button>
                <button onClick={() => agregarDigito('3')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">3</button>
                <button onClick={() => {setModoEdicion('cantidad'); limpiarCalculadora();}} disabled={!lineaSeleccionada} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Can</button>
                
                {/* Fila 4 */}
                <button onClick={() => agregarDigito('0')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">0</button>
                <button onClick={agregarPunto} className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-lg transition-colors flex items-center justify-center h-full">.</button>
                <button onClick={limpiarCalculadora} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">C</button>
                <button onClick={() => {setModoEdicion('precio'); limpiarCalculadora();}} disabled={!lineaSeleccionada} className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold rounded text-sm transition-colors flex items-center justify-center h-full">Prec</button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho: Familias y artículos */}
        <div className={`w-2/3 ${esTemaOscuro ? 'bg-slate-900' : 'bg-white'} flex flex-col`}>
          {/* Familias */}
          <div className={`h-1/2 p-4 ${esTemaOscuro ? 'border-slate-600' : 'border-gray-300'} border-b`}>
            <h2 className={`text-xl font-bold mb-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Familias</h2>
            {loading ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <CardSkeleton key={index} height="h-20" />
                ))}
              </div>
            ) : (
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
            )}
          </div>

          {/* Artículos */}
          <div className="h-1/2 p-4">
            <h2 className={`text-xl font-bold mb-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Artículos</h2>
            {loading ? (
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, index) => (
                  <CardSkeleton key={index} height="h-20" />
                ))}
              </div>
            ) : familiaSeleccionada ? (
              <div className="grid grid-cols-4 gap-3">
                {articulos
                  .filter(articulo => articulo.familia_id === familiaSeleccionada.id)
                  .map((articulo) => (
                    <button
                      key={articulo.id}
                      onClick={() => agregarArticulo(articulo)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 px-4 rounded-lg text-center transition-colors"
                    >
                      <div className="text-lg">{articulo.name}</div>
                      <div className="text-sm opacity-75">{parseFloat(String(articulo.price)).toFixed(2)}€</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${esTemaOscuro ? 'text-gray-400' : 'text-gray-500'}`}>
                  Selecciona una familia para ver los artículos
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Modal de Configuración */}
      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => {
          setIsConfigOpen(false);
          loadData(); // Recargar datos al cerrar configuración
        }} 
        esTemaOscuro={esTemaOscuro}
        setEsTemaOscuro={setEsTemaOscuro}
      />

      {/* Modal de Cobro */}
      {mostrarModalCobro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-150 max-h-[80vh] overflow-y-auto`}>
            <h2 className={`text-2xl font-bold mb-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Resumen del Ticket</h2>
            
            {/* Resumen de artículos */}
            <div className={`mb-6 p-4 rounded-lg ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-50'}`}>
              <div className="space-y-2">
                {lineasTicket.map((linea) => (
                  <div key={linea.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className={`font-medium ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                        {linea.cantidad} × {linea.articulo.name}
                      </div>
                      <div className={`text-sm ${esTemaOscuro ? 'text-gray-400' : 'text-gray-600'}`}>
                        {parseFloat(String(linea.precioUnitario)).toFixed(2)}€/ud
                        {linea.descuentoTipo && (
                          <span className="text-orange-400 ml-2">
                            -{linea.descuentoValor}{linea.descuentoTipo === 'percent' ? '%' : '€'} dto
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                      {parseFloat(String(linea.total)).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de totales */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className={`${esTemaOscuro ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal:</span>
                <span className={`font-medium ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                  {parseFloat(String(lineasTicket.reduce((total, linea) => {
                    const subtotal = linea.precioUnitario * linea.cantidad;
                    return total + subtotal;
                  }, 0))).toFixed(2)}€
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${esTemaOscuro ? 'text-gray-400' : 'text-gray-600'}`}>Descuentos:</span>
                <span className={`font-medium text-orange-400`}>
                  -{parseFloat(String(lineasTicket.reduce((total, linea) => {
                    if (linea.descuentoTipo) {
                      const subtotal = linea.precioUnitario * linea.cantidad;
                      if (linea.descuentoTipo === 'fixed') {
                        return total + linea.descuentoValor;
                      } else {
                        return total + (subtotal * linea.descuentoValor / 100);
                      }
                    }
                    return total;
                  }, 0))).toFixed(2)}€
                </span>
              </div>
              
              <div className={`flex justify-between text-xl font-bold pt-3 border-t ${esTemaOscuro ? 'border-slate-600 text-white' : 'border-gray-300 text-gray-800'}`}>
                <span>Total:</span>
                 <span className="text-yellow-400">{parseFloat(String(calcularTotal())).toFixed(2)}€</span>
              </div>
            </div>

            {/* Formulario de cobro */}
            <div className="mb-6">
              <div className="mb-4">
                <div className={`text-lg ${esTemaOscuro ? 'text-white' : 'text-gray-700'} mb-2`}>Total a pagar:</div>
                 <div className="text-3xl font-bold text-yellow-400">{parseFloat(String(calcularTotal())).toFixed(2)}€</div>
              </div>
              
              <div className="mb-4">
                <label className={`block ${esTemaOscuro ? 'text-white' : 'text-gray-700'} mb-2`}>Dinero recibido:</label>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 10, 20, 50].map((billete) => (
                    <button
                      key={billete}
                      onClick={() => setDineroRecibido(billete.toString())}
                      className={`p-4 rounded-lg font-bold text-lg transition-colors ${
                        dineroRecibido === billete.toString()
                          ? 'bg-blue-600 text-white'
                          : esTemaOscuro 
                            ? 'bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300'
                      }`}
                    >
                      {billete}€
                    </button>
                  ))}
                </div>
                {dineroRecibido && (
                  <div className={`mt-3 p-3 rounded-lg ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <div className={`text-sm ${esTemaOscuro ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Recibido:</div>
                    <div className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                      {dineroRecibido}€
                    </div>
                  </div>
                )}
              </div>
              
              {dineroRecibido && (
                <div className="mb-4">
                  <div className={`text-lg ${esTemaOscuro ? 'text-white' : 'text-gray-700'} mb-2`}>Vueltas:</div>
                  <div className="text-2xl font-bold text-green-400">
                     {parseFloat(String(Math.max(0, calcularVueltas()))).toFixed(2)}€
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    // Preparar datos del ticket para la API
                    const linesData = lineasTicket.map(linea => ({
                      articulo_id: Number(linea.articulo.id),
                      qty: Number(linea.cantidad),
                      unit_price: Number(parseFloat(String(linea.precioUnitario))),
                      discount_type: linea.descuentoTipo || null,
                      discount_value: linea.descuentoValor ? Number(linea.descuentoValor) : null
                    }));

                    // Calcular subtotal del ticket (suma de subtotales sin descuentos)
                    const subtotalTicket = linesData.reduce((total, linea) => {
                      return total + (linea.qty * linea.unit_price);
                    }, 0);

                    // Calcular total del ticket usando la misma lógica que el modal de cobro
                    const totalTicket = calcularTotal();

                    // Calcular descuento total del ticket
                    const totalDescuentoTicket = subtotalTicket - totalTicket;

                    // Determinar tipo de descuento del ticket según las líneas
                    let ticketDiscountType: 'fixed' | 'percent' | null = null;
                    let discountValueForBackend: number | null = null;

                    if (totalDescuentoTicket > 0) {
                      const discountedLines = lineasTicket.filter(linea => linea.descuentoTipo && linea.descuentoValor);
                      const allFixed = discountedLines.every(linea => linea.descuentoTipo === 'fixed');
                      
                      if (allFixed) {
                        // Si todos los descuentos son fijos, enviar como 'fixed' con valor en euros
                        ticketDiscountType = 'fixed';
                        discountValueForBackend = totalDescuentoTicket;
                      } else {
                        // Si hay porcentajes o mezcla, enviar como 'percent' con el porcentaje sobre el subtotal
                        ticketDiscountType = 'percent';
                        discountValueForBackend = (totalDescuentoTicket / subtotalTicket) * 100;
                      }
                    }

                    const ticketData = {
                      lines: linesData,
                      subtotal: subtotalTicket,
                      discount_type: ticketDiscountType,
                      discount_value: discountValueForBackend,
                      total: totalTicket
                    };





                    // Enviar a la API
                    await apiService.createTicket(ticketData);

                    // Éxito: cerrar modal y limpiar
                    let mensajeExito = 'Ticket guardado correctamente';
                    if (totalDescuentoTicket > 0) {
                      mensajeExito += ` (Descuento: ${totalDescuentoTicket.toFixed(2)}€)`;
                    }
                    success(mensajeExito);
                    cancelarTicket();
                    setMostrarModalCobro(false);
                    setDineroRecibido('');
                  } catch (err) {
                    // Extraer mensaje de error del backend
                    const errorMessage = getApiErrorMessage(err);
                    error(`Error al guardar el ticket: ${errorMessage}`);
                  }
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