import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-LK", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-LK", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

export function getMedalEmoji(medal: string): string {
  const map: Record<string, string> = {
    gold: "🥇", silver: "🥈", bronze: "🥉", "4th": "4️⃣", participated: "🎽",
  };
  return map[medal] || "🏅";
}

export function getMedalColor(medal: string): string {
  const map: Record<string, string> = {
    gold: "text-yellow-600 bg-yellow-50",
    silver: "text-gray-500 bg-gray-50",
    bronze: "text-amber-700 bg-amber-50",
    "4th": "text-blue-600 bg-blue-50",
    participated: "text-green-600 bg-green-50",
  };
  return map[medal] || "text-gray-600 bg-gray-50";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    upcoming: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function generateRegistrationNo(year: number, seq: number): string {
  return `VBA-${year}-${String(seq).padStart(3, "0")}`;
}

export const WEIGHT_CLASSES = [
  "46kg", "48kg", "50kg", "52kg", "54kg", "57kg", "60kg",
  "63.5kg", "67kg", "71kg", "75kg", "80kg", "86kg", "92kg", "+92kg",
];

export const EVENT_CATEGORIES = [
  { value: "tournament", label: "Tournament" },
  { value: "championship", label: "Championship" },
  { value: "training_camp", label: "Training Camp" },
  { value: "selection_trial", label: "Selection Trial" },
  { value: "friendly", label: "Friendly" },
  { value: "other", label: "Other" },
];

export const EVENT_LEVELS = [
  { value: "district", label: "District" },
  { value: "provincial", label: "Provincial" },
  { value: "national", label: "National" },
  { value: "international", label: "International" },
];
