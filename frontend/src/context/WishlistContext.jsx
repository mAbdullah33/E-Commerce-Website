// Wishlist state (persist to localStorage)

import { createContext, useContext, useReducer, useEffect } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.find(i => i._id === action.payload._id);
      return {
        ...state,
        items: exists
          ? state.items.filter(i => i._id !== action.payload._id)
          : [...state.items, action.payload]
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    default:
      return state;
  }
};

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] }, (init) => {
    try {
      const stored = localStorage.getItem('pvc_wishlist');
      return stored ? JSON.parse(stored) : init;
    } catch { return init; }
  });

  useEffect(() => {
    localStorage.setItem('pvc_wishlist', JSON.stringify(state));
  }, [state]);

  const isWishlisted = (id) => state.items.some(i => i._id === id);

  return (
    <WishlistContext.Provider value={{ ...state, dispatch, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);