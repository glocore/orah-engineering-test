import { RolllStateType } from "shared/models/roll"
import { create } from "zustand"

export type SortBy = "first_name" | "last_name"
export type SortOrder = "asc" | "desc"

type State = {
  sortBy: SortBy
  sortOrder: SortOrder
  searchTerm: string
  isRollMode: boolean
  rollStates: Map<number, RolllStateType>
}

type Action = {
  setSortBy: (sortBy: SortBy) => void
  setSortOrder: (sortOrder: SortOrder) => void
  setSearchTerm: (searchTerm: string) => void
  enterRollMode: () => void
  exitRollMode: () => void
  setInitialRollStates: (studentIds: number[]) => void
  updateRollStateFor: (studentId: number, rollState: RolllStateType) => void
  resetRollStates: () => void
}

export const useStudentListStore = create<State & Action>()((set) => ({
  sortBy: "first_name",
  sortOrder: "asc",
  searchTerm: "",
  isRollMode: false,
  rollStates: new Map(),

  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  enterRollMode: () => set({ isRollMode: true }),
  exitRollMode: () =>
    set((state) => {
      state.resetRollStates()
      return { isRollMode: false }
    }),
  setInitialRollStates: (studentIds) =>
    set((state) => {
      const rollStates = new Map(state.rollStates)
      studentIds.forEach((s) => rollStates.set(s, "unmark"))

      return { rollStates }
    }),
  updateRollStateFor: (studentId, rollState) =>
    set((state) => {
      const rollStates = new Map(state.rollStates)
      rollStates.set(studentId, rollState)

      return { rollStates }
    }),
  resetRollStates: () =>
    set((state) => {
      const rollStates = new Map(state.rollStates)
      rollStates.forEach((_, studentId) => rollStates.set(studentId, "unmark"))

      return { rollStates }
    }),
}))
