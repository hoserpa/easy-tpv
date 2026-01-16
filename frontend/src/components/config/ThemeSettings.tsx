'use client';

import React from 'react';

interface ThemeSettingsProps {
  esTemaOscuro: boolean;
  setEsTemaOscuro: (value: boolean) => void;
}

export default function ThemeSettings({ esTemaOscuro, setEsTemaOscuro }: ThemeSettingsProps) {
  return (
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
            <div className={`w-10 h-5 ${esTemaOscuro ? 'bg-gray-600' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-px after:left-px after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-400`}></div>
          </label>

          {esTemaOscuro ? (
            <span className="text-yellow-400 text-lg">☀️</span>
          ) : (
            <span className="text-indigo-600 text-lg">🌙</span>
          )}
        </div>
      </div>
    </div>
  );
}
