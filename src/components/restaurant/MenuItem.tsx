import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface MenuItemProps {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  onAddToCart?: () => void;
  onCustomize?: () => void;
}

const MenuItem = ({
  id = "1",
  name = "Spicy Chicken Burger",
  description = "Juicy chicken patty with spicy sauce, lettuce, tomato, and pickles on a toasted bun.",
  price = 12.99,
  image = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
  onAddToCart = () => console.log("Add to cart clicked"),
  onCustomize = () => console.log("Customize clicked"),
}: MenuItemProps) => {
  const [quantity, setQuantity] = React.useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart();
  };

  return (
    <Card className="w-full bg-white overflow-hidden flex mb-4 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <CardContent className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{name}</h3>
            <span className="font-semibold text-lg">${price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onCustomize}>
              Customize
            </Button>
            <Button size="sm" onClick={handleAddToCart}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItem;
