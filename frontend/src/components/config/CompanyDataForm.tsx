'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../hooks/useToast';

interface CompanyDataFormProps {
  esTemaOscuro: boolean;
}

interface CompanyData {
  name: string;
  nif: string;
  address: string;
  phone: string;
  email: string;
}

export default function CompanyDataForm({ esTemaOscuro }: CompanyDataFormProps) {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    nif: '',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    setLoading(true);
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
      console.log('No hay datos de la empresa guardados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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
      setSaving(false);
    }
  };

  const handleClear = () => {
    setCompanyData({ name: '', nif: '', address: '', phone: '', email: '' });
  };

  if (loading) {
    return <div className="text-center py-8">Cargando datos...</div>;
  }

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
            disabled={saving}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {saving ? (
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
            onClick={handleClear}
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
