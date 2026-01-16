'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiService, Ticket, TicketLine, Articulo } from '../../services/api';
import { getApiErrorMessage } from '../../utils/errorUtils';
import { useToast } from '../../hooks/useToast';
import Skeleton from '../Skeleton';
import PrintTicketModal from './PrintTicketModal';

interface TicketDetailModalProps {
  ticketId: number;
  onClose: () => void;
  esTemaOscuro: boolean;
}

export default function TicketDetailModal({ ticketId, onClose, esTemaOscuro }: TicketDetailModalProps) {
  const [ticketData, setTicketData] = useState<{ ticket: Ticket; lines: TicketLine[] } | null>(null);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const { error: toastError } = useToast();
  const loadedTicketIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (ticketId === loadedTicketIdRef.current) {
      return;
    }

    loadedTicketIdRef.current = ticketId;
    setLoading(true);
    setError(null);

    const loadTicketDetail = async () => {
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
        setError(errorMessage);
        toastError(`Error al cargar los detalles del ticket: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadTicketDetail();
  }, [ticketId, toastError]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <Skeleton height="h-8" width="w-48" />
            <Skeleton height="h-8" width="w-32" />
          </div>
          <div className={`flex-1 overflow-y-auto rounded-lg p-4 ${esTemaOscuro ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <TicketDetailSkeleton esTemaOscuro={esTemaOscuro} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticketData || !ticketData.ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8`}>
          <div className={esTemaOscuro ? 'text-white' : 'text-gray-800'}>
            {error || 'No se pudo cargar el ticket'}
          </div>
          <button
            onClick={onClose}
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
              onClick={() => setShowPrintModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🖨️ Imprimir
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
          <TicketDetailContent ticket={ticket} lines={lines} articulos={articulos} esTemaOscuro={esTemaOscuro} />
        </div>
      </div>

      <PrintTicketModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        ticketId={ticketId}
        esTemaOscuro={esTemaOscuro}
      />
    </div>
  );
}

interface TicketDetailContentProps {
  ticket: Ticket;
  lines: TicketLine[];
  articulos: Articulo[];
  esTemaOscuro: boolean;
}

function TicketDetailContent({ ticket, lines, articulos, esTemaOscuro }: TicketDetailContentProps) {
  return (
    <div className={`rounded-xl shadow-2xl p-6 ${
      esTemaOscuro
        ? 'bg-slate-700 border border-slate-600'
        : 'bg-white border border-gray-200'
    }`}>
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

      <div className="space-y-3">
        <div className={`h-px ${esTemaOscuro ? 'bg-gradient-to-r from-transparent via-slate-500 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>

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
  );
}

interface TicketDetailSkeletonProps {
  esTemaOscuro: boolean;
}

function TicketDetailSkeleton({ esTemaOscuro }: TicketDetailSkeletonProps) {
  return (
    <div>
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
  );
}
