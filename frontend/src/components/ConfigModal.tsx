'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService, Familia, Articulo, Ticket, TicketLine, DatosEmpresa } from '../services/api';
import { useToast } from '../hooks/useToast';
import { getApiErrorMessage } from '../utils/errorUtils';
import ConfirmDialog from './ConfirmDialog';
import Skeleton, { TableSkeleton, ListSkeleton, CardSkeleton } from './Skeleton';

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
  const [showCompanyDataView, setShowCompanyDataView] = useState(false);
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
    setShowCompanyDataView(false);
  };

  const handleOpenBilling = () => {
    setShowBillingView(true);
  };

  const handleOpenCompanyData = () => {
    setShowCompanyDataView(true);
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
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                esTemaOscuro 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
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

function CompanyDataContent({ esTemaOscuro }: { esTemaOscuro: boolean }) {
  const [companyData, setCompanyData] = useState({
    name: '',
    nif: '',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const data = await apiService.getFirstDatosEmpresa();
      if (data) {
        setCompanyData({
          name: data.name,
          nif: data.nif,
          address: data.address,
          phone: data.phone || '',
          email: data.email || ''
        });
      }
    } catch (err) {
      // No hay datos guardados, dejamos el formulario vacío
      console.log('No hay datos de la empresa guardados:', err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiService.updateOrCreateDatosEmpresa({
        name: companyData.name,
        nif: companyData.nif,
        address: companyData.address,
        phone: companyData.phone || undefined,
        email: companyData.email || undefined
      });
      success('Datos de la empresa guardados correctamente');
    } catch (err) {
      error('Error al guardar los datos de la empresa');
      console.error('Error saving company data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-2 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
          Información de la Empresa
        </h3>
        <p className={`${esTemaOscuro ? 'text-gray-400' : 'text-gray-600'}`}>
          Configura los datos de tu empresa que aparecerán en los tickets y facturas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
              Nombre de la empresa *
            </label>
            <input
              type="text"
              value={companyData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                esTemaOscuro 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="Mi Empresa S.L."
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
              NIF / CIF *
            </label>
            <input
              type="text"
              value={companyData.nif}
              onChange={(e) => handleChange('nif', e.target.value)}
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                esTemaOscuro 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="B12345678"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
              Dirección *
            </label>
            <input
              type="text"
              value={companyData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                esTemaOscuro 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="Calle Principal, 123 - 28080 Madrid"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
              Teléfono
            </label>
            <input
              type="tel"
              value={companyData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                esTemaOscuro 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="600123456"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={companyData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                esTemaOscuro 
                  ? 'bg-slate-700 border border-slate-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="empresa@ejemplo.com"
            />
          </div>
        </div>

<div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-slate-600">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8 8 0 01-16 0" />
                </svg>
                Guardando...
              </span>
            ) : (
              '💾 Guardar Datos'
            )}
          </button>
          <button
            type="button"
            onClick={() => setCompanyData({ name: '', nif: '', address: '', phone: '', email: '' })}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              esTemaOscuro
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            🗑️ Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

if (showCompanyDataView) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Datos de la Empresa</h2>
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
          <CompanyDataContent esTemaOscuro={esTemaOscuro} />
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
  const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
  const [datosEmpresa, setDatosEmpresa] = useState<DatosEmpresa | null>(null);
  const { error } = useToast();

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
      } catch (err) {
        console.error('Error loading ticket detail:', err);
        const errorMessage = getApiErrorMessage(err);
        error(`Error al cargar los detalles del ticket: ${errorMessage}`);
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
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <Skeleton height="h-8" width="w-48" />
            <Skeleton height="h-8" width="w-32" />
          </div>
          <div className={`flex-1 overflow-y-auto rounded-lg p-4 ${esTemaOscuro ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Skeleton del encabezado del ticket */}
            <div className={`mb-6 pb-4 border-b ${esTemaOscuro ? 'border-slate-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <Skeleton height="h-6" width="w-32" />
                    <Skeleton height="h-4" width="w-48" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton height="h-10" width="w-24" />
                  <Skeleton height="h-3" width="w-16" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Skeleton de las líneas del ticket */}
            <div className="mb-6">
              <div className="mb-4">
                <Skeleton height="h-6" width="w-36" />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={`rounded-lg p-3 border ${esTemaOscuro ? 'border-slate-500' : 'border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <Skeleton height="h-4" width="w-3/4" />
                          <Skeleton height="h-3" width="w-1/2" />
                        </div>
                      </div>
                      <Skeleton height="h-6" width="w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton del resumen */}
            <div className="space-y-3">
              <div className={`h-px ${esTemaOscuro ? 'bg-gradient-to-r from-transparent via-slate-500 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
              <div className="flex justify-between items-center py-2">
                <Skeleton height="h-4" width="w-24" />
                <Skeleton height="h-5" width="w-20" />
              </div>
              <div className={`rounded-lg p-4 mt-4 ${esTemaOscuro ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-400 rounded-full animate-pulse"></div>
                    <Skeleton height="h-5" width="w-32" />
                  </div>
                  <Skeleton height="h-8" width="w-28" />
                </div>
              </div>
            </div>
          </div>
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

  const handleOpenPrintModal = async () => {
    try {
      const empresaData = await apiService.getFirstDatosEmpresa();
      setDatosEmpresa(empresaData);
      setMostrarModalImpresion(true);
    } catch (err) {
      error('Error al cargar los datos de la empresa');
    }
  };

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
              onClick={handleOpenPrintModal}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🖨️ Imprimir
            </button>
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
              ? 'bg-linear-to-br from-slate-700 to-slate-800 border border-slate-600' 
              : 'bg-linear-to-br from-white to-gray-50 border border-gray-200'
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
              <div className={`h-px ${esTemaOscuro ? 'bg-linear-to-r from-transparent via-slate-500 to-transparent' : 'bg-linear-to-r from-transparent via-gray-300 to-transparent'}`}></div>
              
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
                  ? 'bg-linear-to-r from-blue-600 to-blue-700' 
                  : 'bg-linear-to-r from-blue-500 to-blue-600'
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

      {/* Modal de Impresión */}
      {mostrarModalImpresion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-96`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
                Vista previa de impresión
              </h2>
              <button
                onClick={() => setMostrarModalImpresion(false)}
                className={`${esTemaOscuro ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-2xl font-bold`}
              >
                ×
              </button>
            </div>
            
            <div className="border-2 border-gray-300 bg-white p-4 text-xs font-mono text-black max-w-sm mx-auto mb-4">
              <div className="text-center mb-3">
                <div className="font-bold text-sm">{datosEmpresa?.name || 'Nombre Empresa'}</div>
                <div>{datosEmpresa?.nif || 'NIF/CIF'}</div>
                <div>{datosEmpresa?.address || 'Dirección'}</div>
                {datosEmpresa?.phone && <div>Tel: {datosEmpresa.phone}</div>}
                {datosEmpresa?.email && <div>{datosEmpresa.email}</div>}
              </div>
              
              <div className="border-t border-dashed border-gray-400 pt-2 mb-2">
                <div className="text-center">Ticket #{ticket.id}</div>
                <div className="text-center text-gray-600">
                  {new Date(ticket.created_at).toLocaleString('es-ES')}
                </div>
              </div>

              <div className="space-y-1 mb-2">
                {lines.map((line) => {
                  const articulo = articulos.find(a => a.id === line.articulo_id);
                  return (
                    <div key={line.id} className="flex justify-between">
                      <div className="flex-1">
                        <div>{line.qty}x {articulo?.name || 'Artículo'}</div>
                        <div className="text-gray-600">{parseFloat(String(line.unit_price)).toFixed(2)}€/ud</div>
                      </div>
                      <div className="text-right">{parseFloat(String(line.total)).toFixed(2)}€</div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-dashed border-gray-400 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{parseFloat(String(ticket.subtotal)).toFixed(2)}€</span>
                </div>
                {ticket.discount_type && ticket.discount_value && (
                  <div className="flex justify-between text-gray-600">
                    <span>Descuento:</span>
                    <span>
                      {ticket.discount_type === 'fixed' 
                        ? `-${parseFloat(String(ticket.discount_value)).toFixed(2)}€`
                        : `-${parseFloat(String(ticket.discount_value))}%`
                      }
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-1">
                  <span>TOTAL:</span>
                  <span>{parseFloat(String(ticket.total)).toFixed(2)}€</span>
                </div>
              </div>

              <div className="text-center mt-3 pt-2 border-t border-dashed border-gray-400">
                <div className="font-bold">¡Gracias por su compra!</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>
      )}
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
                <div className={`w-10 h-5 ${esTemaOscuro ? 'bg-gray-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-px after:left-px after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-400`}></div>
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
            onClick={handleOpenCompanyData}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-left"
          >
            🏢 Datos de la Empresa
          </button>

          <button
            disabled
            className="w-full bg-gray-600 text-gray-400 font-semibold py-3 px-4 rounded-lg text-left cursor-not-allowed"
          >
            ⚙️ Configuración General (Próximamente)
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingViewContent({ onViewTicket, esTemaOscuro }: { onViewTicket: (ticketId: number) => void; esTemaOscuro: boolean }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);

  // Cargar tickets desde la API
  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getTickets();
      setAllTickets(data);
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
      <div>
        <div className="mb-4">
          <Skeleton height="h-8" width="w-32" />
        </div>

        {/* Skeleton de filtros de fecha */}
        <div className={`mb-6 p-4 rounded-lg ${esTemaOscuro ? 'bg-slate-700' : 'bg-gray-100 border border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Skeleton height="h-4" width="w-24" className="mb-2" />
              <Skeleton height="h-10" />
            </div>
            <div>
              <Skeleton height="h-4" width="w-20" className="mb-2" />
              <Skeleton height="h-10" />
            </div>
            <div>
              <Skeleton height="h-10" />
            </div>
          </div>
        </div>

        {/* Skeleton de la tabla */}
        <div className="overflow-x-auto">
          <TableSkeleton rows={5} columns={5} />
        </div>
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
              <th className="text-left py-3 px-4">Acciones</th>
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { success, error, warning } = useToast();

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
    } catch (err) {
      // Error loading data
      console.error('Error loading data:', err);
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
      warning('Debes crear al menos una familia antes de poder crear artículos');
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
        error(`No se puede eliminar esta familia porque tiene ${articulosAsociados.length} artículo(s) asociado(s). Elimina primero los artículos o reasígnalos a otra familia.`);
        return;
      }
    }

    setItemToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (entityType === 'familias') {
        await apiService.deleteFamilia(itemToDelete);
        setFamilias(prevFamilias => prevFamilias.filter(item => item.id !== itemToDelete));
        success('Familia eliminada correctamente');
      } else {
        await apiService.deleteArticulo(itemToDelete);
        setArticulos(prevArticulos => prevArticulos.filter(item => item.id !== itemToDelete));
        success('Artículo eliminado correctamente');
      }        
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      error(`Error al eliminar el ${entityType === 'familias' ? 'familia' : 'artículo'}: ${errorMessage}`);
      console.error('Error deleting item:', err);
    } finally {
      setShowConfirmDialog(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setItemToDelete(null);
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
      success(`${entityType === 'familias' ? 'Familia' : 'Artículo'} guardado correctamente`);
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      error(`Error al guardar el ${entityType === 'familias' ? 'familia' : 'artículo'}: ${errorMessage}`);
      console.error('Error saving item:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({});
  };

  if (loading) {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton height="h-7" width="w-32" />
            <Skeleton height="h-10" width="w-40" />
          </div>

          <div className="overflow-x-auto">
            <ListSkeleton items={entityType === 'familias' ? 5 : 8} />
          </div>

          {/* Skeleton para empty state */}
          {Math.random() > 0.5 && (
            <div className={`text-center py-8 ${esTemaOscuro ? 'text-gray-400' : 'text-gray-500'}`}>
              <Skeleton height="h-4" width="w-48" className="mx-auto" />
            </div>
          )}
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
                className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  esTemaOscuro 
                    ? 'bg-slate-700 border border-slate-600 text-white' 
                    : 'bg-white border border-gray-300 text-gray-800'
                }`}
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
                  className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    esTemaOscuro 
                      ? 'bg-slate-700 border border-slate-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                  Familia:
                </label>
                <select
                  value={formData.familia_id || ''}
                  onChange={(e) => setFormData({ ...formData, familia_id: parseInt(e.target.value) })}
                  className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    esTemaOscuro 
                      ? 'bg-slate-700 border border-slate-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-800'
                  }`}
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
        <table className={`w-full ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
          <thead>
            <tr className={`border-b ${esTemaOscuro ? 'border-slate-600' : 'border-gray-200'}`}>
              <th className="text-left py-3 px-4">Nombre</th>
              {entityType === 'articulos' && (
                <>
                  <th className="text-left py-3 px-4">Precio</th>
                  <th className="text-left py-3 px-4">Familia</th>
                </>
              )}
              <th className="text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
              {entityType === 'familias' ? 
                familias.map((item) => (
                  <tr key={item.id} className={`border-b ${esTemaOscuro ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                    <td className={`py-3 px-4 font-medium ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>{item.name}</td>
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
                <tr key={item.id} className={`border-b ${esTemaOscuro ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                  <td className={`py-3 px-4 font-medium ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>{item.name}</td>
                  <td className={`py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>{parseFloat(String(item.price)).toFixed(2)}€</td>
                  <td className={`py-3 px-4 ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
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

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={`¿Eliminar ${entityType === 'familias' ? 'familia' : 'artículo'}?`}
        message={`Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este ${entityType === 'familias' ? 'familia' : 'artículo'}?`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        esTemaOscuro={esTemaOscuro}
      />
    </div>
  );
}