
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/error-emitter';

export function ErrorSimulationListener() {
  useEffect(() => {
    const handlePermissionError = (error: Error) => {
      // Melempar error agar ditangkap oleh overlay pengembangan Next.js
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
