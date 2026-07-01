import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StringState, InstrumentName } from '@kretoffer/guitar-audio-kit'
import { getInstrumentChords } from '@/data/chords.ts'

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
  highScoreDiagram: number
  highScoreName: number
  highScoreSpeed: number
  incrementScore: () => void
  resetScore: () => void
  setHighScore: (score: number, mode: 'diagram' | 'name') => void
  setSpeedHighScore: (cycles: number) => void
  stringStates: StringState[]
  setStringStates: (states: StringState[]) => void
  instrumentName: InstrumentName
  tuningName: string
  setInstrument: (name: InstrumentName, tuning?: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      selectAllChords: () => {
        const { instrumentName, tuningName } = get()
        const chords = getInstrumentChords(instrumentName, tuningName)
        set({ selectedChords: Object.keys(chords) })
      },
      clearChords: () => set({ selectedChords: [] }),
      score: 0,
      totalRounds: 0,
      highScoreDiagram: 0,
      highScoreName: 0,
      highScoreSpeed: 0,
      incrementScore: () =>
        set((s) => ({ score: s.score + 1, totalRounds: s.totalRounds + 1 })),
      resetScore: () => set({ score: 0, totalRounds: 0 }),
      setHighScore: (score, mode) =>
        set((s) => ({
          highScoreDiagram: mode === 'diagram' ? Math.max(score, s.highScoreDiagram) : s.highScoreDiagram,
          highScoreName: mode === 'name' ? Math.max(score, s.highScoreName) : s.highScoreName,
        })),
      setSpeedHighScore: (cycles) =>
        set((s) => ({ highScoreSpeed: Math.max(cycles, s.highScoreSpeed) })),
      stringStates: [],
      setStringStates: (states) => set({ stringStates: states }),
      instrumentName: 'guitar' as InstrumentName,
      tuningName: 'standard',
      setInstrument: (name, tuning) =>
        set((s) => {
          const newTuning = tuning ?? 'standard'
          const chords = getInstrumentChords(name, newTuning)
          const filtered = s.selectedChords.filter((c) => c in chords)
          return {
            instrumentName: name,
            tuningName: newTuning,
            selectedChords: filtered.length > 0 ? filtered : [Object.keys(chords)[0]].filter(Boolean),
          }
        }),
    }),
    { name: 'guitar-trainer-storage' }
  )
)
