import { Calendar, Hash, Package } from "lucide-react";

export const sortOptions = [
  { label: "Position", value: "position_asc", icon: Hash },
  { label: "Newest First", value: "createdAt_desc", icon: Calendar },
  { label: "Oldest First", value: "createdAt_asc", icon: Calendar },
  { label: "Name A-Z", value: "name_asc", icon: Package },
  { label: "Name Z-A", value: "name_desc", icon: Package },
  { label: "Amount High-Low", value: "amount_desc", icon: Hash },
  { label: "Amount Low-High", value: "amount_asc", icon: Hash },
];

export const amountRangeOptions = [
  { label: "Under 100", value: "0-99" },
  { label: "100-500", value: "100-500" },
  { label: "500-1000", value: "500-1000" },
  { label: "Over 1000", value: "1000+" },
];

export const dateRangeOptions = [
  { label: "Today", value: "today", icon: Calendar },
  { label: "This Week", value: "week", icon: Calendar },
  { label: "This Month", value: "month", icon: Calendar },
  { label: "This Year", value: "year", icon: Calendar },
];
