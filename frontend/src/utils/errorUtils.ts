/**
 * Extrae el mensaje de error específico de la API
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Error desconocido';
}