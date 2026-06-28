import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StringState } from '@kretoffer/guitar-audio-kit'
import { CHORD_KEYS } from '@/data/chords.ts'

interface AppState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  showFingerNumbers: boolean
  toggleFingerNumbers: () => void
  selectedChords: string[]
  toggleChord: (chord: string) => void
  selectAllChords: () => void
  clearChords: () => void
  score: number
  totalRounds: number
  incrementScore: () => void
  resetScore: () => void
  stringStates: StringState[]
  setStringStates: (states: StringState[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      showFingerNumbers: true,
      toggleFingerNumbers: () =>
        set((s) => ({ showFingerNumbers: !s.showFingerNumbers })),
      selectedChords: ['Am', 'C', 'G', 'Em', 'D'],
      toggleChord: (chord) =>
        set((s) => ({
          selectedChords: s.selectedChords.includes(chord)
            ? s.selectedChords.filter((c) => c !== chord)
            : [...s.selectedChords, chord],
        })),
      selectAllChords: () =>
        set({ selectedChords: [...CHORD_KEYS] }),
      clearChords: () => set({ selectedChords: [] }),
      score: 0,
      totalRounds: 0,
      incrementScore: () =>
        set((s) => ({ score: s.score + 1, totalRounds: s.totalRounds + 1 })),
      resetScore: () => set({ score: 0, totalRounds: 0 }),
      stringStates: [],
      setStringStates: (states) => set({ stringStates: states }),
    }),
    { name: 'guitar-trainer-storage' }
  )
)
