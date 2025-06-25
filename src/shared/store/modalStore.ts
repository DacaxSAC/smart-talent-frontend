import { create } from 'zustand';

interface ModalState {
  isActiveDrawerRegisterRequests: boolean;
  setIsActiveDrawerRegisterRequests: (value: boolean) => void;
  openRegisterRequestsDrawer: () => void;
  toggleRegisterRequestsDrawer: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isActiveDrawerRegisterRequests: false,
  setIsActiveDrawerRegisterRequests: (value) => set({ isActiveDrawerRegisterRequests: value }),
  openRegisterRequestsDrawer: () => set({ isActiveDrawerRegisterRequests: true }),
  toggleRegisterRequestsDrawer: () => set((state) => ({ 
    isActiveDrawerRegisterRequests: !state.isActiveDrawerRegisterRequests 
  }))
}));