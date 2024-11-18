import { CommunicationMethodTypes } from "@/type";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface VivaConfigState {
    communicationMethod: CommunicationMethodTypes
    setCommunicationMethod: (method: CommunicationMethodTypes) => void
}

export const useVivaConfig = create<VivaConfigState>()(
    persist((set) => ({
        communicationMethod: "voice",
        setCommunicationMethod: (method) => set({ communicationMethod: method })
    }), { name: "viva-config-storage" })
)