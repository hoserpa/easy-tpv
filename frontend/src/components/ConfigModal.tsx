'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService, Familia, Articulo, Ticket } from '../services/api';

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

  if (!isOpen) return null;

  if (!isOpen) return null;

  if (showCrudView) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Gestión de Datos</h2>
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
            <CrudContent entityType={selectedOption} />
          </div>
        </div>
      </div>
    );
  }

  if (showBillingView) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Facturación</h2>
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
            <BillingViewContent />
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

function BillingViewContent() {
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

  const handleViewTicket = () => {
    // Sin funcionalidad por ahora
    alert('Funcionalidad de detalle del ticket pendiente');
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
        <h3 className="text-xl font-bold text-white">Tickets</h3>
      </div>

      {/* Filtros de fecha */}
      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fecha inicio:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-600 border border-slate-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fecha fin:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-600 border border-slate-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              🗑️ Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-3 px-4">Fecha</th>
              <th className="text-left py-3 px-4">Subtotal</th>
              <th className="text-left py-3 px-4">Descuento</th>
              <th className="text-left py-3 px-4">Total</th>
              <th className="text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-slate-700 hover:bg-slate-700">
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
                    onClick={() => handleViewTicket()}
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
          <div className="text-center py-8 text-gray-400">
            No hay tickets registrados
          </div>
        )}
      </div>
    </div>
  );
}

interface CrudContentProps {
  entityType: string;
}

type CrudItem = Familia | Articulo;

function CrudContent({ entityType }: CrudContentProps) {
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
      <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          {editingItem ? 'Editar' : 'Crear'} {entityType === 'familias' ? 'Familia' : 'Artículo'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
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
        <h3 className="text-xl font-bold text-white capitalize">
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
              <th className="text-left py-3 px-4">ID</th>
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
          <div className="text-center py-8 text-gray-400">
            No hay {entityType} registrados
          </div>
        )}
      </div>
    </div>
  );
}