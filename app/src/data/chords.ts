export interface ChordShape {
  name: string
  frets: number[]
  fingers: (number | null)[]
}

export const CHORD_LIBRARY: Record<string, ChordShape> = {
  // — A family —
  'A':     { name: 'A',     frets: [-1, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },
  'Am':    { name: 'Am',    frets: [-1, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
  'A7':    { name: 'A7',    frets: [-1, 0, 2, 0, 2, 0], fingers: [null, null, 1, null, 2, null] },
  'Am7':   { name: 'Am7',   frets: [-1, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null] },
  'Amaj7': { name: 'Amaj7', frets: [-1, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null] },
  'Asus2': { name: 'Asus2', frets: [-1, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null] },
  'Asus4': { name: 'Asus4', frets: [-1, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 4, null] },

  // — B family —
  'B':     { name: 'B',     frets: [-1, 2, 4, 4, 4, 2], fingers: [null, 1, 3, 3, 3, 1] },
  'Bm':    { name: 'Bm',    frets: [-1, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 3, 2, 1] },
  'B7':    { name: 'B7',    frets: [-1, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4] },
  'Bdim':  { name: 'Bdim',  frets: [-1, 2, 3, 4, 3, -1], fingers: [null, 1, 2, 4, 3, null] },

  // — C family —
  'C':     { name: 'C',     frets: [-1, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
  'C7':    { name: 'C7',    frets: [-1, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null] },
  'Cmaj7': { name: 'Cmaj7', frets: [-1, 3, 2, 0, 0, 0], fingers: [null, 2, 1, null, null, null] },

  // — D family —
  'D':     { name: 'D',     frets: [-1, -1, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
  'Dm':    { name: 'Dm',    frets: [-1, -1, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
  'D7':    { name: 'D7',    frets: [-1, -1, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] },
  'Dm7':   { name: 'Dm7',   frets: [-1, -1, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1] },
  'Dmaj7': { name: 'Dmaj7', frets: [-1, -1, 0, 2, 2, 2], fingers: [null, null, null, 1, 2, 3] },
  'Dsus2': { name: 'Dsus2', frets: [-1, -1, 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null] },
  'Dsus4': { name: 'Dsus4', frets: [-1, -1, 0, 2, 3, 3], fingers: [null, null, null, 1, 2, 3] },

  // — E family —
  'E':     { name: 'E',     frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
  'Em':    { name: 'Em',    frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
  'E7':    { name: 'E7',    frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] },
  'Em7':   { name: 'Em7',   frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] },
  'Emaj7': { name: 'Emaj7', frets: [0, 2, 1, 1, 0, 0], fingers: [null, 3, 1, 2, null, null] },
  'Esus4': { name: 'Esus4', frets: [0, 2, 2, 2, 0, 0], fingers: [null, 1, 2, 3, null, null] },
  'Eaug':  { name: 'Eaug',  frets: [-1, 3, 2, 1, 1, 0], fingers: [null, 3, 2, 1, 1, null] },

  // — F family —
  'F':     { name: 'F',     frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  'Fm':    { name: 'Fm',    frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
  'F#m':   { name: 'F#m',   frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
  'Fmaj7': { name: 'Fmaj7', frets: [-1, -1, 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null] },

  // — G family —
  'G':     { name: 'G',     frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3] },
  'Gm':    { name: 'Gm',    frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1] },
  'G7':    { name: 'G7',    frets: [3, 2, 0, 0, 0, 1], fingers: [2, 1, null, null, null, 3] },
  'Gsus4': { name: 'Gsus4', frets: [3, 3, 0, 0, 1, 3], fingers: [2, 1, null, null, 3, 4] },
}

export const CHORD_KEYS = Object.keys(CHORD_LIBRARY)
