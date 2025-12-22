'use client';

import React, { useState } from 'react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  esTemaOscuro: boolean;
  setEsTemaOscuro: (value: boolean) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

export default function ConfigModal({ isOpen, onClose, esTemaOscuro, setEsTemaOscuro }: ConfigModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('familias');
  const [showCrudModal, setShowCrudModal] = useState(false);

  const options: SelectOption[] = [
    { value: 'familias', label: 'Familias' },
    { value: 'articulos', label: 'Artículos' }
  ];

  const handleOpenCrud = () => {
    setShowCrudModal(true);
  };

  if (!isOpen) return null;

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

      {/* Modal CRUD */}
      {showCrudModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Gestión de Datos</h2>
              <button
                onClick={() => setShowCrudModal(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seleccionar entidad:
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 rounded-lg p-4">
              <CrudContent entityType={selectedOption} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CrudContentProps {
  entityType: string;
}

interface Familia {
  id: number;
  name: string;
}

interface Articulo {
  id: number;
  name: string;
  price: number;
  family_id: number;
}

type CrudItem = Familia | Articulo;

function CrudContent({ entityType }: CrudContentProps) {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<CrudItem | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number>>({});

  const items = entityType === 'familias' ? familias : articulos;

  // Simulación de datos - en un futuro vendrá de la API
  React.useEffect(() => {
    if (entityType === 'familias') {
      setFamilias([
        { id: 1, name: 'Bebidas' },
        { id: 2, name: 'Comidas' },
        { id: 3, name: 'Postres' }
      ]);
    } else if (entityType === 'articulos') {
      setArticulos([
        { id: 1, name: 'Café', price: 1.20, family_id: 1 },
        { id: 2, name: 'Refresco', price: 1.50, family_id: 1 },
        { id: 3, name: 'Bocadillo', price: 3.50, family_id: 2 }
      ]);
    }
  }, [entityType]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(entityType === 'familias' ? { name: '' } : { name: '', price: 0, family_id: 1 });
    setIsEditing(true);
  };

  const handleEdit = (item: CrudItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      if (entityType === 'familias') {
        setFamilias(familias.filter(item => item.id !== id));
      } else {
        setArticulos(articulos.filter(item => item.id !== id));
      }
    }
  };

  const handleSave = () => {
    if (editingItem) {
      if (entityType === 'familias') {
        setFamilias(familias.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } as Familia : item
        ));
      } else {
        setArticulos(articulos.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } as Articulo : item
        ));
      }
    } else {
      if (entityType === 'familias') {
        const newItem: Familia = {
          id: Math.max(...familias.map(i => i.id), 0) + 1,
          name: String(formData.name) || ''
        };
        setFamilias([...familias, newItem]);
      } else {
        const newItem: Articulo = {
          id: Math.max(...articulos.map(i => i.id), 0) + 1,
          name: String(formData.name) || '',
          price: parseFloat(String(formData.price)) || 0,
          family_id: parseInt(String(formData.family_id)) || 1
        };
        setArticulos([...articulos, newItem]);
      }
    }
    setIsEditing(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({});
  };

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
                  value={formData.family_id || ''}
                  onChange={(e) => setFormData({ ...formData, family_id: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">Bebidas</option>
                  <option value="2">Comidas</option>
                  <option value="3">Postres</option>
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
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ❌ Cancelar
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
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          ➕ Crear {entityType === 'familias' ? 'Familia' : 'Artículo'}
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
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
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
                  <td className="py-3 px-4">{item.price.toFixed(2)}€</td>
                  <td className="py-3 px-4">
                    {item.family_id === 1 ? 'Bebidas' : item.family_id === 2 ? 'Comidas' : 'Postres'}
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