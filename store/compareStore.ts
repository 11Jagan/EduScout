"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { College } from "@/types";

interface CompareStore {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareList: [],

      addToCompare: (college) => {
        const { compareList } = get();
        if (compareList.length >= 3) return;
        if (compareList.find((c) => c.id === college.id)) return;
        set({ compareList: [...compareList, college] });
      },

      removeFromCompare: (id) => {
        set((state) => ({
          compareList: state.compareList.filter((c) => c.id !== id),
        }));
      },

      clearCompare: () => set({ compareList: [] }),

      isInCompare: (id) => get().compareList.some((c) => c.id === id),
    }),
    {
      name: "eduscout-compare",
    }
  )
);
