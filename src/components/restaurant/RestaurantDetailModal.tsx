import React, { useState } from "react";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import MenuSection from "./MenuSection";
import MenuItem from "./MenuItem";
import ItemCustomizationModal from "./ItemCustomizationModal";

interface RestaurantDetailModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  restaurant?: {
    id: string;
    name: string;
    image: string;
    coverImage: string;
    cuisineTypes: string[];
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: string;
    distance: string;
    address: string;
    phone: string;
    website: string;
    openingHours: string;
    priceRange: number;
  };
}

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    popular?: boolean;
  }[];
}

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

const RestaurantDetailModal = ({
  open = true,
  onOpenChange,
  restaurant = {
    id: "1",
    name: "Tasty Bites Restaurant",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    cuisineTypes: ["Italian", "Pizza", "Pasta"],
    rating: 4.7,
    reviewCount: 243,
    deliveryTime: "25-35 min",
    deliveryFee: "$2.99",
    distance: "1.2 miles",
    address: "123 Main Street, New York, NY 10001",
    phone: "(212) 555-1234",
    website: "www.tastybites.com",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM",
    priceRange: 2,
  },
}: RestaurantDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);

  // Mock menu categories data
  const menuCategories: MenuCategory[] = [
    {
      id: "popular",
      title: "Popular Items",
      description: "The most ordered items and dishes from this restaurant",
      items: [
        {
          id: "item1",
          name: "Margherita Pizza",
          description: "Classic pizza with tomato sauce, mozzarella, and basil",
          price: 12.99,
          image:
            "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=75",
          popular: true,
        },
        {
          id: "item2",
          name: "Spaghetti Carbonara",
          description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
          price: 14.99,
          image:
            "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=75",
          popular: true,
        },
      ],
    },
    {
      id: "starters",
      title: "Starters",
      description: "Perfect dishes to begin your meal",
      items: [
        {
          id: "item3",
          name: "Bruschetta",
          description: "Toasted bread topped with tomatoes, garlic, and basil",
          price: 8.99,
          image:
            "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&q=75",
        },
        {
          id: "item4",
          name: "Caprese Salad",
          description:
            "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
          price: 10.99,
          image:
            "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=300&q=75",
        },
      ],
    },
    {
      id: "mains",
      title: "Main Courses",
      description: "Hearty and delicious main dishes",
      items: [
        {
          id: "item5",
          name: "Chicken Parmesan",
          description:
            "Breaded chicken topped with marinara sauce and melted cheese",
          price: 16.99,
          image:
            "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=300&q=75",
        },
        {
          id: "item6",
          name: "Grilled Salmon",
          description:
            "Fresh salmon fillet with lemon butter sauce and vegetables",
          price: 18.99,
          image:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&q=75",
        },
      ],
    },
  ];

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: "review1",
      userName: "John D.",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      rating: 5,
      date: "2 days ago",
      comment:
        "Amazing food and quick delivery! The Margherita pizza was perfect - crispy crust and fresh ingredients. Will definitely order again.",
      images: [
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=75",
      ],
    },
    {
      id: "review2",
      userName: "Sarah M.",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4,
      date: "1 week ago",
      comment:
        "Good food but delivery took a bit longer than expected. The pasta was delicious though!",
    },
    {
      id: "review3",
      userName: "Michael P.",
      userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Best Italian food in the area! Everything we ordered was fantastic.",
      images: [
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=75",
        "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=300&q=75",
      ],
    },
  ];

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setCustomizationModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
          {/* Cover Image */}
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {restaurant.name}
                </h1>
                <div className="flex items-center mt-1 text-white">
                  <div className="flex mr-2">
                    {renderStars(restaurant.rating)}
                  </div>
                  <span className="mr-1">{restaurant.rating}</span>
                  <span className="text-white/80">
                    ({restaurant.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Heart size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* Restaurant Info Summary */}
          <div className="px-6 py-4 flex flex-wrap gap-3">
            {restaurant.cuisineTypes.map((cuisine, index) => (
              <Badge key={index} variant="secondary">
                {cuisine}
              </Badge>
            ))}
            <div className="flex items-center gap-1 text-sm text-gray-600 ml-auto">
              <Clock size={16} />
              <span>{restaurant.deliveryTime}</span>
              <span className="mx-1">•</span>
              <span>{restaurant.deliveryFee} delivery</span>
              <span className="mx-1">•</span>
              <span>{restaurant.distance}</span>
            </div>
          </div>

          <Separator />

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
            </div>

            {/* Menu Tab */}
            <TabsContent value="menu" className="p-6 pt-4">
              <div className="space-y-6">
                {menuCategories.map((category) => (
                  <MenuSection
                    key={category.id}
                    id={category.id}
                    title={category.title}
                    description={category.description}
                    items={category.items}
                    isOpen={category.id === "popular"}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="p-6 pt-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex mr-2">
                      {renderStars(restaurant.rating)}
                    </div>
                    <span className="font-medium">{restaurant.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({restaurant.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <Button>Write a Review</Button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10">
                        {review.userImage ? (
                          <AvatarImage
                            src={review.userImage}
                            alt={review.userName}
                          />
                        ) : (
                          <AvatarFallback>
                            {review.userName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <h4 className="font-medium">{review.userName}</h4>
                          <span className="text-gray-500 text-sm ml-2">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                See All Reviews
              </Button>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="p-6 pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Restaurant Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium">Address</h4>
                        <p className="text-gray-600">{restaurant.address}</p>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary"
                        >
                          Get Directions
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-gray-600">{restaurant.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium">Website</h4>
                        <a
                          href={`https://${restaurant.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {restaurant.website}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium">Hours</h4>
                        <p className="text-gray-600">
                          {restaurant.openingHours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    More Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="justify-between w-full"
                    >
                      <span>View Allergen Information</span>
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-between w-full"
                    >
                      <span>Nutritional Information</span>
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-between w-full"
                    >
                      <span>Restaurant Policies</span>
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-between w-full"
                    >
                      <span>About the Restaurant</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Item Customization Modal */}
      {selectedItem && (
        <ItemCustomizationModal
          open={customizationModalOpen}
          onOpenChange={setCustomizationModalOpen}
          item={selectedItem}
          onAddToCart={(customizedItem) => {
            console.log("Added to cart:", customizedItem);
            setCustomizationModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default RestaurantDetailModal;
