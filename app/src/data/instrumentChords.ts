import type { InstrumentName } from '@kretoffer/guitar-audio-kit'

export interface ChordShape {
  name: string
  frets: number[]
  fingers: (number | null)[]
}

type ChordLib = Record<string, ChordShape>

const CHORDS_6: ChordLib = {
  'A':     { name: 'A',     frets: [-1, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },
  'Am':    { name: 'Am',    frets: [-1, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
  'A7':    { name: 'A7',    frets: [-1, 0, 2, 0, 2, 0], fingers: [null, null, 1, null, 2, null] },
  'Am7':   { name: 'Am7',   frets: [-1, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null] },
  'Amaj7': { name: 'Amaj7', frets: [-1, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null] },
  'Asus2': { name: 'Asus2', frets: [-1, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null] },
  'Asus4': { name: 'Asus4', frets: [-1, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 4, null] },
  'B':     { name: 'B',     frets: [-1, 2, 4, 4, 4, 2], fingers: [null, 1, 3, 3, 3, 1] },
  'Bm':    { name: 'Bm',    frets: [-1, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 3, 2, 1] },
  'B7':    { name: 'B7',    frets: [-1, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4] },
  'Bdim':  { name: 'Bdim',  frets: [-1, 2, 3, 4, 3, -1], fingers: [null, 1, 2, 4, 3, null] },
  'C':     { name: 'C',     frets: [-1, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
  'C7':    { name: 'C7',    frets: [-1, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null] },
  'Cmaj7': { name: 'Cmaj7', frets: [-1, 3, 2, 0, 0, 0], fingers: [null, 2, 1, null, null, null] },
  'D':     { name: 'D',     frets: [-1, -1, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
  'Dm':    { name: 'Dm',    frets: [-1, -1, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
  'D7':    { name: 'D7',    frets: [-1, -1, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] },
  'Dm7':   { name: 'Dm7',   frets: [-1, -1, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1] },
  'Dmaj7': { name: 'Dmaj7', frets: [-1, -1, 0, 2, 2, 2], fingers: [null, null, null, 1, 2, 3] },
  'Dsus2': { name: 'Dsus2', frets: [-1, -1, 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null] },
  'Dsus4': { name: 'Dsus4', frets: [-1, -1, 0, 2, 3, 3], fingers: [null, null, null, 1, 2, 3] },
  'E':     { name: 'E',     frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
  'Em':    { name: 'Em',    frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
  'E7':    { name: 'E7',    frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] },
  'Em7':   { name: 'Em7',   frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] },
  'Emaj7': { name: 'Emaj7', frets: [0, 2, 1, 1, 0, 0], fingers: [null, 3, 1, 2, null, null] },
  'Esus4': { name: 'Esus4', frets: [0, 2, 2, 2, 0, 0], fingers: [null, 1, 2, 3, null, null] },
  'Eaug':  { name: 'Eaug',  frets: [-1, 3, 2, 1, 1, 0], fingers: [null, 3, 2, 1, 1, null] },
  'F':     { name: 'F',     frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  'Fm':    { name: 'Fm',    frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
  'F#m':   { name: 'F#m',   frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
  'Fmaj7': { name: 'Fmaj7', frets: [-1, -1, 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null] },
  'G':     { name: 'G',     frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3] },
  'Gm':    { name: 'Gm',    frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1] },
  'G7':    { name: 'G7',    frets: [3, 2, 0, 0, 0, 1], fingers: [2, 1, null, null, null, 3] },
  'Gsus4': { name: 'Gsus4', frets: [3, 3, 0, 0, 1, 3], fingers: [2, 1, null, null, 3, 4] },
}

function add7thString(chords: ChordLib): ChordLib {
  const out: ChordLib = {}
  for (const [k, v] of Object.entries(chords)) {
    out[k] = { ...v, frets: [-1, ...v.frets], fingers: [null, ...v.fingers] }
  }
  return out
}

function doubleCourses(chords: ChordLib): ChordLib {
  const out: ChordLib = {}
  for (const [k, v] of Object.entries(chords)) {
    const frets: number[] = []
    const fingers: (number | null)[] = []
    for (let i = 0; i < v.frets.length; i++) {
      frets.push(v.frets[i], v.frets[i])
      fingers.push(v.fingers[i], v.fingers[i])
    }
    out[k] = { ...v, frets, fingers }
  }
  return out
}

const CHORD_7 = add7thString(CHORDS_6)
const CHORD_12 = doubleCourses(CHORDS_6)

const CHORDS_BASS: ChordLib = {
  'C':     { name: 'C',     frets: [3, 3, 5, -1], fingers: [2, 1, 3, null] },
  'Cm':    { name: 'Cm',    frets: [3, 3, 4, -1], fingers: [2, 1, 3, null] },
  'C5':    { name: 'C5',    frets: [3, -1, 5, -1], fingers: [1, null, 3, null] },
  'D':     { name: 'D',     frets: [5, 5, 7, -1], fingers: [2, 1, 3, null] },
  'Dm':    { name: 'Dm',    frets: [5, 5, 6, -1], fingers: [2, 1, 3, null] },
  'D5':    { name: 'D5',    frets: [5, -1, 7, -1], fingers: [1, null, 3, null] },
  'E':     { name: 'E',     frets: [0, 2, 2, -1], fingers: [null, 1, 2, null] },
  'Em':    { name: 'Em',    frets: [0, 2, 2, -1], fingers: [null, 1, 2, null] },
  'E5':    { name: 'E5',    frets: [0, -1, 2, -1], fingers: [null, null, 1, null] },
  'F':     { name: 'F',     frets: [1, 1, 3, -1], fingers: [1, 1, 3, null] },
  'Fm':    { name: 'Fm',    frets: [1, 1, 2, -1], fingers: [1, 1, 2, null] },
  'F5':    { name: 'F5',    frets: [1, -1, 3, -1], fingers: [1, null, 3, null] },
  'G':     { name: 'G',     frets: [3, 3, 5, -1], fingers: [2, 1, 3, null] },
  'Gm':    { name: 'Gm',    frets: [3, 3, 4, -1], fingers: [2, 1, 3, null] },
  'G5':    { name: 'G5',    frets: [3, -1, 5, -1], fingers: [1, null, 3, null] },
  'A':     { name: 'A',     frets: [5, 5, 7, -1], fingers: [2, 1, 3, null] },
  'Am':    { name: 'Am',    frets: [5, 5, 6, -1], fingers: [2, 1, 3, null] },
  'A5':    { name: 'A5',    frets: [5, -1, 7, -1], fingers: [1, null, 3, null] },
  'B':     { name: 'B',     frets: [7, 7, 9, -1], fingers: [2, 1, 3, null] },
  'Bm':    { name: 'Bm',    frets: [7, 7, 8, -1], fingers: [2, 1, 3, null] },
  'B5':    { name: 'B5',    frets: [7, -1, 9, -1], fingers: [1, null, 3, null] },
  'C7':    { name: 'C7',    frets: [3, 3, 5, 3], fingers: [2, 1, 3, 1] },
  'D7':    { name: 'D7',    frets: [5, 5, 7, 5], fingers: [2, 1, 3, 1] },
  'E7':    { name: 'E7',    frets: [0, 2, 0, 2], fingers: [null, 1, null, 2] },
  'G7':    { name: 'G7',    frets: [3, 3, 5, 3], fingers: [2, 1, 3, 1] },
  'A7':    { name: 'A7',    frets: [5, 5, 7, 5], fingers: [2, 1, 3, 1] },
  'F#m':   { name: 'F#m',   frets: [2, 4, 4, -1], fingers: [1, 2, 3, null] },
}

function add5thString(chords: ChordLib): ChordLib {
  const out: ChordLib = {}
  for (const [k, v] of Object.entries(chords)) {
    out[k] = { ...v, frets: [-1, ...v.frets], fingers: [null, ...v.fingers] }
  }
  return out
}

const CHORDS_BASS5 = add5thString(CHORDS_BASS)

const CHORDS_UKULELE: ChordLib = {
  'C':     { name: 'C',     frets: [0, 0, 0, 3], fingers: [null, null, null, 1] },
  'Cm':    { name: 'Cm',    frets: [0, 3, 3, 3], fingers: [null, 1, 2, 3] },
  'C7':    { name: 'C7',    frets: [0, 0, 0, 1], fingers: [null, null, null, 1] },
  'D':     { name: 'D',     frets: [2, 2, 2, 0], fingers: [1, 2, 3, null] },
  'Dm':    { name: 'Dm',    frets: [2, 2, 1, 0], fingers: [2, 3, 1, null] },
  'D7':    { name: 'D7',    frets: [2, 2, 2, 3], fingers: [1, 2, 3, 4] },
  'E':     { name: 'E',     frets: [1, 4, 0, 2], fingers: [1, 3, null, 2] },
  'Em':    { name: 'Em',    frets: [0, 4, 0, 2], fingers: [null, 3, null, 1] },
  'E7':    { name: 'E7',    frets: [1, 2, 0, 2], fingers: [1, 2, null, 3] },
  'F':     { name: 'F',     frets: [2, 0, 1, 0], fingers: [2, null, 1, null] },
  'Fm':    { name: 'Fm',    frets: [1, 0, 1, 3], fingers: [1, null, 2, 3] },
  'F7':    { name: 'F7',    frets: [2, 3, 1, 0], fingers: [2, 3, 1, null] },
  'G':     { name: 'G',     frets: [0, 2, 3, 2], fingers: [null, 1, 3, 2] },
  'Gm':    { name: 'Gm',    frets: [0, 2, 3, 1], fingers: [null, 2, 3, 1] },
  'G7':    { name: 'G7',    frets: [0, 2, 1, 2], fingers: [null, 2, 1, 3] },
  'A':     { name: 'A',     frets: [2, 1, 0, 0], fingers: [2, 1, null, null] },
  'Am':    { name: 'Am',    frets: [2, 0, 0, 0], fingers: [1, null, null, null] },
  'A7':    { name: 'A7',    frets: [0, 1, 0, 0], fingers: [null, 1, null, null] },
  'B':     { name: 'B',     frets: [4, 3, 2, 2], fingers: [3, 2, 1, 1] },
  'Bm':    { name: 'Bm',    frets: [4, 2, 2, 2], fingers: [3, 1, 1, 1] },
  'B7':    { name: 'B7',    frets: [2, 3, 2, 2], fingers: [1, 3, 2, 2] },
  'Bb':    { name: 'Bb',    frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1] },
  'Dsus2': { name: 'Dsus2', frets: [2, 2, 0, 0], fingers: [2, 3, null, null] },
  'Dsus4': { name: 'Dsus4', frets: [0, 2, 3, 0], fingers: [null, 1, 2, null] },
  'Esus4': { name: 'Esus4', frets: [2, 4, 0, 2], fingers: [1, 3, null, 2] },
  'Asus2': { name: 'Asus2', frets: [2, 2, 0, 0], fingers: [2, 3, null, null] },
  'Asus4': { name: 'Asus4', frets: [2, 2, 0, 2], fingers: [1, 2, null, 3] },
}

const CHORDS_BALALAIKA: ChordLib = {
  'C':     { name: 'C',     frets: [0, 0, 5], fingers: [null, null, 1] },
  'Cm':    { name: 'Cm',    frets: [0, 1, 5], fingers: [null, 1, 2] },
  'D':     { name: 'D',     frets: [0, 2, 7], fingers: [null, 1, 2] },
  'Dm':    { name: 'Dm',    frets: [0, 3, 7], fingers: [null, 1, 2] },
  'E':     { name: 'E',     frets: [0, 4, 9], fingers: [null, 1, 2] },
  'Em':    { name: 'Em',    frets: [0, 5, 9], fingers: [null, 1, 2] },
  'G':     { name: 'G',     frets: [0, 7, 0], fingers: [null, 1, null] },
  'Gm':    { name: 'Gm',    frets: [0, 8, 0], fingers: [null, 1, null] },
  'A':     { name: 'A',     frets: [0, 9, 2], fingers: [null, 1, 2] },
  'Am':    { name: 'Am',    frets: [0, 10, 2], fingers: [null, 1, 2] },
  'C7':    { name: 'C7',    frets: [0, 0, 3], fingers: [null, null, 1] },
  'D7':    { name: 'D7',    frets: [0, 2, 5], fingers: [null, 1, 2] },
  'E7':    { name: 'E7',    frets: [0, 4, 7], fingers: [null, 1, 2] },
  'G7':    { name: 'G7',    frets: [0, 7, 10], fingers: [null, 1, 2] },
  'A7':    { name: 'A7',    frets: [0, 9, 0], fingers: [null, 1, null] },
}

const CHORDS_DOMRA3 = CHORDS_BALALAIKA

const CHORDS_DOMRA4: ChordLib = {
  'C':     { name: 'C',     frets: [2, 0, 1, 2], fingers: [2, null, 1, 3] },
  'Cm':    { name: 'Cm',    frets: [2, 0, 1, 1], fingers: [2, null, 1, 1] },
  'D':     { name: 'D',     frets: [0, 0, 2, 2], fingers: [null, null, 1, 2] },
  'Dm':    { name: 'Dm',    frets: [0, 0, 2, 1], fingers: [null, null, 2, 1] },
  'E':     { name: 'E',     frets: [2, 2, 4, 4], fingers: [1, 1, 2, 2] },
  'Em':    { name: 'Em',    frets: [2, 2, 4, 3], fingers: [1, 1, 3, 2] },
  'F':     { name: 'F',     frets: [3, 3, 5, 5], fingers: [1, 1, 2, 2] },
  'Fm':    { name: 'Fm',    frets: [3, 3, 5, 4], fingers: [1, 1, 3, 2] },
  'G':     { name: 'G',     frets: [0, 0, 2, 0], fingers: [null, null, 1, null] },
  'Gm':    { name: 'Gm',    frets: [0, 0, 2, 1], fingers: [null, null, 2, 1] },
  'A':     { name: 'A',     frets: [2, 2, 4, 2], fingers: [1, 1, 2, null] },
  'Am':    { name: 'Am',    frets: [2, 2, 4, 3], fingers: [1, 1, 3, 2] },
  'C7':    { name: 'C7',    frets: [2, 0, 1, 0], fingers: [2, null, 1, null] },
  'D7':    { name: 'D7',    frets: [0, 0, 2, 0], fingers: [null, null, 1, null] },
  'E7':    { name: 'E7',    frets: [2, 2, 4, 2], fingers: [1, 1, 2, null] },
  'G7':    { name: 'G7',    frets: [0, 0, 2, 1], fingers: [null, null, 2, 1] },
  'A7':    { name: 'A7',    frets: [2, 2, 4, 0], fingers: [1, 1, 2, null] },
}

const CHORDS_BANJO: ChordLib = {
  'C':     { name: 'C',     frets: [0, 0, 0, 2, 3], fingers: [null, null, null, 1, 2] },
  'Cm':    { name: 'Cm',    frets: [0, 3, 3, 3, 3], fingers: [null, 1, 2, 3, 4] },
  'D':     { name: 'D',     frets: [2, 2, 0, 2, 3], fingers: [1, 2, null, 3, 4] },
  'Dm':    { name: 'Dm',    frets: [2, 2, 0, 2, 1], fingers: [2, 3, null, 4, 1] },
  'E':     { name: 'E',     frets: [4, 4, 0, 4, 5], fingers: [1, 2, null, 3, 4] },
  'Em':    { name: 'Em',    frets: [0, 4, 3, 4, 0], fingers: [null, 2, 1, 3, null] },
  'F':     { name: 'F',     frets: [5, 5, 0, 5, 6], fingers: [1, 2, null, 3, 4] },
  'Fm':    { name: 'Fm',    frets: [5, 5, 1, 5, 1], fingers: [2, 3, 1, 4, 1] },
  'G':     { name: 'G',     frets: [0, 0, 0, 0, 1], fingers: [null, null, null, null, 1] },
  'Gm':    { name: 'Gm',    frets: [0, 0, 3, 0, 1], fingers: [null, null, 2, null, 1] },
  'A':     { name: 'A',     frets: [2, 2, 0, 2, 0], fingers: [1, 2, null, 3, null] },
  'Am':    { name: 'Am',    frets: [2, 2, 0, 0, 0], fingers: [1, 2, null, null, null] },
  'A7':    { name: 'A7',    frets: [0, 2, 0, 2, 0], fingers: [null, 1, null, 2, null] },
  'D7':    { name: 'D7',    frets: [2, 2, 0, 2, 0], fingers: [1, 2, null, 3, null] },
  'G7':    { name: 'G7',    frets: [0, 0, 0, 0, 1], fingers: [null, null, null, null, 1] },
  'C7':    { name: 'C7',    frets: [0, 0, 0, 2, 1], fingers: [null, null, null, 2, 1] },
}

const CHORDS_MANDOLIN = doubleCourses({
  'C':     { name: 'C',     frets: [2, 0, 1, 0], fingers: [2, null, 1, null] },
  'Cm':    { name: 'Cm',    frets: [2, 0, 1, 1], fingers: [2, null, 1, 1] },
  'D':     { name: 'D',     frets: [0, 0, 2, 2], fingers: [null, null, 1, 2] },
  'Dm':    { name: 'Dm',    frets: [0, 0, 2, 1], fingers: [null, null, 2, 1] },
  'E':     { name: 'E',     frets: [2, 2, 4, 0], fingers: [1, 1, 2, null] },
  'Em':    { name: 'Em',    frets: [2, 2, 4, 0], fingers: [1, 1, 2, null] },
  'F':     { name: 'F',     frets: [3, 3, 5, 1], fingers: [1, 1, 2, 3] },
  'Fm':    { name: 'Fm',    frets: [3, 3, 5, 2], fingers: [1, 1, 3, 2] },
  'G':     { name: 'G',     frets: [0, 0, 2, 3], fingers: [null, null, 1, 2] },
  'Gm':    { name: 'Gm',    frets: [0, 0, 2, 1], fingers: [null, null, 2, 1] },
  'A':     { name: 'A',     frets: [2, 2, 4, 5], fingers: [1, 1, 2, 3] },
  'Am':    { name: 'Am',    frets: [2, 2, 4, 3], fingers: [1, 1, 3, 2] },
  'G7':    { name: 'G7',    frets: [0, 0, 2, 1], fingers: [null, null, 2, 1] },
  'D7':    { name: 'D7',    frets: [0, 0, 2, 0], fingers: [null, null, 1, null] },
  'A7':    { name: 'A7',    frets: [2, 2, 4, 3], fingers: [1, 1, 3, 2] },
  'E7':    { name: 'E7',    frets: [2, 2, 4, 2], fingers: [1, 1, 2, null] },
})

type TuningChordLib = Record<string, ChordLib>

export const CHORDS_BY_INSTRUMENT: Partial<Record<InstrumentName, TuningChordLib>> = {
  guitar:       { standard: CHORDS_6 },
  guitar7:      { standard: CHORD_7 },
  guitar12:     { standard: CHORD_12 },
  mandolin:     { standard: CHORDS_MANDOLIN },
  banjo5:       { standard: CHORDS_BANJO },
  bass:         { standard: CHORDS_BASS },
  bass5:        { standard: CHORDS_BASS5 },
  ukulele:      { standard: CHORDS_UKULELE },
  ukuleleLowG:  { standard: CHORDS_UKULELE },
  ukuleleBaritone: { standard: CHORDS_UKULELE },
  balalaikaPrima:    { standard: CHORDS_BALALAIKA },
  balalaikaSecunda:  { standard: CHORDS_BALALAIKA },
  balalaikaAlto:     { standard: CHORDS_BALALAIKA },
  balalaikaBass:     { standard: CHORDS_BALALAIKA },
  domra3Piccolo:         { standard: CHORDS_DOMRA3 },
  domra3Prima:           { standard: CHORDS_DOMRA3 },
  domra3MezzoSoprano:    { standard: CHORDS_DOMRA3 },
  domra3Alto:            { standard: CHORDS_DOMRA3 },
  domra3Tenor:           { standard: CHORDS_DOMRA3 },
  domra3Bass:            { standard: CHORDS_DOMRA3 },
  domra3ContrabassMinor: { standard: CHORDS_DOMRA3 },
  domra3ContrabassMajor: { standard: CHORDS_DOMRA3 },
  domra4Piccolo: { standard: CHORDS_DOMRA4 },
  domra4Prima:   { standard: CHORDS_DOMRA4 },
  domra4Alto:    { standard: CHORDS_DOMRA4 },
  domra4Tenor:   { standard: CHORDS_DOMRA4 },
  domra4Bass:    { standard: CHORDS_DOMRA4 },
  domra4Contrabass: { standard: CHORDS_DOMRA4 },
  violPardessus5: { standard: CHORDS_6 },
  violPardessus6: { standard: CHORDS_6 },
  violTreble:     { standard: CHORDS_6 },
  violAlto:       { standard: CHORDS_6 },
  violTenorA:     { standard: CHORDS_6 },
  violTenorG:     { standard: CHORDS_6 },
  violBass6:      { standard: CHORDS_6 },
  violBass7:      { standard: CHORD_7 },
  violVioloneA:   { standard: CHORDS_6 },
  violVioloneG:   { standard: CHORDS_6 },
  violVioloneD:   { standard: CHORDS_6 },
}
