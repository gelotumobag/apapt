import React from "react";
import { Star, Clock, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  id?: string;
  name?: string;
  image?: string;
  cuisineTypes?: string[];
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  priceRange?: number;
  isNew?: boolean;
  onClick?: () => void;
}

const RestaurantCard = ({
  id = "1",
  name = "Tasty Bites Restaurant",
  image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  cuisineTypes = ["Italian", "Pizza"],
  rating = 4.7,
  deliveryTime = "25-35 min",
  deliveryFee = "$2.99",
  priceRange = 2,
  isNew = false,
  onClick = () => {},
}: RestaurantCardProps) => {
  // Generate price range indicators ($, $$, $$$)
  const renderPriceRange = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <DollarSign
          key={index}
          size={14}
          className={`${index < priceRange ? "text-foreground" : "text-muted-foreground/30"}`}
        />
      ));
  };

  return (
    <Card
      className="w-full max-w-[350px] h-[280px] overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isNew && (
          <Badge
            variant="default"
            className="absolute top-3 right-3 bg-primary text-white"
          >
            New
          </Badge>
        )}
      </div>

      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={16} />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {cuisineTypes.map((cuisine, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {cuisine}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <div className="flex">{renderPriceRange()}</div>
          <span className="mx-1">•</span>
          <span>{deliveryTime}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm">
          <Clock size={14} />
          <span>{deliveryTime}</span>
        </div>
        <div className="text-sm font-medium">{deliveryFee}</div>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
