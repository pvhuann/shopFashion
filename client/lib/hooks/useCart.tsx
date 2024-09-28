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
                    (cartItem) =>  (cartItem.item._id === item._id) && (cartItem.color === color) && (cartItem.size === size)
                );
                if (isExistingItem) {
                    toast("Item already in cart");
                    return;
                } else {
                    set({ cartItems: [...currentItems, { item, quantity, color, size }] });
                    toast.success("Item added to cart");
                }
            },
            removeItem: (idToRemove: string, colorToRemove: string, sizeToRemove: string) => {
                const newCartItems = get().cartItems.filter(
                    (cartItem) => (cartItem.item._id !== idToRemove) || (cartItem.color !== colorToRemove) || (cartItem.size !== sizeToRemove)
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
                    ( cartItem.quantity >1 && cartItem.item._id === idToDecrease && cartItem.color === colorToDecrease && cartItem.size === sizeToDecrease)
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
