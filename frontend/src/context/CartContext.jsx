// Cart state (persist to localStorage)

import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1 } = action.payload;
      const exists = state.items.find(i => i._id === action.payload._id);
      
      if (exists) {
        const newQty = exists.quantity + quantity;
        if (newQty > (exists.stock || 999)) {
          // Cap at stock limit
          return {
            ...state,
            items: state.items.map(i =>
              i._id === action.payload._id ? { ...i, quantity: i.stock || i.quantity } : i
            )
          };
        }

        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id ? { ...i, quantity: newQty } : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i => {
          if (i._id === action.payload.id) {
            // Check stock limit for update
            const newQty = Math.max(0, Math.min(action.payload.qty, i.stock || 999));
            return { ...i, quantity: newQty };
          }
          return i;
        }).filter(i => i.quantity > 0)
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
    try {
      const stored = localStorage.getItem('pvc_cart');
      return stored ? JSON.parse(stored) : init;
    } catch { return init; }
  });

  useEffect(() => {
    localStorage.setItem('pvc_cart', JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);