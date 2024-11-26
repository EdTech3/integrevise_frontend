import { create } from "zustand";

interface DomainState {
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
}

export const useDomainStore = create<DomainState>((set) => ({
  selectedDomain: "",
  setSelectedDomain: (domain: string) => set({ selectedDomain: domain }),
}));
