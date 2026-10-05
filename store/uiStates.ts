import { create } from 'zustand';

type UiStates = {
  showSplash: boolean;
  splashFading: boolean;
  dontShowSplash: boolean;
  itemToDelete: string | null;
  toastMessage: string;
  setToastMessage: (message: string) => void;
  setSplashFading: (fading: boolean) => void;
  setShowSplash: (show: boolean) => void;
  setDontShowSplash: (dontShow: boolean) => void;
  setItemToDelete: (id: string | null) => void;
};

export const useUiStates = create<UiStates>((set) => ({
  showSplash: false,
  splashFading: false,
  dontShowSplash: false,
  itemToDelete: null as string | null,
  toastMessage: '',
  setToastMessage: (message: string) => set({ toastMessage: message }),
  setSplashFading: (fading: boolean) => set({ splashFading: fading }),
  setShowSplash: (show: boolean) => set({ showSplash: show }),
  setDontShowSplash: (dontShow: boolean) => set({ dontShowSplash: dontShow }),
  setItemToDelete: (id: string | null) => set({ itemToDelete: id }),
}));
