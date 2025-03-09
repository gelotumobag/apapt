import React, { useState } from "react";
import { MapPin, CreditCard, Clock, Truck, Store } from "lucide-react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CheckoutOptionsProps {
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  total?: number;
  onPlaceOrder?: () => void;
}

const CheckoutOptions = ({
  subtotal = 24.99,
  deliveryFee = 3.99,
  tax = 2.45,
  total = subtotal + deliveryFee + tax,
  onPlaceOrder = () => console.log("Order placed"),
}: CheckoutOptionsProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const addresses = [
    {
      id: "1",
      label: "Home",
      address: "123 Main St, Apt 4B, New York, NY 10001",
    },
    {
      id: "2",
      label: "Work",
      address: "456 Office Blvd, Suite 200, New York, NY 10002",
    },
  ];

  const paymentCards = [
    { id: "1", type: "Visa", last4: "4242", expiry: "04/25" },
    { id: "2", type: "Mastercard", last4: "5555", expiry: "08/26" },
  ];

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Checkout Options</h2>

      {/* Delivery Method Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Delivery Method</h3>
        <Tabs
          defaultValue="delivery"
          value={deliveryMethod}
          onValueChange={setDeliveryMethod}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="pickup" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span>Pickup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="mt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Delivery Address</label>
              <Select defaultValue="1">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((addr) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{addr.label}</span>
                        <span className="text-xs text-gray-500">
                          {addr.address}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="text-primary">+ Add new address</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{addresses[0].address}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pickup" className="mt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Pickup Time</label>
              <Select defaultValue="asap">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">
                    As soon as possible (15-20 min)
                  </SelectItem>
                  <SelectItem value="30min">In 30 minutes</SelectItem>
                  <SelectItem value="1hour">In 1 hour</SelectItem>
                  <SelectItem value="schedule">Schedule for later</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Estimated pickup time: 12:45 PM</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Payment Method</h3>
        <RadioGroup
          defaultValue="card"
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="card" id="card" />
            <label
              htmlFor="card"
              className="flex-1 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Credit/Debit Card</span>
              </div>
              <Select defaultValue="1">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select card" />
                </SelectTrigger>
                <SelectContent>
                  {paymentCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.type} ending in {card.last4}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add new card</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="cash" id="cash" />
            <label htmlFor="cash" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-lg">💵</span>
                <span>
                  Cash on{" "}
                  {deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
                </span>
              </div>
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 mb-6">
        <h3 className="text-sm font-medium mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {deliveryMethod === "delivery" && (
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mb-6">
        <label
          htmlFor="instructions"
          className="text-sm font-medium block mb-2"
        >
          Special Instructions (optional)
        </label>
        <Input
          id="instructions"
          placeholder="E.g., Ring doorbell, leave at door, etc."
          className="w-full"
        />
      </div>

      {/* Place Order Button */}
      <Button onClick={onPlaceOrder} className="w-full py-6" size="lg">
        Place Order
      </Button>
    </div>
  );
};

export default CheckoutOptions;
