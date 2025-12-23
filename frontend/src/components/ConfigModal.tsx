'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService, Familia, Articulo, Ticket, TicketLine } from '../services/api';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  esTemaOscuro: boolean;
  setEsTemaOscuro: (value: boolean) => void;
  onDataUpdate?: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

export default function ConfigModal({ isOpen, onClose, esTemaOscuro, setEsTemaOscuro }: ConfigModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('familias');
  const [showCrudView, setShowCrudView] = useState(false);
  const [showBillingView, setShowBillingView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);







  const options: SelectOption[] = [
    { value: 'familias', label: 'Familias' },
    { value: 'articulos', label: 'Artículos' }
  ];

  const handleOpenCrud = () => {
    setShowCrudView(true);
  };

  const handleBackToMenu = () => {
    setShowCrudView(false);
    setShowBillingView(false);
  };

  const handleOpenBilling = () => {
    setShowBillingView(true);
  };

  const handleViewTicketDetail = (ticketId: number) => {
    setSelectedTicket(ticketId);
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicket(null);
  };

  if (!isOpen) return null;

  if (!isOpen) return null;

  if (showCrudView) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Gestión de Datos</h2>
            <div className="flex gap-2">
              <button
                onClick={handleBackToMenu}
                className={`${esTemaOscuro ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
              >
                ← Volver
              </button>
              <button
                onClick={onClose}
                className={`${esTemaOscuro ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
              >
                ×
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className={`block text-sm font-medium ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Seleccionar entidad:
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className={`w-full ${esTemaOscuro ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={`flex-1 overflow-y-auto rounded-lg p-4 ${esTemaOscuro ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <CrudContent entityType={selectedOption} esTemaOscuro={esTemaOscuro} />
          </div>
        </div>
      </div>
    );
  }

  if (showBillingView) {
    if (selectedTicket !== null) {
      return <TicketDetailModal ticketId={selectedTicket} onClose={handleCloseTicketDetail} esTemaOscuro={esTemaOscuro} onBack={() => setSelectedTicket(null)} />;
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Facturación</h2>
            <div className="flex gap-2">
              <button
                onClick={handleBackToMenu}
                className={`${esTemaOscuro ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
              >
                ← Volver
              </button>
              <button
                onClick={onClose}
                className={`${esTemaOscuro ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
              >
                ×
              </button>
            </div>
          </div>
          <div className={`flex-1 overflow-y-auto rounded-lg p-4 ${esTemaOscuro ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <BillingViewContent onViewTicket={handleViewTicketDetail} esTemaOscuro={esTemaOscuro} />
          </div>
        </div>
      </div>
  );
}

interface TicketDetailModalProps {
  ticketId: number;
  onClose: () => void;
  onBack: () => void;
  esTemaOscuro: boolean;
}

function TicketDetailModal({ ticketId, onClose, onBack, esTemaOscuro }: TicketDetailModalProps) {
  const [ticketData, setTicketData] = useState<{ ticket: Ticket; lines: TicketLine[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  useEffect(() => {
    const loadTicketDetail = async () => {
      setLoading(true);
      try {
        const [ticketDetail, articulosData] = await Promise.all([
          apiService.getTicket(ticketId),
          apiService.getArticulos()
        ]);
        setTicketData(ticketDetail);
        setArticulos(articulosData);
      } catch (error) {
        console.error('Error loading ticket detail:', error);
        alert('Error al cargar los detalles del ticket');
        onBack();
      } finally {
        setLoading(false);
      }
    };

    loadTicketDetail();
  }, [ticketId, onBack]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8`}>
          <div className={esTemaOscuro ? 'text-white' : 'text-gray-800'}>Cargando detalles del ticket...</div>
        </div>
      </div>
    );
  }

  if (!ticketData || !ticketData.ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8`}>
          <div className={esTemaOscuro ? 'text-white' : 'text-gray-800'}>No se pudo cargar el ticket</div>
          <button
            onClick={onBack}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const { ticket, lines } = ticketData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Detalle del Ticket #{ticket.id}</h2>
            <p className={esTemaOscuro ? 'text-gray-300' : 'text-gray-600'}>
              {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className={`${esTemaOscuro ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
            >
              ← Volver
            </button>
            <button
              onClick={onClose}
              className={`${esTemaOscuro ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
            >
              ×
            </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto rounded-lg p-4 ${esTemaOscuro ? 'bg-slate-900' : 'bg-gray-50'}`}>
          {/* Panel completo del ticket con diseño mejorado */}
          <div className={`rounded-xl shadow-2xl p-6 ${
            esTemaOscuro 
              ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600' 
              : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
          }`}>
            {/* Encabezado del ticket con icono y diseño visual */}
            <div className={`mb-6 pb-4 border-b ${esTemaOscuro ? 'border-slate-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Ticket #{ticket.id}</h3>
                    <p className={`text-sm flex items-center mt-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-600'}`}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>{parseFloat(String(ticket.total)).toFixed(2)}€</div>
                  <div className={`text-xs uppercase tracking-wider ${esTemaOscuro ? 'text-gray-400' : 'text-gray-500'}`}>Total</div>
                </div>
              </div>
            </div>

            {/* Líneas del ticket con diseño de cards */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Artículos ({lines.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lines.map((line) => {
                  const articulo = articulos.find(a => a.id === line.articulo_id);
                  return (
                    <div key={line.id} className={`rounded-lg p-3 transition-all duration-200 border ${
                      esTemaOscuro 
                        ? 'bg-slate-600 bg-opacity-50 hover:bg-slate-600 border-slate-500' 
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-300 font-semibold">{line.qty}</span>
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                              {articulo?.name || `Artículo ID: ${line.articulo_id}`}
                            </div>
                            <div className={`text-sm ${esTemaOscuro ? 'text-gray-400' : 'text-gray-600'}`}>
                              {parseFloat(String(line.unit_price)).toFixed(2)}€ 
                              {line.discount_type && line.discount_value && (
                                <span className="ml-2 text-red-400">
                                  -{line.discount_type === 'fixed' 
                                    ? `${parseFloat(String(line.discount_value)).toFixed(2)}€`
                                    : `${parseFloat(String(line.discount_value))}%`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-lg ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                            {parseFloat(String(line.total)).toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumen con diseño visual */}
            <div className="space-y-3">
              {/* Línea separadora visual */}
              <div className={`h-px ${esTemaOscuro ? 'bg-gradient-to-r from-transparent via-slate-500 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
              
              {/* Subtotal */}
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className={esTemaOscuro ? 'text-gray-300' : 'text-gray-600'}>Subtotal:</span>
                </div>
                <span className={`font-medium ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                  {parseFloat(String(ticket.subtotal)).toFixed(2)}€
                </span>
              </div>

              {/* Descuento */}
              {(ticket.discount_type && ticket.discount_value) && (
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-400">Descuento:</span>
                  </div>
                  <span className="text-red-400 font-medium">
                    {ticket.discount_type === 'fixed' 
                      ? `-${parseFloat(String(ticket.discount_value)).toFixed(2)}€`
                      : `-${parseFloat(String(ticket.discount_value))}%`}
                  </span>
                </div>
              )}

              {/* Total destacado */}
              <div className={`rounded-lg p-4 mt-4 ${
                esTemaOscuro 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-blue-900 font-bold text-lg">€</span>
                    </div>
                    <span className="text-white font-bold text-lg">Total a pagar</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{parseFloat(String(ticket.total)).toFixed(2)}€</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Configuración</h2>
          <button
            onClick={onClose}
            className={`${esTemaOscuro ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-2xl font-bold`}
          >
            ×
          </button>
        </div>
        {/* Slider de Tema */}
        <div className="mb-6 flex justify-end">
          <div className={`w-32 p-2 ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-200'} rounded-lg`}>
            <div className="flex items-center justify-between">
              {esTemaOscuro ? (
                <span className="text-blue-400 text-lg">🌙</span>
              ) : (
                <span className="text-yellow-500 text-lg">☀️</span>
              )}
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!esTemaOscuro}
                  onChange={() => setEsTemaOscuro(!esTemaOscuro)}
                />
                <div className={`w-10 h-5 ${esTemaOscuro ? 'bg-gray-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-400`}></div>
              </label>
              
              {esTemaOscuro ? (
                <span className="text-yellow-400 text-lg">☀️</span>
              ) : (
                <span className="text-indigo-600 text-lg">🌙</span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleOpenCrud}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-left"
          >
            📝 Gestión de Datos
          </button>

          <button
            onClick={handleOpenBilling}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-left"
          >
            💼 Facturación
          </button>
          
          <button
            disabled
            className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-4 rounded-lg text-left cursor-not-allowed"
          >
            ⚙️ Configuración General (Próximamente)
          </button>
          
          <button
            disabled
            className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-4 rounded-lg text-left cursor-not-allowed"
          >
            🖨️ Impresoras (Próximamente)
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingViewContent({ onViewTicket, esTemaOscuro }: { onViewTicket: (ticketId: number) => void; esTemaOscuro: boolean }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);

  // Cargar tickets desde la API
  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getTickets();
      setAllTickets(data);
      setTickets(data);
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Error loading tickets
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Filtrar tickets por fechas
  useEffect(() => {
    if (!startDate && !endDate) {
      setTickets(allTickets);
      return;
    }

    const filtered = allTickets.filter(ticket => {
      const ticketDate = new Date(ticket.created_at);
      const start = startDate ? new Date(startDate + 'T00:00:00') : new Date('1900-01-01');
      const end = endDate ? new Date(endDate + 'T23:59:59') : new Date('2100-12-31');
      return ticketDate >= start && ticketDate <= end;
    });

    setTickets(filtered);
  }, [startDate, endDate, allTickets]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };



  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Cargando tickets...</div>
      </div>
    );
  }

  return (
      <div>
        <div className="mb-4">
          <h3 className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Tickets</h3>
        </div>

        {/* Filtros de fecha */}
        <div className={`mb-6 p-4 rounded-lg ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-100 border border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                Fecha inicio:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  esTemaOscuro 
                    ? 'bg-slate-600 border border-slate-500 text-white' 
                    : 'bg-white border border-gray-300 text-gray-800'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                Fecha fin:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  esTemaOscuro 
                    ? 'bg-slate-600 border border-slate-500 text-white' 
                    : 'bg-white border border-gray-300 text-gray-800'
                }`}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
                  esTemaOscuro
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                🗑️ Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
            <thead>
              <tr className={`border-b ${esTemaOscuro ? 'border-slate-600' : 'border-gray-200'}`}>
                <th className="text-left py-3 px-4">Fecha</th>
                <th className="text-left py-3 px-4">Subtotal</th>
                <th className="text-left py-3 px-4">Descuento</th>
                <th className="text-left py-3 px-4">Total</th>
              <th className={`text-left py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className={`border-b ${esTemaOscuro ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                  <td className="py-3 px-4">
                    {new Date(ticket.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4">{parseFloat(String(ticket.subtotal)).toFixed(2)}€</td>
                  <td className="py-3 px-4">
                    {ticket.discount_type && ticket.discount_value ? (
                      ticket.discount_type === 'fixed' 
                        ? `-${parseFloat(String(ticket.discount_value)).toFixed(2)}€`
                        : `-${parseFloat(String(ticket.discount_value))}%`
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold">{parseFloat(String(ticket.total)).toFixed(2)}€</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onViewTicket(ticket.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      👁️ Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <div className={`text-center py-8 ${esTemaOscuro ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay tickets registrados
            </div>
          )}
        </div>
      </div>
  );
}

interface CrudContentProps {
  entityType: string;
  esTemaOscuro: boolean;
}

type CrudItem = Familia | Articulo;

function CrudContent({ entityType, esTemaOscuro }: CrudContentProps) {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<CrudItem | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);

  const items = entityType === 'familias' ? familias : articulos;



  // Cargar datos desde la API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (entityType === 'familias') {
        const data = await apiService.getFamilias();
        setFamilias(data);
      } else if (entityType === 'articulos') {
        const data = await apiService.getArticulos();
        setArticulos(data);
      }
    } catch (error) {
      // Error loading data
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  useEffect(() => {
    if (entityType) {
      loadData();
    }
  }, [entityType, loadData]);

  const handleCreate = () => {
    // Verificar si hay familias disponibles al crear un artículo
    if (entityType === 'articulos' && familias.length === 0) {
      alert('Debes crear al menos una familia antes de poder crear artículos');
      return;
    }
    
    setEditingItem(null);
    const defaultFamilyId = familias.length > 0 ? familias[0].id : 1;
    setFormData(entityType === 'familias' ? { name: '' } : { name: '', price: 0, familia_id: defaultFamilyId });
    setIsEditing(true);
  };

  const handleEdit = (item: CrudItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (entityType === 'familias') {
      // Verificar si hay artículos asociados a esta familia
      const articulosAsociados = articulos.filter(articulo => articulo.familia_id === id);
      
      if (articulosAsociados.length > 0) {
        alert(`No se puede eliminar esta familia porque tiene ${articulosAsociados.length} artículo(s) asociado(s).\n\nElimina primero los artículos o reasígnalos a otra familia.`);
        return;
      }
    }

    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      try {
        if (entityType === 'familias') {
          await apiService.deleteFamilia(id);
          setFamilias(familias.filter(item => item.id !== id));
        } else {
          await apiService.deleteArticulo(id);
          setArticulos(articulos.filter(item => item.id !== id));
        }
        // Notificar al componente principal con retraso
        setTimeout(() => {
          if (onDataUpdate) {
            onDataUpdate();
          }
        }, 50);
      } catch (error) {
        alert('Error al eliminar el elemento');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        if (entityType === 'familias') {
          const updated = await apiService.updateFamilia(editingItem.id, { name: String(formData.name) });
          setFamilias(familias.map(item => 
            item.id === editingItem.id ? updated : item
          ));
        } else {
          const updated = await apiService.updateArticulo(editingItem.id, {
            name: String(formData.name),
            price: parseFloat(String(formData.price)),
            familia_id: parseInt(String(formData.familia_id))
          });
          setArticulos(articulos.map(item => 
            item.id === editingItem.id ? updated : item
          ));
        }
      } else {
        if (entityType === 'familias') {
          const newItem = await apiService.createFamilia({ name: String(formData.name) });
          setFamilias([...familias, newItem]);
        } else {
          const newItem = await apiService.createArticulo({
            name: String(formData.name),
            price: parseFloat(String(formData.price)),
            familia_id: parseInt(String(formData.familia_id))
          });
          setArticulos([...articulos, newItem]);
        }
      }
      // Primero volver a la vista de lista
      setIsEditing(false);
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      alert('Error al guardar el elemento');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({});
  };

  if (loading) {
      return (
        <div className={`rounded-lg p-6 flex items-center justify-center ${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <div className={esTemaOscuro ? 'text-white' : 'text-gray-800'}>Cargando...</div>
        </div>
      );
  }

  if (isEditing) {
      return (
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-gray-100'} rounded-lg p-6 max-w-md mx-auto`}>
          <h3 className={`text-xl font-bold mb-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
          {editingItem ? 'Editar' : 'Crear'} {entityType === 'familias' ? 'Familia' : 'Artículo'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
              Nombre:
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {entityType === 'articulos' && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                  Precio:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                  Familia:
                </label>
                <select
                  value={formData.familia_id || ''}
                  onChange={(e) => setFormData({ ...formData, familia_id: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={familias.length === 0}
                >
                  {familias.length === 0 ? (
                    <option value="">No hay familias disponibles</option>
                  ) : (
                    familias.map(familia => (
                      <option key={familia.id} value={familia.id}>
                        {familia.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            💾 Guardar
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold capitalize ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
              {entityType}
            </h3>
        <button
          onClick={handleCreate}
          disabled={entityType === 'articulos' && familias.length === 0}
          className={`${entityType === 'articulos' && familias.length === 0 
            ? 'bg-gray-400 text-gray-300 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600 text-white'} font-semibold py-2 px-4 rounded-lg transition-colors`}
        >
          ➕ Crear {entityType === 'familias' ? 'Familia' : 'Artículo'}
          {entityType === 'articulos' && familias.length === 0 && (
            <span className="block text-xs mt-1">
              (Crea primero una familia)
            </span>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-slate-600">
              <th className={`text-left py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>ID</th>
              <th className={`text-left py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Nombre</th>
              {entityType === 'articulos' && (
                <>
                  <th className={`text-left py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Precio</th>
                  <th className={`text-left py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Familia</th>
                </>
              )}
              <th className="text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entityType === 'familias' ? 
              familias.map((item) => (
                <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`${articulos.filter(a => a.familia_id === item.id).length > 0 
                          ? 'bg-gray-400 text-gray-300 cursor-not-allowed' 
                          : 'bg-red-500 hover:bg-red-600 text-white'} px-3 py-1 rounded text-sm transition-colors`}
                        disabled={articulos.filter(a => a.familia_id === item.id).length > 0}
                        title={articulos.filter(a => a.familia_id === item.id).length > 0 
                          ? `Hay ${articulos.filter(a => a.familia_id === item.id).length} artículos asociados` 
                          : 'Eliminar familia'}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              )) :
              articulos.map((item) => (
                <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{parseFloat(String(item.price)).toFixed(2)}€</td>
                  <td className="py-3 px-4">
                    {familias.find(f => f.id === item.familia_id)?.name || `ID: ${item.familia_id}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {items.length === 0 && (
          <div className={`text-center py-8 ${esTemaOscuro ? 'text-gray-400' : 'text-gray-500'}`}>
            No hay {entityType} registrados
          </div>
        )}
      </div>
    </div>
  );
}