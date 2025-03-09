import React, { useState } from "react";
import { MapPin, Phone, Clock, Check, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface OrderTrackingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  order?: {
    id: string;
    restaurantName: string;
    restaurantImage: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    status: "preparing" | "ready" | "picked_up" | "on_the_way" | "delivered";
    estimatedDeliveryTime: string;
    deliveryPerson?: {
      name: string;
      image: string;
      phone: string;
      rating: number;
    };
    deliveryAddress: string;
    orderTotal: number;
    orderTime: string;
    currentLocation?: {
      lat: number;
      lng: number;
    };
  };
}

const OrderTrackingModal = ({
  open = true,
  onOpenChange = () => {},
  order = {
    id: "ORD-12345",
    restaurantName: "Tasty Bites Restaurant",
    restaurantImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
    items: [
      { name: "Spicy Chicken Burger", quantity: 1, price: 12.99 },
      { name: "French Fries (Large)", quantity: 1, price: 4.99 },
      { name: "Chocolate Milkshake", quantity: 1, price: 5.99 },
    ],
    status: "on_the_way",
    estimatedDeliveryTime: "12:45 PM",
    deliveryPerson: {
      name: "Michael Rodriguez",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      phone: "(555) 123-4567",
      rating: 4.8,
    },
    deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    orderTotal: 23.97,
    orderTime: "12:15 PM",
    currentLocation: {
      lat: 40.7128,
      lng: -74.006,
    },
  },
}: OrderTrackingModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("tracking");

  // Calculate progress percentage based on order status
  const getProgressPercentage = () => {
    const statusMap = {
      preparing: 25,
      ready: 50,
      picked_up: 75,
      on_the_way: 90,
      delivered: 100,
    };
    return statusMap[order.status] || 0;
  };

  // Get human-readable status text
  const getStatusText = () => {
    const statusMap = {
      preparing: "Preparing your order",
      ready: "Order ready for pickup",
      picked_up: "Order picked up",
      on_the_way: "On the way to you",
      delivered: "Delivered",
    };
    return statusMap[order.status] || "";
  };

  // Get estimated time remaining
  const getTimeRemaining = () => {
    // This would normally be calculated based on real data
    // For now, we'll return a placeholder
    if (order.status === "delivered") return "Delivered";
    return "15-20 min";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md md:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={order.restaurantImage}
              alt={order.restaurantName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <DialogTitle className="text-lg">
                {order.restaurantName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Order #{order.id}</p>
            </div>
          </div>
          <Badge
            variant={order.status === "delivered" ? "default" : "secondary"}
            className="px-3 py-1"
          >
            {getStatusText()}
          </Badge>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <Tabs
          defaultValue="tracking"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="mt-4 space-y-4">
            {/* Delivery Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Delivery Progress</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {getTimeRemaining()}
                  </span>
                </div>
              </div>

              <Progress value={getProgressPercentage()} className="h-2" />

              <div className="grid grid-cols-4 gap-2 text-xs text-center">
                <div
                  className={`${order.status === "preparing" || getProgressPercentage() >= 25 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  <div className="flex justify-center mb-1">
                    {getProgressPercentage() >= 25 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <span>Preparing</span>
                </div>
                <div
                  className={`${order.status === "ready" || getProgressPercentage() >= 50 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  <div className="flex justify-center mb-1">
                    {getProgressPercentage() >= 50 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <span>Ready</span>
                </div>
                <div
                  className={`${order.status === "on_the_way" || getProgressPercentage() >= 75 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  <div className="flex justify-center mb-1">
                    {getProgressPercentage() >= 75 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <span>On the way</span>
                </div>
                <div
                  className={`${order.status === "delivered" || getProgressPercentage() >= 100 ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  <div className="flex justify-center mb-1">
                    {getProgressPercentage() >= 100 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "4"
                    )}
                  </div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border h-64 bg-gray-100 relative">
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Map with real-time tracking would appear here
                </p>
              </div>

              {/* Placeholder map image for visual representation */}
              <img
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?w=800&q=80"
                alt="Map"
                className="w-full h-full object-cover opacity-50"
              />

              {/* Delivery address overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-white p-3 shadow-md">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Delivery Address</p>
                    <p className="text-xs text-muted-foreground">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Person */}
            {order.deliveryPerson &&
              order.status !== "preparing" &&
              order.status !== "ready" && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3">
                    Your Delivery Person
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <img
                          src={order.deliveryPerson.image}
                          alt={order.deliveryPerson.name}
                          className="w-full h-full object-cover"
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {order.deliveryPerson.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>★ {order.deliveryPerson.rating}</span>
                          <span>•</span>
                          <span>Delivery Partner</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-4">
            {/* Order Items */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium p-4 border-b">Order Items</h3>
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {item.quantity}x
                      </span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>${order.orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium p-4 border-b">
                Order Information
              </h3>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Order Number
                  </span>
                  <span className="text-sm">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Order Time
                  </span>
                  <span className="text-sm">{order.orderTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated Delivery
                  </span>
                  <span className="text-sm">{order.estimatedDeliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Delivery Address
                  </span>
                  <span className="text-sm text-right max-w-[60%]">
                    {order.deliveryAddress}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="mt-4 space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium p-4 border-b">Need Help?</h3>
              <div className="divide-y">
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <span className="text-sm">I have an issue with my order</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <span className="text-sm">
                    I need to change my delivery address
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <span className="text-sm">
                    I can't contact my delivery person
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <span className="text-sm">I want to cancel my order</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Need immediate assistance?
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingModal;
