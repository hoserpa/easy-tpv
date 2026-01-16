'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService, DatosEmpresa, Ticket, TicketLine, Articulo } from '../../services/api';
import Skeleton from '../Skeleton';

interface PrintTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  esTemaOscuro: boolean;
}

export default function PrintTicketModal({ isOpen, onClose, ticketId, esTemaOscuro }: PrintTicketModalProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [lines, setLines] = useState<TicketLine[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [datosEmpresa, setDatosEmpresa] = useState<DatosEmpresa | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketDetail, articulosData, empresaData] = await Promise.all([
        apiService.getTicket(ticketId),
        apiService.getArticulos(),
        apiService.getFirstDatosEmpresa()
      ]);
      setTicket(ticketDetail.ticket);
      setLines(ticketDetail.lines);
      setArticulos(articulosData);
      setDatosEmpresa(empresaData);
    } catch (err) {
      console.error('Error loading ticket for print:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (isOpen && ticketId) {
      loadData();
    }
  }, [isOpen, ticketId, loadData]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6`}>
          <div className="text-center">
            <Skeleton height="h-4" width="w-32" className="mx-auto mb-2" />
            <Skeleton height="h-4" width="w-48" className="mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-ticket,
          .print-ticket * {
            visibility: visible;
          }
          .print-ticket {
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
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-96`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>
              Vista previa de impresión
            </h2>
            <button
              onClick={onClose}
              className={`${esTemaOscuro ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-2xl font-bold`}
            >
              ×
            </button>
          </div>

          <div className="border-2 border-gray-300 bg-white p-4 text-xs font-mono text-black max-w-sm mx-auto mb-4 print-ticket">
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
    </>
  );
}
