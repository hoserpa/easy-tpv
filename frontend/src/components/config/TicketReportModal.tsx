'use client';

import React, { useState, useEffect } from 'react';
import { apiService, DatosEmpresa, Ticket } from '../../services/api';

interface TicketReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  startDate?: string;
  endDate?: string;
  esTemaOscuro: boolean;
}

export default function TicketReportModal({ isOpen, onClose, tickets, startDate, endDate, esTemaOscuro }: TicketReportModalProps) {
  const [datosEmpresa, setDatosEmpresa] = useState<DatosEmpresa | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadEmpresaData = async () => {
      setLoading(true);
      try {
        const empresaData = await apiService.getFirstDatosEmpresa();
        setDatosEmpresa(empresaData);
      } catch (err) {
        console.error('Error loading empresa data:', err);
        setDatosEmpresa(null);
      } finally {
        setLoading(false);
      }
    };

    loadEmpresaData();
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-informe,
          .print-informe * {
            visibility: visible;
          }
          .print-informe {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 10mm;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
              Informe de Tickets
            </h2>
            <button
              onClick={onClose}
              className={`${esTemaOscuro ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-2xl font-bold`}
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando datos...</div>
          ) : (
            <>
              <div className="border-2 border-gray-300 bg-white p-4 text-sm font-mono text-black max-w-sm mx-auto mb-4 print-informe">
                <div className="text-center mb-3">
                  <div className="font-bold text-base">{datosEmpresa?.name || 'Nombre Empresa'}</div>
                  <div className="text-xs">{datosEmpresa?.nif || 'NIF/CIF'}</div>
                  <div className="text-xs">{datosEmpresa?.address || 'Dirección'}</div>
                  {datosEmpresa?.phone && <div className="text-xs">Tel: {datosEmpresa.phone}</div>}
                  {datosEmpresa?.email && <div className="text-xs">{datosEmpresa.email}</div>}
                </div>

                <div className="border-t border-dashed border-gray-400 pt-2 mb-2">
                  <div className="text-center font-bold text-sm">INFORME DE VENTAS</div>
                  <div className="text-center text-xs text-gray-600">
                    {startDate || 'Desde inicio'} - {endDate || 'Hasta hoy'}
                  </div>
                </div>

                <div className="space-y-1 mb-2">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between text-xs">
                      <div>
                        <div>#{ticket.id} - {new Date(ticket.created_at).toLocaleDateString('es-ES')}</div>
                        {ticket.discount_type && ticket.discount_value && (
                          <div className="text-gray-600">
                            Desc: {ticket.discount_type === 'fixed'
                              ? `${parseFloat(String(ticket.discount_value)).toFixed(2)}€`
                              : `${parseFloat(String(ticket.discount_value))}%`
                            }
                          </div>
                        )}
                      </div>
                      <div className="text-right font-semibold">{parseFloat(String(ticket.total)).toFixed(2)}€</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-gray-400 pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Numero de tickets:</span>
                    <span>{tickets.length}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base mt-1">
                    <span>TOTAL:</span>
                    <span>{tickets.reduce((sum, t) => sum + parseFloat(String(t.total)), 0).toFixed(2)}€</span>
                  </div>
                </div>

                <div className="text-center mt-3 pt-2 border-t border-dashed border-gray-400">
                  <div className="font-bold text-xs">Informe generado el {new Date().toLocaleString('es-ES')}</div>
                </div>
              </div>

              <div className="max-w-sm mx-auto">
                <button
                  onClick={handlePrint}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  🖨️ Imprimir Informe
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
