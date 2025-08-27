import { create } from 'zustand';
import { User, Prompt, Purchase } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface CartState {
  items: Prompt[];
  addItem: (prompt: Prompt) => void;
  removeItem: (promptId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (prompt) =>
    set((state) => {
      // Verificar si el prompt ya está en el carrito
      const exists = state.items.some((item) => item.id === prompt.id);
      if (exists) return state;
      return { items: [...state.items, prompt] };
    }),
  removeItem: (promptId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== promptId),
    })),
  clearCart: () => set({ items: [] }),
}));

interface PurchasesState {
  purchases: Purchase[];
  isLoading: boolean;
  setPurchases: (purchases: Purchase[]) => void;
  addPurchase: (purchase: Purchase) => void;
  setLoading: (isLoading: boolean) => void;
}

export const usePurchasesStore = create<PurchasesState>((set) => ({
  purchases: [],
  isLoading: false,
  setPurchases: (purchases) => set({ purchases }),
  addPurchase: (purchase) =>
    set((state) => ({
      purchases: [purchase, ...state.purchases],
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));