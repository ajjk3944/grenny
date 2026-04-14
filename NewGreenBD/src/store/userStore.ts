import { create } from 'zustand';

interface UserStore {
  points: number;
  level: number;
  rank: number;
  addPoints: (points: number) => void;
  setLevel: (level: number) => void;
  setRank: (rank: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  points: 0,
  level: 1,
  rank: 0,

  addPoints: (points: number) =>
    set((state) => ({ points: state.points + points })),

  setLevel: (level: number) => set({ level }),

  setRank: (rank: number) => set({ rank }),
}));
