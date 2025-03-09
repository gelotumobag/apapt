import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface MenuSectionProps {
  id?: string;
  title?: string;
  description?: string;
  items?: MenuItem[];
  isOpen?: boolean;
}

const MenuSection = ({
  id = "section-1",
  title = "Popular Items",
  description = "Our most ordered dishes that customers love",
  items = [
    {
      id: "item-1",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&q=75",
    },
    {
      id: "item-2",
      name: "Chicken Alfredo Pasta",
      description: "Creamy alfredo sauce with grilled chicken and fettuccine",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=300&q=75",
    },
    {
      id: "item-3",
      name: "Caesar Salad",
      description:
        "Fresh romaine lettuce with caesar dressing, croutons, and parmesan",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&q=75",
    },
  ],
  isOpen = true,
}: MenuSectionProps) => {
  const [expanded, setExpanded] = React.useState(isOpen);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm mb-4">
      <Accordion
        type="single"
        defaultValue={isOpen ? id : undefined}
        collapsible
      >
        <AccordionItem value={id} className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0"
                  onClick={() => {
                    // This would open the item customization modal
                    console.log(`Open customization modal for ${item.name}`);
                  }}
                >
                  {item.image && (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      // This would add the item to cart without customization
                      console.log(`Add ${item.name} to cart`);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MenuSection;
