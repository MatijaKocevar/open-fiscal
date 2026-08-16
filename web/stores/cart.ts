import { create } from "zustand"

interface CartItem {
  productId: string
  name: string
  unitPrice: number
  vatRate: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  customerId: string | null
  customerVatId: string
  addItem: (product: { id: string; name: string; unitPrice: number; vatRate: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  setCustomer: (customer: { id: string | null; vatId: string }) => void
  setCustomerVatId: (vatId: string) => void
  clear: () => void
}

export const useCart = create<CartState>((set) => ({
  items: [],
  customerId: null,
  customerVatId: "",
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            unitPrice: product.unitPrice,
            vatRate: product.vatRate,
            quantity: 1,
          },
        ],
      }
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.productId !== productId)
        : state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
    })),
  setCustomer: (customer) =>
    set({ customerId: customer.id, customerVatId: customer.vatId }),
  setCustomerVatId: (vatId) => set({ customerVatId: vatId }),
  clear: () => set({ items: [], customerId: null, customerVatId: "" }),
}))
