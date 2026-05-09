import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const COLLEGE_TYPES = [
  { value: "IIT", label: "IITs" },
  { value: "NIT", label: "NITs" },
  { value: "AIIMS", label: "AIIMS" },
  { value: "IIM", label: "IIMs" },
  { value: "CENTRAL_UNIVERSITY", label: "Central University" },
  { value: "STATE_UNIVERSITY", label: "State University" },
  { value: "DEEMED", label: "Deemed University" },
  { value: "PRIVATE", label: "Private" },
];

export const FEES_RANGES = [
  { value: "0-100000", label: "Under ₹1 Lakh/yr" },
  { value: "100000-300000", label: "₹1L - ₹3L/yr" },
  { value: "300000-500000", label: "₹3L - ₹5L/yr" },
  { value: "500000-9999999", label: "Above ₹5 Lakh/yr" },
];

export function formatPackage(amount: number): string {
  if (!amount) return "N/A";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} LPA`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatFees(amount: number): string {
  if (!amount) return "N/A";
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L/yr`;
  }
  return `₹${amount.toLocaleString('en-IN')}/yr`;
}
