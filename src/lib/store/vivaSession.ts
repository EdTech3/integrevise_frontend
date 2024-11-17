import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VivaSessionState {
  sessionId: string | null;
  setSessionId: (id: string) => void;
  clearSessionId: () => void;
}

export const useVivaSession = create<VivaSessionState>()(
  persist(
    (set) => ({
      sessionId: "cm3kbiwu7000d133oz0m9r8cv",
      setSessionId: (id) => set({ sessionId: id }),
      clearSessionId: () => set({ sessionId: null }),
    }),
    {
      name: 'viva-session-storage',
    }
  )
); 