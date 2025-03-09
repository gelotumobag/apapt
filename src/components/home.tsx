import React, { useState } from "react";
import { Search, ShoppingBag, User, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FilterBar from "./home/FilterBar";
import RestaurantGrid from "./home/RestaurantGrid";
import RestaurantDetailModal from "./restaurant/RestaurantDetailModal";
import CartDrawer from "./cart/CartDrawer";
import OrderTrackingModal from "./order/OrderTrackingModal";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null,
  );
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRestaurantClick = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
    setIsRestaurantModalOpen(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4">
                      <h2 className="text-lg font-bold">QuickCrave</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isAuthenticated ? (
                        <>
                          <Button variant="ghost" className="justify-start">
                            <User className="mr-2 h-5 w-5" />
                            My Profile
                          </Button>
                          <Button variant="ghost" className="justify-start">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Order History
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                        >
                          Sign In / Sign Up
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-bold text-primary">QuickCrave</h1>
            </div>

            {/* Address Selection - Desktop */}
            <div className="hidden md:flex items-center border rounded-md px-3 py-1 cursor-pointer hover:bg-gray-50 max-w-xs">
              <MapPin className="h-4 w-4 text-primary mr-2" />
              <div className="truncate">
                <p className="text-xs text-gray-500">Deliver to</p>
                <p className="text-sm font-medium truncate">
                  123 Main St, New York, NY 10001
                </p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search for restaurants or food"
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOrderTrackingOpen(true)}
                  >
                    Orders
                  </Button>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:flex"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="mt-3 md:hidden">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search for restaurants or food"
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Address Selection - Mobile */}
          <div className="mt-2 md:hidden flex items-center border rounded-md px-3 py-1 cursor-pointer hover:bg-gray-50">
            <MapPin className="h-4 w-4 text-primary mr-2" />
            <div>
              <p className="text-xs text-gray-500">Deliver to</p>
              <p className="text-sm font-medium">
                123 Main St, New York, NY 10001
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <RestaurantGrid onRestaurantClick={handleRestaurantClick} />
      </main>

      {/* Modals */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          open={isRestaurantModalOpen}
          onOpenChange={setIsRestaurantModalOpen}
        />
      )}

      <OrderTrackingModal
        open={isOrderTrackingOpen}
        onOpenChange={setIsOrderTrackingOpen}
      />

      {/* Auth Modal - Using Dialog directly since AuthModal is not properly implemented */}
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isAuthModalOpen ? "block" : "hidden"}`}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sign In</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAuthModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-4">
            <Input placeholder="Email" type="email" />
            <Input placeholder="Password" type="password" />
            <Button className="w-full" onClick={handleLogin}>
              Sign In
            </Button>
            <div className="text-center text-sm text-gray-500">
              <p>
                Don't have an account?{" "}
                <span className="text-primary cursor-pointer">Sign Up</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
