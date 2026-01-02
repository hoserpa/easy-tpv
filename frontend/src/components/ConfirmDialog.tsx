'use client';

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  esTemaOscuro: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  esTemaOscuro,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className={`${esTemaOscuro ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4 transform transition-all`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
            <svg 
              className="w-6 h-6 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 
            id="confirm-title"
            className={`text-lg font-semibold ${esTemaOscuro ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </h3>
        </div>
        
        <p 
          id="confirm-message"
          className={`mb-6 ${esTemaOscuro ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              esTemaOscuro
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
            }`}
            autoFocus
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              esTemaOscuro
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}