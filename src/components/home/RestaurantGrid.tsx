import React, { useState } from "react";
import RestaurantCard from "../restaurant/RestaurantCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  priceRange: number;
  isNew: boolean;
}

interface RestaurantGridProps {
  restaurants?: Restaurant[];
  onRestaurantClick?: (restaurantId: string) => void;
  isLoading?: boolean;
}

const RestaurantGrid = ({
  restaurants = [
    {
      id: "1",
      name: "Burger Palace",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
      cuisineTypes: ["American", "Burgers"],
      rating: 4.8,
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99",
      priceRange: 2,
      isNew: true,
    },
    {
      id: "2",
      name: "Pizza Heaven",
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80",
      cuisineTypes: ["Italian", "Pizza"],
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "$2.49",
      priceRange: 2,
      isNew: false,
    },
    {
      id: "3",
      name: "Sushi Express",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
      cuisineTypes: ["Japanese", "Sushi"],
      rating: 4.9,
      deliveryTime: "25-40 min",
      deliveryFee: "$3.99",
      priceRange: 3,
      isNew: false,
    },
    {
      id: "4",
      name: "Taco Fiesta",
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
      cuisineTypes: ["Mexican", "Tacos"],
      rating: 4.6,
      deliveryTime: "15-30 min",
      deliveryFee: "$2.99",
      priceRange: 1,
      isNew: false,
    },
    {
      id: "5",
      name: "Noodle House",
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
      cuisineTypes: ["Chinese", "Noodles"],
      rating: 4.3,
      deliveryTime: "20-35 min",
      deliveryFee: "$2.49",
      priceRange: 2,
      isNew: true,
    },
    {
      id: "6",
      name: "Healthy Greens",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      cuisineTypes: ["Salads", "Healthy"],
      rating: 4.7,
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99",
      priceRange: 2,
      isNew: false,
    },
  ],
  onRestaurantClick = (id) => console.log(`Restaurant clicked: ${id}`),
  isLoading = false,
}: RestaurantGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisineTypes.some((cuisine) =>
        cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="w-full bg-gray-50 p-4">
      {/* Search bar */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search restaurants or cuisines..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* No results state */}
      {!isLoading && filteredRestaurants.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => setSearchQuery("")}>Clear search</Button>
        </div>
      )}

      {/* Restaurant grid */}
      {!isLoading && filteredRestaurants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              image={restaurant.image}
              cuisineTypes={restaurant.cuisineTypes}
              rating={restaurant.rating}
              deliveryTime={restaurant.deliveryTime}
              deliveryFee={restaurant.deliveryFee}
              priceRange={restaurant.priceRange}
              isNew={restaurant.isNew}
              onClick={() => onRestaurantClick(restaurant.id)}
            />
          ))}
        </div>
      )}

      {/* Load more button - only shown when there are more than 6 restaurants */}
      {!isLoading && filteredRestaurants.length > 6 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load more restaurants</Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantGrid;
