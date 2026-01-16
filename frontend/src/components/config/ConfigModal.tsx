'use client';

import React, { useState, useCallback } from 'react';
import { Ticket } from '../../services/api';
import ThemeSettings from './ThemeSettings';
import DataManagementView from './DataManagementView';
import BillingView from './BillingView';
import CompanyDataForm from './CompanyDataForm';
import TicketDetailModal from './TicketDetailModal';
import CatalogReportModal from './CatalogReportModal';
import TicketReportModal from './TicketReportModal';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  esTemaOscuro: boolean;
  setEsTemaOscuro: (value: boolean) => void;
}

type ViewType = 'main' | 'data-management' | 'billing' | 'company-data';

interface SelectOption {
  value: string;
  label: string;
}

export default function ConfigModal({ isOpen, onClose, esTemaOscuro, setEsTemaOscuro }: ConfigModalProps) {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedOption, setSelectedOption] = useState<string>('familias');
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showCatalogReport, setShowCatalogReport] = useState(false);
  const [showTicketReport, setShowTicketReport] = useState(false);
  const [reportTickets, setReportTickets] = useState<Ticket[]>([]);
  const [reportStartDate, setReportStartDate] = useState<string>('');
  const [reportEndDate, setReportEndDate] = useState<string>('');

  const options: SelectOption[] = [
    { value: 'familias', label: 'Familias' },
    { value: 'articulos', label: 'Artículos' }
  ];

  const handleBackToMenu = useCallback(() => {
    setCurrentView('main');
    setSelectedTicketId(null);
  }, []);

  const handleOpenCatalogReport = useCallback(() => {
    setShowCatalogReport(true);
  }, []);

  const handleOpenTicketReport = useCallback((tickets: Ticket[], startDate: string, endDate: string) => {
    setReportTickets(tickets);
    setReportStartDate(startDate);
    setReportEndDate(endDate);
    setShowTicketReport(true);
  }, []);

  const handleViewTicketDetail = useCallback((ticketId: number) => {
    setSelectedTicketId(ticketId);
  }, []);

  if (!isOpen) return null;

  if (selectedTicketId !== null) {
    return (
      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        esTemaOscuro={esTemaOscuro}
      />
    );
  }

  if (currentView === 'data-management') {
    return (
      <ModalWrapper
        title="Gestión de Datos"
        onBack={handleBackToMenu}
        onClose={onClose}
        esTemaOscuro={esTemaOscuro}
        extraButtons={
          <button
            onClick={handleOpenCatalogReport}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            📊 Informe
          </button>
        }
      >
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
        <DataManagementView entityType={selectedOption} esTemaOscuro={esTemaOscuro} />
        <CatalogReportModal
          isOpen={showCatalogReport}
          onClose={() => setShowCatalogReport(false)}
          esTemaOscuro={esTemaOscuro}
        />
      </ModalWrapper>
    );
  }

  if (currentView === 'billing') {
    return (
      <ModalWrapper
        title="Facturación"
        onBack={handleBackToMenu}
        onClose={onClose}
        esTemaOscuro={esTemaOscuro}
      >
        <BillingView
          onViewTicket={handleViewTicketDetail}
          onOpenReport={handleOpenTicketReport}
          esTemaOscuro={esTemaOscuro}
        />
        <TicketReportModal
          isOpen={showTicketReport}
          onClose={() => setShowTicketReport(false)}
          tickets={reportTickets}
          startDate={reportStartDate}
          endDate={reportEndDate}
          esTemaOscuro={esTemaOscuro}
        />
      </ModalWrapper>
    );
  }

  if (currentView === 'company-data') {
    return (
      <ModalWrapper
        title="Datos de la Empresa"
        onBack={handleBackToMenu}
        onClose={onClose}
        esTemaOscuro={esTemaOscuro}
      >
        <CompanyDataForm esTemaOscuro={esTemaOscuro} />
      </ModalWrapper>
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

        <ThemeSettings esTemaOscuro={esTemaOscuro} setEsTemaOscuro={setEsTemaOscuro} />

        <div className="space-y-4">
          <button
            onClick={() => setCurrentView('data-management')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-left"
          >
            📝 Gestión de Datos
          </button>

          <button
            onClick={() => setCurrentView('billing')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-left"
          >
            💼 Facturación
          </button>

          <button
            onClick={() => setCurrentView('company-data')}
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

interface ModalWrapperProps {
  title: string;
  onBack: () => void;
  onClose: () => void;
  esTemaOscuro: boolean;
  extraButtons?: React.ReactNode;
  children: React.ReactNode;
}

function ModalWrapper({ title, onBack, onClose, esTemaOscuro, extraButtons, children }: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
          <div className="flex gap-2">
            {extraButtons}
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
          {children}
        </div>
      </div>
    </div>
  );
}
