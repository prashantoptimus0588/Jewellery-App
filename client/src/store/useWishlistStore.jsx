// src/store/useWishlistStore.js
import { create } from 'zustand';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../services/userService';

const useWishlistStore = create((set, get) => ({
  ids: [], // productIds in wishlist

  load: async () => {
    try {
      const { wishlist } = await fetchWishlist();
      set({ ids: wishlist.map((i) => i.productId) });
    } catch {
      // not logged in or failed — keep empty
    }
  },

  toggle: async (productId, isAuthenticated) => {
    const { ids } = get();
    const isWishlisted = ids.includes(productId);

    // Optimistic update
    set({ ids: isWishlisted ? ids.filter((i) => i !== productId) : [...ids, productId] });

    if (!isAuthenticated) return; // local only if not logged in

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch {
      // Revert on failure
      set({ ids });
    }
  },

  clear: () => set({ ids: [] }),
}));

export default useWishlistStore;