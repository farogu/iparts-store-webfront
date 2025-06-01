
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error occurred:', error);
    
    let message = customMessage || 'Ocurrió un error inesperado';
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('fetch')) {
        message = 'Error de conexión. Verifica tu internet.';
      } else if (error.message.includes('GraphQL')) {
        message = 'Error del servidor. Intenta de nuevo.';
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        message = 'Error de autorización. Verifica tu configuración.';
      }
    }

    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  return { handleError };
};
