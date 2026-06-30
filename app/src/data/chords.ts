import type { InstrumentName } from '@kretoffer/guitar-audio-kit'
import { getInstrument } from '@kretoffer/guitar-audio-kit'
import type { ChordShape } from './instrumentChords.ts'
import { CHORDS_BY_INSTRUMENT } from './instrumentChords.ts'

export type { ChordShape }

export function getInstrumentChords(
  name: InstrumentName,
  tuningName?: string,
): Record<string, ChordShape> {
  const instrument = getInstrument(name)
  const tuning = tuningName ?? instrument.defaultTuning
  const tunings = CHORDS_BY_INSTRUMENT[name]
  if (!tunings) return {}
  return tunings[tuning] ?? {}
}

export function hasInstrumentChords(
  name: InstrumentName,
  tuningName?: string,
): boolean {
  const chords = getInstrumentChords(name, tuningName)
  return Object.keys(chords).length > 0
}
