import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface CartItemProps {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
  customizations?: string[];
  onRemove?: () => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

const CartItem = ({
  id = "1",
  name = "Spicy Chicken Burger",
  image = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
  price = 12.99,
  quantity = 1,
  customizations = ["Extra cheese", "No onions", "Spicy sauce on the side"],
  onRemove = () => {},
  onUpdateQuantity = () => {},
}: CartItemProps) => {
  const handleIncrement = () => {
    if (id) onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (id && quantity > 1) onUpdateQuantity(id, quantity - 1);
  };

  return (
    <div className="flex p-4 border-b border-gray-200 bg-white">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={onRemove}
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {customizations.length > 0 && (
          <div className="mt-1">
            <ul className="text-xs text-gray-500">
              {customizations.map((customization, index) => (
                <li key={index}>• {customization}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={handleIncrement}
            >
              <Plus size={14} />
            </Button>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ${(price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
