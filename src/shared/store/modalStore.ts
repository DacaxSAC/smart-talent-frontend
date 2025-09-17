import { create } from 'zustand';

interface ModalState {
  isActiveDrawerRegisterRequests: boolean;
  setIsActiveDrawerRegisterRequests: (value: boolean) => void;
  openRegisterRequestsDrawer: () => void;
  toggleRegisterRequestsDrawer: () => void;
  
  // Modal para selección de tipo de reclutamiento
  isActiveRecruitmentTypeModal: boolean;
  setIsActiveRecruitmentTypeModal: (value: boolean) => void;
  openRecruitmentTypeModal: () => void;
  closeRecruitmentTypeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isActiveDrawerRegisterRequests: false,
  setIsActiveDrawerRegisterRequests: (value) => set({ isActiveDrawerRegisterRequests: value }),
  openRegisterRequestsDrawer: () => set({ isActiveDrawerRegisterRequests: true }),
  toggleRegisterRequestsDrawer: () => set((state) => ({ 
    isActiveDrawerRegisterRequests: !state.isActiveDrawerRegisterRequests 
  })),
  
  // Modal para selección de tipo de reclutamiento
  isActiveRecruitmentTypeModal: false,
  setIsActiveRecruitmentTypeModal: (value) => set({ isActiveRecruitmentTypeModal: value }),
  openRecruitmentTypeModal: () => set({ isActiveRecruitmentTypeModal: true }),
  closeRecruitmentTypeModal: () => set({ isActiveRecruitmentTypeModal: false })
}));