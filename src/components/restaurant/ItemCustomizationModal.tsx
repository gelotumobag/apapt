import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ItemCustomizationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddToCart?: (item: any) => void;
  item?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

const ItemCustomizationModal = ({
  open = true,
  onOpenChange,
  onAddToCart,
  item = {
    id: "1",
    name: "Spicy Chicken Burger",
    description:
      "Juicy chicken patty with spicy sauce, lettuce, tomato, and cheese",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
}: ItemCustomizationModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const sizes = [
    { id: "small", name: "Small", priceAdjustment: -2.0 },
    { id: "medium", name: "Medium", priceAdjustment: 0 },
    { id: "large", name: "Large", priceAdjustment: 2.5 },
  ];

  const addons = [
    { id: "cheese", name: "Extra Cheese", price: 1.5 },
    { id: "bacon", name: "Bacon", price: 2.0 },
    { id: "avocado", name: "Avocado", price: 1.75 },
    { id: "egg", name: "Fried Egg", price: 1.25 },
    { id: "jalapenos", name: "Jalapeños", price: 0.75 },
  ];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  const calculateTotalPrice = () => {
    const sizePrice =
      sizes.find((size) => size.id === selectedSize)?.priceAdjustment || 0;
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);

    return ((item.price + sizePrice + addonsPrice) * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      quantity,
      size: selectedSize,
      addons: selectedAddons.map((id) => addons.find((a) => a.id === id)),
      specialInstructions,
      totalPrice: parseFloat(calculateTotalPrice()),
    };

    if (onAddToCart) {
      onAddToCart(customizedItem);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md md:max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-full h-48 overflow-hidden rounded-t-lg mb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
          <p className="text-gray-600 mt-1">{item.description}</p>
          <p className="text-lg font-semibold mt-2">${item.price.toFixed(2)}</p>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select Size</h3>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-col space-y-2"
            >
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={size.id} id={`size-${size.id}`} />
                    <label
                      htmlFor={`size-${size.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {size.name}
                    </label>
                  </div>
                  <span className="text-sm">
                    {size.priceAdjustment === 0
                      ? "Included"
                      : size.priceAdjustment > 0
                        ? `+$${size.priceAdjustment.toFixed(2)}`
                        : `-$${Math.abs(size.priceAdjustment).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Add-ons */}
          <div>
            <h3 className="text-sm font-medium mb-3">Add-ons</h3>
            <div className="space-y-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`addon-${addon.id}`}
                      checked={selectedAddons.includes(addon.id)}
                      onCheckedChange={() => toggleAddon(addon.id)}
                    />
                    <label
                      htmlFor={`addon-${addon.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {addon.name}
                    </label>
                  </div>
                  <span className="text-sm">+${addon.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h3 className="text-sm font-medium mb-2">Special Instructions</h3>
            <Textarea
              placeholder="Any special requests or allergies?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium mb-3">Quantity</h3>
            <div className="flex items-center border rounded-md w-32">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">{quantity}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <div className="text-lg font-bold w-full sm:w-auto text-center sm:text-left">
            Total: ${calculateTotalPrice()}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white"
            >
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemCustomizationModal;
