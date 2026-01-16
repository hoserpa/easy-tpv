'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiService, Familia, Articulo } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { getApiErrorMessage } from '../../utils/errorUtils';
import ConfirmDialog from '../ConfirmDialog';
import Skeleton from '../Skeleton';

interface CrudContentProps {
  entityType: string;
  esTemaOscuro: boolean;
}

type CrudItem = Familia | Articulo;

interface FormData {
  name: string;
  price?: number;
  familia_id?: number;
}

export default function DataManagementView({ entityType, esTemaOscuro }: CrudContentProps) {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<CrudItem | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '' });
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { success, error, warning } = useToast();

  const items = entityType === 'familias' ? familias : articulos;

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
    setFormData({ ...item } as FormData);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (entityType === 'familias') {
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

      setIsEditing(false);
      setEditingItem(null);
      setFormData({ name: '' });
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
    setFormData({ name: '' });
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton height="h-7" width="w-32" />
          <Skeleton height="h-10" width="w-40" />
        </div>

        <div className="overflow-x-auto">
          <div className="space-y-2">
            {Array.from({ length: entityType === 'familias' ? 5 : 8 }).map((_, index) => (
              <Skeleton key={index} height="h-12" />
            ))}
          </div>
        </div>

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
