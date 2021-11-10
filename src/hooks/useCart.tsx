import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const newCart = [...cart];

      const stockResponse = await api.get(`/stock/${productId}`);
      if (!stockResponse.data) throw new Error();
      const productStock: Stock = stockResponse.data;

      const productInCart = cart.find((product) => product.id === productId);
      if (!productInCart) {
        if (productStock.amount === 0) {
          toast.error("Quantidade solicitada fora de estoque");
          return;
        }
        const productResponse = await api.get(`/products/${productId}`);
        if (!productResponse.data) throw new Error();
        const product = productResponse.data;

        newCart.push({ ...product, amount: 1 });
      } else {
        const productToUpdateIndex = cart.findIndex(
          (product) => product.id === productId
        );
        if (productInCart.amount + 1 > productStock.amount) {
          toast.error("Quantidade solicitada fora de estoque");
          return;
        }
        newCart[productToUpdateIndex] = {
          ...productInCart,
          amount: productInCart.amount + 1,
        };
      }
      setCart(newCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCart = [...cart];
      const productToRemoveIndex = newCart.findIndex(
        (product) => product.id === productId
      );
      if (productToRemoveIndex === -1) throw Error();
      newCart.splice(productToRemoveIndex, 1);
      setCart(newCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount === 0) return;
      const productToUpdateIndex = cart.findIndex(
        (product) => product.id === productId
      );
      if (productToUpdateIndex === -1) {
        throw new Error();
      }
      const stockResponse = await api.get(`/stock/${productId}`);
      if (!stockResponse.data) throw new Error();
      const productStock: Stock = stockResponse.data;

      if (productStock.amount < amount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }
      const newCart = [...cart];
      newCart[productToUpdateIndex].amount = amount;
      setCart(newCart);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
