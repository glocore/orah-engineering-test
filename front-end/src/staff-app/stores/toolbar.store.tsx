import { create } from "zustand"

export type SortBy = "first_name" | "last_name"
export type SortOrder = "asc" | "desc"

type State = {
  sortBy: SortBy
  sortOrder: SortOrder
  searchTerm: string
  isRollMode: boolean
}

type Action = {
  setSortBy: (sortBy: SortBy) => void
  setSortOrder: (sortOrder: SortOrder) => void
  setSearchTerm: (searchTerm: string) => void
  setIsRollMode: (isRollMode: boolean) => void
}

export const useToolbarStore = create<State & Action>()((set) => ({
  sortBy: "first_name",
  sortOrder: "asc",
  searchTerm: "",
  isRollMode: false,

  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setIsRollMode: (isRollMode) => set({ isRollMode }),
}))
