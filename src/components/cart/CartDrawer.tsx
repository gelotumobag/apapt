import React, { useState } from "react";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import CartItem from "./CartItem";
import CheckoutOptions from "../checkout/CheckoutOptions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customizations: string[];
}

interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items?: CartItem[];
  onRemoveItem?: (id: string) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onCheckout?: () => void;
}

const CartDrawer = ({
  open = true,
  onOpenChange = () => {},
  items = [
    {
      id: "1",
      name: "Spicy Chicken Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
      price: 12.99,
      quantity: 2,
      customizations: ["Extra cheese", "No onions", "Spicy sauce on the side"],
    },
    {
      id: "2",
      name: "Caesar Salad",
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&q=80",
      price: 9.99,
      quantity: 1,
      customizations: ["Dressing on the side", "No croutons"],
    },
    {
      id: "3",
      name: "Chocolate Milkshake",
      image:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80",
      price: 5.99,
      quantity: 1,
      customizations: ["Extra whipped cream"],
    },
  ],
  onRemoveItem = () => {},
  onUpdateQuantity = () => {},
  onCheckout = () => {},
}: CartDrawerProps) => {
  const [view, setView] = useState<"cart" | "checkout">("cart");

  // Calculate cart totals
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + deliveryFee + tax;

  const handleRemoveItem = (id: string) => {
    onRemoveItem(id);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    onUpdateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    onCheckout();
  };

  const handleProceedToCheckout = () => {
    setView("checkout");
  };

  const handleBackToCart = () => {
    setView("cart");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-y-auto bg-white">
        <DrawerHeader className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>
              {view === "cart" ? "Your Cart" : "Checkout"}
            </DrawerTitle>
            <div className="flex items-center gap-2">
              {view === "checkout" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCart}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Back
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        {view === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Add items from a restaurant to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      quantity={item.quantity}
                      customizations={item.customizations}
                      onRemove={() => handleRemoveItem(item.id)}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
              )}
            </div>

            <DrawerFooter className="border-t bg-gray-50">
              <div className="space-y-4">
                <div className="space-y-2 px-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full"
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </DrawerFooter>
          </>
        ) : (
          <div className="p-4">
            <CheckoutOptions
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              onPlaceOrder={handleCheckout}
            />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
