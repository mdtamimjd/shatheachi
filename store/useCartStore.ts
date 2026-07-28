import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


// interface CounterState {
//     count: number;
//     increment: () => void;
//     decrement: () => void;
//     reset: () => void;
// }

// export const useCartStore = create<CounterState>()(
//     persist(
//         (set) => ({
//             count: 0,
//             increment: () => set((state) => ({ count: state.count + 1 })),
//             decrement: () => set((state) => ({ count: state.count - 1 })),
//             reset: () => set({ count: 0 })
//         }), {
//             name:"counter-state",
//             storage: createJSONStorage(()=> localStorage)
//     }
//     )
// )

export interface ProductType {
    _id:string;
    title:string;
    image:string;
    price:number;
    quantity:number;
}

interface CartState {
    products: ProductType[];
    addToCart: (item:ProductType) => void;
    removeFromCart: (id:string) => void;
    updateQuantity : (id:string, quantity:number) => void; 
    clearCart: ()=> void;
    getTotalPrice: ()=> number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set,get)=>({
            products:[],
            addToCart: (item) => {
                const currentProducts = get().products;
                const existingProduct = currentProducts.find((i)=> i._id === item._id);
                if(existingProduct){
                    set({
                        products: currentProducts.map((i)=> 
                        i._id === item._id 
                    ? {...i,quantity: i.quantity + (item.quantity || 1) }
                    : i
                )
                    })
                }else{
                    set({
                        products: [...currentProducts,{...item,quantity: item.quantity || 1}]
                    })
                }
            },
            removeFromCart: (id) => set(
                {products: get().products.filter((item)=> id !== item._id)}
            ),
            updateQuantity: (id,quantity) => {
                if(quantity <= 0){
                    get().removeFromCart(id)
                    return;
                }
                set({
                    products: get().products.map((item)=>
                        item._id === id ? {...item,quantity}: item
                    )
                })
            },
            clearCart: ()=> set({products:[]}),
            getTotalPrice: ()=> {
                return get().products.reduce((total,item)=> total + item.price * item.quantity,0);
            },
        }),
        {
            name:"product-cart",
            storage: createJSONStorage(()=> localStorage)
        }
    )
)