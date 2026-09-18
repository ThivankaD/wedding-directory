import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import categories from "../../utils/category.json";
import { CategoryProps } from "@/types/signupInput";

const CategoryInput: React.FC<CategoryProps> = ({ onCategoryChange, value }) => {
  const handleCategorySelect = (selected: string) => {
    onCategoryChange(selected === "ALL" ? "" : selected);
  };

  return (
    <Select value={value || undefined} onValueChange={handleCategorySelect}>
      <SelectTrigger
        id="bcategory"
        variant="borderless"
        className="h-7 w-full bg-transparent px-2 py-0 text-left font-body text-xs sm:text-sm font-medium text-gray-800 focus:outline-none rounded-none shadow-none hover:bg-transparent border-none"
      >
        <SelectValue placeholder="Select Service" />
      </SelectTrigger>
      <SelectContent className="w-full bg-white rounded-xl shadow-xl border border-orange/15 max-h-60 overflow-y-auto z-50">
        <SelectItem
          value="ALL"
          className="p-2 text-gray-500 italic font-body hover:bg-orange/10 hover:text-orange rounded-lg cursor-pointer transition duration-150 ease-in-out"
        >
          All Services
        </SelectItem>
        {categories.map((category, index) => (
          <SelectItem
            key={index}
            value={category}
            className="p-2 text-gray-800 font-body hover:bg-orange/10 hover:text-orange rounded-lg cursor-pointer transition duration-150 ease-in-out"
          >
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryInput;
