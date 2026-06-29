import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],   // [{ id, name, price, image, size, quantity }]

  addItem: (product) => {
    const { items } = get();
    const exists = items.find(
      (i) => i.id === product.id && i.size === product.size
    );
    if (exists) {
      set({
        items: items.map((i) =>
          i.id === product.id && i.size === product.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },

  removeItem: (id, size) =>
    set((state) => ({
      items: state.items.filter((i) => !(i.id === id && i.size === size)),
    })),

  updateQuantity: (id, size, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  // Derived values
  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  totalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}));

export default useCartStore;