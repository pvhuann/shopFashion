import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
    item: ProductType;
    quantity: number;
    color: string; // ? means optional
    size: string; // ? means optional
}

interface CartStore {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (idToRemove: string, colorToRemove: string, sizeToRemove: string) => void;
    updateColorItem: (idToUpdate: string, oldColor: string, newColor: string, size: string) => void;
    updateSizeItem: (idToUpdate: string, color: string,oldSize: string, newSize: string) => void;
    increaseQuantity: (idToIncrease: string, colorToIncrease: string, sizeToIncrease: string) => void;
    decreaseQuantity: (idToDecrease: string, colorToDecrease: string, sizeToDecrease: string) => void;
    clearCart: () => void;
}



const useCart = create(
    persist<CartStore>(
        (set, get) => ({
            cartItems: [],
            addItem: (data: CartItem) => {
                const { item, quantity, color, size } = data;
                const currentItems = get().cartItems; // all the items already in cart
                const isExistingItem = currentItems.find(
                    (cartItem) => (cartItem.item._id === item._id) && (cartItem.color === color) && (cartItem.size === size)
                );
                if (isExistingItem) {
                    toast("Item already in cart");
                    return;
                } else {
                    set({ cartItems: [...currentItems, { item, quantity, color, size }] });
                    toast.success("Item added to cart");
                }
            },

            updateColorItem: (idToUpdate: string, oldColor: string,newColor:string, size: string) => {
                    const newCartItems = get().cartItems.map((cartItem) => {
                        if (cartItem.item._id === idToUpdate && cartItem.color ===oldColor && cartItem.size === size  ) {
                            return { ...cartItem, color: newColor }; // Return the updated cartItem
                        } else {
                            return cartItem; // Return the original cartItem if it doesn't match the id
                        }
                    });
                    set({ cartItems: newCartItems });
                    toast.success("Item color updated");
                
            },

            updateSizeItem: (idToUpdate: string, color: string, oldSize:string, newSize: string) => {
                    const newCartItems = get().cartItems.map((cartItem) => {
                        if (cartItem.item._id === idToUpdate
                            && cartItem.color === color && cartItem.size === oldSize
                        ) {
                            return { ...cartItem, size: newSize }; // Return the updated cartItem
                        } else {
                            return cartItem; // Return the original cartItem if it doesn't match the id
                        }
                    });
                    set({ cartItems: newCartItems });
                    toast.success("Item size updated");
                
            },

            removeItem: (idToRemove: string, colorToRemove: string, sizeToRemove: string) => {
                const newCartItems = get().cartItems.filter(
                    (cartItem) =>
                        (cartItem.item._id !== idToRemove)
                        || (cartItem.color !== colorToRemove)
                        || (cartItem.size !== sizeToRemove)

                );
                set({ cartItems: newCartItems });
                toast.success("Item removed from cart");
            },

            increaseQuantity: (idToIncrease: string, colorToIncrease: string, sizeToIncrease: string) => {
                const newCartItems = get().cartItems.map((cartItem) =>
                    (cartItem.item._id === idToIncrease && cartItem.color === colorToIncrease && cartItem.size === sizeToIncrease)
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
                set({ cartItems: newCartItems });
                toast.success("Item quantity increased");
            },

            decreaseQuantity: (idToDecrease: string, colorToDecrease: string, sizeToDecrease: string) => {
                const newCartItems = get().cartItems.map((cartItem) =>
                    (cartItem.quantity > 1 && cartItem.item._id === idToDecrease && cartItem.color === colorToDecrease && cartItem.size === sizeToDecrease)
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                );
                set({ cartItems: newCartItems });
                toast.success("Item quantity decreased");
            },

            clearCart: () => set({ cartItems: [] }),
        }),

        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useCart;
