export type CartItem = {
  productId: number;
  quantity: number;
};

const CART_KEY = "kulaura-bazar-cart";

function notifyCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = localStorage.getItem(CART_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart;
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  notifyCartUpdate();
}

export function addToCart(
  productId: number,
  quantity: number = 1
) {
  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  saveCart(cart);
}

export function updateCartItem(
  productId: number,
  quantity: number
) {
  const cart = getCart();

  const item = cart.find(
    (item) => item.productId === productId
  );

  if (!item) {
    return;
  }

  if (quantity <= 0) {
    const updatedCart = cart.filter(
      (cartItem) => cartItem.productId !== productId
    );

    saveCart(updatedCart);
    return;
  }

  item.quantity = quantity;

  saveCart(cart);
}

export function removeFromCart(productId: number) {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item.productId !== productId
  );

  saveCart(updatedCart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  const cart = getCart();

  return cart.length;
}

export function getCartItemQuantity(
  productId: number
) {
  const cart = getCart();

  const item = cart.find(
    (cartItem) => cartItem.productId === productId
  );

  return item?.quantity ?? 0;
}