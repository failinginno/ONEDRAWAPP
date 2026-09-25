import { createContext, useContext } from 'react';
import type { OnedrawProviderValue } from './types';

export const OnedrawContext = createContext<OnedrawProviderValue | null>(null);

export function useOnedraw(): OnedrawProviderValue {
  const context = useContext(OnedrawContext);
  if (!context) throw new Error('useOnedraw must be used inside an ONEDRAW provider');
  return context;
}

/** Temporary compatibility alias while the prototype UI is migrated. */
export const useDemo = useOnedraw;
