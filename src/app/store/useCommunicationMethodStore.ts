import { create } from "zustand";
import { CommunicationMethodTypes } from "../../type";

interface State {
    method: CommunicationMethodTypes | null
}

interface Actions {
    updateCommunicationMethod: (method: CommunicationMethodTypes) => void 
}

const useCommunicationMethodStore = create<State & Actions>((set) => ({
    method: null,
    updateCommunicationMethod(method) {
        set({method})
    },
}))

export default useCommunicationMethodStore