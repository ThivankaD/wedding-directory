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
    <Select key={value || "empty"} value={value || undefined} onValueChange={handleCategorySelect}>
      <SelectTrigger
        id="bcategory"
        variant="borderless"
        className="h-7 w-full bg-transparent px-2 py-0 text-left font-body text-xs sm:text-sm font-medium text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none dark:focus:ring-0 dark:focus:ring-offset-0 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0 dark:focus-visible:outline-none rounded-none shadow-none hover:bg-transparent border-none outline-none ring-0"
      >
        <SelectValue placeholder="Select Service" />
      </SelectTrigger>
      <SelectContent className="w-full bg-white dark:bg-darkElevated rounded-xl shadow-xl border border-orange/15 dark:border-zinc-700 max-h-60 overflow-y-auto z-50 p-1.5">
        <SelectItem
          value="ALL"
          className="text-gray-500 dark:text-zinc-400 italic font-body rounded-lg cursor-pointer transition duration-150 ease-in-out"
        >
          All Services
        </SelectItem>
        {categories.map((category, index) => (
          <SelectItem
            key={index}
            value={category}
            className="text-gray-800 dark:text-zinc-200 font-body rounded-lg cursor-pointer transition duration-150 ease-in-out"
          >
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryInput;
