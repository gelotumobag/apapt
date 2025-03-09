import React, { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterOption {
  id: string;
  label: string;
  selected?: boolean;
}

interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
  cuisineOptions?: FilterOption[];
  priceRangeOptions?: FilterOption[];
  ratingOptions?: FilterOption[];
  distanceOptions?: FilterOption[];
}

const FilterBar = ({
  onFilterChange = () => {},
  cuisineOptions = [
    { id: "italian", label: "Italian" },
    { id: "chinese", label: "Chinese" },
    { id: "mexican", label: "Mexican" },
    { id: "indian", label: "Indian" },
    { id: "japanese", label: "Japanese" },
    { id: "thai", label: "Thai" },
    { id: "american", label: "American" },
    { id: "mediterranean", label: "Mediterranean" },
    { id: "korean", label: "Korean" },
    { id: "vietnamese", label: "Vietnamese" },
  ],
  priceRangeOptions = [
    { id: "$", label: "$" },
    { id: "$$", label: "$$" },
    { id: "$$$", label: "$$$" },
    { id: "$$$$", label: "$$$$" },
  ],
  ratingOptions = [
    { id: "4.5+", label: "4.5+" },
    { id: "4.0+", label: "4.0+" },
    { id: "3.5+", label: "3.5+" },
    { id: "3.0+", label: "3.0+" },
  ],
  distanceOptions = [
    { id: "1", label: "< 1 mile" },
    { id: "3", label: "< 3 miles" },
    { id: "5", label: "< 5 miles" },
    { id: "10", label: "< 10 miles" },
  ],
}: FilterBarProps) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<number[]>([60]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cuisines");

  const handleCuisineToggle = (cuisineId: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId],
    );
  };

  const handlePriceRangeToggle = (priceId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(priceId)
        ? prev.filter((id) => id !== priceId)
        : [...prev, priceId],
    );
  };

  const handleRatingToggle = (ratingId: string) => {
    setSelectedRatings((prev) =>
      prev.includes(ratingId)
        ? prev.filter((id) => id !== ratingId)
        : [...prev, ratingId],
    );
  };

  const handleDistanceSelect = (distanceId: string) => {
    setSelectedDistance(distanceId);
  };

  const handleDeliveryTimeChange = (value: number[]) => {
    setDeliveryTime(value);
  };

  const handleApplyFilters = () => {
    const filters = {
      cuisines: selectedCuisines,
      priceRanges: selectedPriceRanges,
      ratings: selectedRatings,
      distance: selectedDistance,
      maxDeliveryTime: deliveryTime[0],
    };
    onFilterChange(filters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCuisines([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSelectedDistance("");
    setDeliveryTime([60]);
    onFilterChange({});
  };

  const removeFilter = (type: string, id: string) => {
    switch (type) {
      case "cuisine":
        setSelectedCuisines((prev) => prev.filter((item) => item !== id));
        break;
      case "price":
        setSelectedPriceRanges((prev) => prev.filter((item) => item !== id));
        break;
      case "rating":
        setSelectedRatings((prev) => prev.filter((item) => item !== id));
        break;
      case "distance":
        setSelectedDistance("");
        break;
    }
  };

  const getActiveFilterCount = () => {
    return (
      selectedCuisines.length +
      selectedPriceRanges.length +
      selectedRatings.length +
      (selectedDistance ? 1 : 0)
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-between items-center mb-3">
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>

              <Tabs
                defaultValue="cuisines"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="cuisines">Cuisine</TabsTrigger>
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="rating">Rating</TabsTrigger>
                  <TabsTrigger value="distance">Distance</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="py-4">
                {activeTab === "cuisines" && (
                  <div className="grid grid-cols-2 gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <div
                        key={cuisine.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`cuisine-${cuisine.id}`}
                          checked={selectedCuisines.includes(cuisine.id)}
                          onCheckedChange={() =>
                            handleCuisineToggle(cuisine.id)
                          }
                        />
                        <label
                          htmlFor={`cuisine-${cuisine.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {cuisine.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "price" && (
                  <div className="flex flex-wrap gap-2">
                    {priceRangeOptions.map((price) => (
                      <Button
                        key={price.id}
                        variant={
                          selectedPriceRanges.includes(price.id)
                            ? "default"
                            : "outline"
                        }
                        className="flex-1"
                        onClick={() => handlePriceRangeToggle(price.id)}
                      >
                        {price.label}
                      </Button>
                    ))}
                  </div>
                )}

                {activeTab === "rating" && (
                  <div className="flex flex-col gap-2">
                    {ratingOptions.map((rating) => (
                      <div
                        key={rating.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`rating-${rating.id}`}
                          checked={selectedRatings.includes(rating.id)}
                          onCheckedChange={() => handleRatingToggle(rating.id)}
                        />
                        <label
                          htmlFor={`rating-${rating.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {rating.label} stars
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "distance" && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      {distanceOptions.map((distance) => (
                        <div
                          key={distance.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`distance-${distance.id}`}
                            checked={selectedDistance === distance.id}
                            onCheckedChange={() =>
                              handleDistanceSelect(distance.id)
                            }
                          />
                          <label
                            htmlFor={`distance-${distance.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {distance.label}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Max Delivery Time</h4>
                      <div className="flex items-center gap-2">
                        <Slider
                          defaultValue={[60]}
                          max={120}
                          step={5}
                          value={deliveryTime}
                          onValueChange={handleDeliveryTimeChange}
                          className="flex-1"
                        />
                        <span className="text-sm w-16 text-right">
                          {deliveryTime[0]} min
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mr-2"
                >
                  Clear All
                </Button>
                <DialogClose asChild>
                  <Button onClick={handleApplyFilters}>Apply Filters</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Selected filters display for mobile */}
          {activeFilterCount > 0 && (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-2 py-1">
                {selectedCuisines.map((id) => {
                  const cuisine = cuisineOptions.find((c) => c.id === id);
                  return (
                    <Badge
                      key={`cuisine-${id}`}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {cuisine?.label}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("cuisine", id)}
                      />
                    </Badge>
                  );
                })}
                {selectedPriceRanges.map((id) => {
                  const price = priceRangeOptions.find((p) => p.id === id);
                  return (
                    <Badge
                      key={`price-${id}`}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {price?.label}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("price", id)}
                      />
                    </Badge>
                  );
                })}
                {selectedRatings.map((id) => {
                  const rating = ratingOptions.find((r) => r.id === id);
                  return (
                    <Badge
                      key={`rating-${id}`}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {rating?.label} stars
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("rating", id)}
                      />
                    </Badge>
                  );
                })}
                {selectedDistance && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {
                      distanceOptions.find((d) => d.id === selectedDistance)
                        ?.label
                    }
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => removeFilter("distance", selectedDistance)}
                    />
                  </Badge>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            <ScrollArea className="w-full">
              <div className="flex space-x-4">
                {/* Cuisine Filter */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Cuisine
                      {selectedCuisines.length > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {selectedCuisines.length}
                        </Badge>
                      )}
                      <ChevronDown size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Cuisine Types</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-4">
                      {cuisineOptions.map((cuisine) => (
                        <div
                          key={cuisine.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`cuisine-dialog-${cuisine.id}`}
                            checked={selectedCuisines.includes(cuisine.id)}
                            onCheckedChange={() =>
                              handleCuisineToggle(cuisine.id)
                            }
                          />
                          <label
                            htmlFor={`cuisine-dialog-${cuisine.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {cuisine.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCuisines([])}
                        className="mr-2"
                      >
                        Clear
                      </Button>
                      <DialogClose asChild>
                        <Button>Apply</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Price Range Filter */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Price Range
                      {selectedPriceRanges.length > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {selectedPriceRanges.length}
                        </Badge>
                      )}
                      <ChevronDown size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Price Range</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap gap-3 py-4">
                      {priceRangeOptions.map((price) => (
                        <Button
                          key={price.id}
                          variant={
                            selectedPriceRanges.includes(price.id)
                              ? "default"
                              : "outline"
                          }
                          className="flex-1"
                          onClick={() => handlePriceRangeToggle(price.id)}
                        >
                          {price.label}
                        </Button>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPriceRanges([])}
                        className="mr-2"
                      >
                        Clear
                      </Button>
                      <DialogClose asChild>
                        <Button>Apply</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Rating Filter */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Rating
                      {selectedRatings.length > 0 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {selectedRatings.length}
                        </Badge>
                      )}
                      <ChevronDown size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Rating</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                      {ratingOptions.map((rating) => (
                        <div
                          key={rating.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`rating-dialog-${rating.id}`}
                            checked={selectedRatings.includes(rating.id)}
                            onCheckedChange={() =>
                              handleRatingToggle(rating.id)
                            }
                          />
                          <label
                            htmlFor={`rating-dialog-${rating.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {rating.label} stars
                          </label>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRatings([])}
                        className="mr-2"
                      >
                        Clear
                      </Button>
                      <DialogClose asChild>
                        <Button>Apply</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Distance Filter */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Distance
                      {selectedDistance && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          1
                        </Badge>
                      )}
                      <ChevronDown size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Distance</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                      {distanceOptions.map((distance) => (
                        <div
                          key={distance.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`distance-dialog-${distance.id}`}
                            checked={selectedDistance === distance.id}
                            onCheckedChange={() =>
                              handleDistanceSelect(distance.id)
                            }
                          />
                          <label
                            htmlFor={`distance-dialog-${distance.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {distance.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedDistance("")}
                        className="mr-2"
                      >
                        Clear
                      </Button>
                      <DialogClose asChild>
                        <Button>Apply</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delivery Time Filter */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Delivery Time
                      {deliveryTime[0] < 60 && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          1
                        </Badge>
                      )}
                      <ChevronDown size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Max Delivery Time</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-2">
                        <Slider
                          defaultValue={[60]}
                          max={120}
                          step={5}
                          value={deliveryTime}
                          onValueChange={handleDeliveryTimeChange}
                          className="flex-1"
                        />
                        <span className="text-sm w-16 text-right">
                          {deliveryTime[0]} min
                        </span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeliveryTime([60])}
                        className="mr-2"
                      >
                        Reset
                      </Button>
                      <DialogClose asChild>
                        <Button>Apply</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </ScrollArea>

            {/* Clear All Filters Button */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="ml-2"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Selected filters display for desktop */}
          {activeFilterCount > 0 && (
            <ScrollArea className="w-full mt-3">
              <div className="flex flex-wrap gap-2">
                {selectedCuisines.map((id) => {
                  const cuisine = cuisineOptions.find((c) => c.id === id);
                  return (
                    <Badge
                      key={`cuisine-${id}`}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {cuisine?.label}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("cuisine", id)}
                      />
                    </Badge>
                  );
                })}
                {selectedPriceRanges.map((id) => {
                  const price = priceRangeOptions.find((p) => p.id === id);
                  return (
                    <Badge
                      key={`price-${id}`}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {price?.label}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("price", id)}
                      />
                    </Badge>
                  );
                })}
                {selectedRatings.map((id) => {
                  const rating = ratingOptions.find((r) => r.id === id);
                  return (
                    <Badge
                      key={`rating-${id}`}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {rating?.label} stars
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeFilter("rating", id)}
                      />
                    </Badge>
                  );
                })}
                {selectedDistance && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {
                      distanceOptions.find((d) => d.id === selectedDistance)
                        ?.label
                    }
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => removeFilter("distance", selectedDistance)}
                    />
                  </Badge>
                )}
                {deliveryTime[0] < 60 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    Max {deliveryTime[0]} min
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => setDeliveryTime([60])}
                    />
                  </Badge>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
