import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FILTER_CATEGORIES = [
  { value: "use_case", label: "Use Case" },
  { value: "product", label: "Product" },
  { value: "lifecycle", label: "Lifecycle Stage" },
];

const CATEGORY_OPTIONS: Record<string, { value: string; label: string }[]> = {
  use_case: [
    { value: "network_automation", label: "Network Automation" },
    { value: "cloud_ops", label: "Cloud Operations" },
    { value: "security_ops", label: "Security Operations" },
    { value: "data_analytics", label: "Data Analytics" },
  ],
  product: [
    { value: "intersight", label: "Intersight" },
    { value: "catalyst", label: "Catalyst" },
    { value: "thousand_eyes", label: "ThousandEyes" },
    { value: "meraki", label: "Meraki" },
    { value: "webex", label: "Webex" },
  ],
  lifecycle: [
    { value: "draft", label: "Draft" },
    { value: "in_review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "deprecated", label: "Deprecated" },
  ],
};

export default function SkillCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setFilterOption(""); // Reset second filter when category changes
  };

  const availableOptions = filterCategory ? CATEGORY_OPTIONS[filterCategory] || [] : [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Skill Catalogue</h1>
        <p className="text-muted-foreground mt-1">
          Browse and discover skills available across all MCP servers
        </p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills by name, description, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterOption}
          onValueChange={setFilterOption}
          disabled={!filterCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg mb-2">Skill catalogue display coming soon</p>
            <p className="text-sm">
              Use the filters above to explore skills by use case, product, or lifecycle stage
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
