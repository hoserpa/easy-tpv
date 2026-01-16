'use client';

import React, { useState, useEffect } from 'react';
import { apiService, DatosEmpresa, Familia, Articulo } from '../../services/api';

interface CatalogReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  esTemaOscuro: boolean;
}

export default function CatalogReportModal({ isOpen, onClose, esTemaOscuro }: CatalogReportModalProps) {
  const [datosEmpresa, setDatosEmpresa] = useState<DatosEmpresa | null>(null);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [empresaData, familiasData, articulosData] = await Promise.all([
          apiService.getFirstDatosEmpresa(),
          apiService.getFamilias(),
          apiService.getArticulos()
        ]);
        setDatosEmpresa(empresaData);
        setFamilias(familiasData);
        setArticulos(articulosData);
      } catch (err) {
        const [familiasData, articulosData] = await Promise.all([
          apiService.getFamilias(),
          apiService.getArticulos()
        ]);
        setFamilias(familiasData);
        setArticulos(articulosData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
          .print-catalogo,
          .print-catalogo * {
            visibility: visible;
          }
          .print-catalogo {
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
              Informe de Catálogo
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
              <div className="border-2 border-gray-300 bg-white p-4 text-sm font-mono text-black max-w-sm mx-auto mb-4 print-catalogo">
                <div className="text-center mb-3">
                  <div className="font-bold text-base">{datosEmpresa?.name || 'Nombre Empresa'}</div>
                  <div className="text-xs">{datosEmpresa?.nif || 'NIF/CIF'}</div>
                  <div className="text-xs">{datosEmpresa?.address || 'Dirección'}</div>
                  {datosEmpresa?.phone && <div className="text-xs">Tel: {datosEmpresa.phone}</div>}
                  {datosEmpresa?.email && <div className="text-xs">{datosEmpresa.email}</div>}
                </div>

                <div className="border-t border-dashed border-gray-400 pt-2 mb-2">
                  <div className="text-center font-bold text-sm">CATÁLOGO DE PRODUCTOS</div>
                  <div className="text-center text-xs text-gray-600">
                    {new Date().toLocaleDateString('es-ES')}
                  </div>
                </div>

                {familias.map((familia) => (
                  <div key={familia.id} className="mt-3">
                    <div className="font-bold text-sm mb-1 border-b border-gray-300 pb-1">
                      {familia.name}
                    </div>
                    {articulos
                      .filter(articulo => articulo.familia_id === familia.id)
                      .map((articulo) => (
                        <div key={articulo.id} className="text-xs ml-2 py-1">
                          <div className="flex justify-between">
                            <span>{articulo.name}</span>
                            <span>{parseFloat(String(articulo.price)).toFixed(2)}€</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}

                <div className="border-t border-dashed border-gray-400 mt-3 pt-2 text-center">
                  <div className="font-bold text-xs">
                    Total artículos: {articulos.length}
                  </div>
                  <div className="font-bold text-xs">
                    Total familias: {familias.length}
                  </div>
                </div>
              </div>

              <div className="max-w-sm mx-auto">
                <button
                  onClick={handlePrint}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  🖨️ Imprimir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
