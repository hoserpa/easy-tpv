'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService, Ticket } from '../../services/api';
import Skeleton from '../Skeleton';

interface BillingViewProps {
  onViewTicket: (ticketId: number) => void;
  onOpenReport: (tickets: Ticket[], startDate: string, endDate: string) => void;
  esTemaOscuro: boolean;
}

export default function BillingView({ onViewTicket, onOpenReport, esTemaOscuro }: BillingViewProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getTickets();
      setAllTickets(data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

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

        <div className="overflow-x-auto">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height="h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold ${esTemaOscuro ? 'text-white' : 'text-gray-800'}`}>Tickets</h3>
        <button
          onClick={() => onOpenReport(tickets, startDate, endDate)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          📊 Informe
        </button>
      </div>

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
