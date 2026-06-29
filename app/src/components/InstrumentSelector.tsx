import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InstrumentName } from '@kretoffer/guitar-audio-kit'
import { getInstrument } from '@kretoffer/guitar-audio-kit'
import { useAppStore } from '@/store/index.ts'

interface InstrumentCategory {
  name: string
  nameRu: string
  icon: string
  instruments: { key: InstrumentName; label: string; labelRu?: string }[]
}

const CATEGORIES: InstrumentCategory[] = [
  {
    name: 'Guitars',
    nameRu: 'Гитары',
    icon: '🎸',
    instruments: [
      { key: 'guitar', label: '6-String Guitar', labelRu: '6-струнная гитара' },
      { key: 'guitar7', label: '7-String Guitar', labelRu: '7-струнная гитара' },
      { key: 'guitar12', label: '12-String Guitar', labelRu: '12-струнная гитара' },
    ],
  },
  {
    name: 'Basses',
    nameRu: 'Басы',
    icon: '🎸',
    instruments: [
      { key: 'bass', label: '4-String Bass', labelRu: '4-струнный бас' },
      { key: 'bass5', label: '5-String Bass', labelRu: '5-струнный бас' },
    ],
  },
  {
    name: 'Ukuleles',
    nameRu: 'Укулеле',
    icon: '🎸',
    instruments: [
      { key: 'ukulele', label: 'Ukulele (High-G)', labelRu: 'Укулеле (High-G)' },
      { key: 'ukuleleLowG', label: 'Ukulele (Low-G)', labelRu: 'Укулеле (Low-G)' },
      { key: 'ukuleleBaritone', label: 'Baritone Ukulele', labelRu: 'Баритон-укулеле' },
    ],
  },
  {
    name: 'Folk (Russian)',
    nameRu: 'Народные (Русские)',
    icon: '🪕',
    instruments: [
      { key: 'balalaikaPrima', label: 'Balalaika Prima', labelRu: 'Балалайка прима' },
      { key: 'balalaikaSecunda', label: 'Balalaika Secunda', labelRu: 'Балалайка секунда' },
      { key: 'balalaikaAlto', label: 'Balalaika Alto', labelRu: 'Балалайка альт' },
      { key: 'balalaikaBass', label: 'Balalaika Bass', labelRu: 'Балалайка бас' },
      { key: 'domra3Piccolo', label: 'Domra 3-str Piccolo', labelRu: 'Домра 3-стр пикколо' },
      { key: 'domra3Prima', label: 'Domra 3-str Prima', labelRu: 'Домра 3-стр прима' },
      { key: 'domra3MezzoSoprano', label: 'Domra 3-str Mezzo-Soprano', labelRu: 'Домра 3-стр меццо-сопрано' },
      { key: 'domra3Alto', label: 'Domra 3-str Alto', labelRu: 'Домра 3-стр альт' },
      { key: 'domra3Tenor', label: 'Domra 3-str Tenor', labelRu: 'Домра 3-стр тенор' },
      { key: 'domra3Bass', label: 'Domra 3-str Bass', labelRu: 'Домра 3-стр бас' },
      { key: 'domra3ContrabassMinor', label: 'Domra 3-str Contrabass (minor)', labelRu: 'Домра 3-стр контрабас (малая)' },
      { key: 'domra3ContrabassMajor', label: 'Domra 3-str Contrabass (major)', labelRu: 'Домра 3-стр контрабас (большая)' },
      { key: 'domra4Piccolo', label: 'Domra 4-str Piccolo', labelRu: 'Домра 4-стр пикколо' },
      { key: 'domra4Prima', label: 'Domra 4-str Prima', labelRu: 'Домра 4-стр прима' },
      { key: 'domra4Alto', label: 'Domra 4-str Alto', labelRu: 'Домра 4-стр альт' },
      { key: 'domra4Tenor', label: 'Domra 4-str Tenor', labelRu: 'Домра 4-стр тенор' },
      { key: 'domra4Bass', label: 'Domra 4-str Bass', labelRu: 'Домра 4-стр бас' },
      { key: 'domra4Contrabass', label: 'Domra 4-str Contrabass', labelRu: 'Домра 4-стр контрабас' },
    ],
  },
  {
    name: 'Viols',
    nameRu: 'Виолы',
    icon: '🎻',
    instruments: [
      { key: 'violPardessus5', label: 'Pardessus 5-str', labelRu: 'Пардессю 5-стр' },
      { key: 'violPardessus6', label: 'Pardessus 6-str', labelRu: 'Пардессю 6-стр' },
      { key: 'violTreble', label: 'Treble Viol', labelRu: 'Виола дискант' },
      { key: 'violAlto', label: 'Alto Viol', labelRu: 'Виола альтовая' },
      { key: 'violTenorA', label: 'Tenor Viol (A)', labelRu: 'Виола теноровая (A)' },
      { key: 'violTenorG', label: 'Tenor Viol (G)', labelRu: 'Виола теноровая (G)' },
      { key: 'violBass6', label: 'Bass Viol 6-str', labelRu: 'Виола басовая 6-стр' },
      { key: 'violBass7', label: 'Bass Viol 7-str', labelRu: 'Виола басовая 7-стр' },
      { key: 'violVioloneA', label: 'Violone in A', labelRu: 'Виолоне in A' },
      { key: 'violVioloneG', label: 'Violone in G', labelRu: 'Виолоне in G' },
      { key: 'violVioloneD', label: 'Violone in D', labelRu: 'Виолоне in D' },
    ],
  },
  {
    name: 'Others',
    nameRu: 'Другие',
    icon: '🎵',
    instruments: [
      { key: 'mandolin', label: 'Mandolin', labelRu: 'Мандолина' },
      { key: 'banjo5', label: '5-String Banjo', labelRu: '5-струнное банджо' },
    ],
  },
]

const TUNING_LABELS: Record<string, { en: string; ru: string }> = {
  standard: { en: 'Standard', ru: 'Стандартный' },
  dropD: { en: 'Drop D', ru: 'Drop D' },
  dropC: { en: 'Drop C', ru: 'Drop C' },
  openG: { en: 'Open G', ru: 'Open G' },
  openD: { en: 'Open D', ru: 'Open D' },
  openA: { en: 'Open A', ru: 'Open A' },
  openE: { en: 'Open E', ru: 'Open E' },
  dadgad: { en: 'DADGAD', ru: 'DADGAD' },
  halfStepDown: { en: 'Half Step Down', ru: 'Half Step Down' },
  fullStepDown: { en: 'Full Step Down', ru: 'Full Step Down' },
  dropA: { en: 'Drop A', ru: 'Drop A' },
}

function tuningLabel(key: string, lang: string): string {
  return lang === 'ru'
    ? TUNING_LABELS[key]?.ru ?? key
    : TUNING_LABELS[key]?.en ?? key
}

function notesToShort(tuning: string[]): string {
  return tuning.join(' · ')
}

interface InstrumentSelectorProps {
  open: boolean
  onClose: () => void
}

export function InstrumentSelector({ open, onClose }: InstrumentSelectorProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const instrumentName = useAppStore((s) => s.instrumentName)
  const tuningName = useAppStore((s) => s.tuningName)
  const setInstrument = useAppStore((s) => s.setInstrument)
  const [expanded, setExpanded] = useState<InstrumentName | null>(null)

  if (!open) return null

  function handleSelect(name: InstrumentName, tuning: string) {
    setInstrument(name, tuning)
    onClose()
  }

  function handleToggle(name: InstrumentName, tuningKeys: string[]) {
    if (tuningKeys.length === 1) {
      handleSelect(name, tuningKeys[0])
    } else {
      setExpanded((prev) => (prev === name ? null : name))
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="sticky top-0 z-10 grid grid-cols-3 items-center px-4 py-3"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div />
        <h2 className="text-center text-lg font-bold">{t('instrument.select')}</h2>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-1 text-sm font-semibold"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {t('instrument.done')}
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 py-4 space-y-6">
        {CATEGORIES.map((cat) => {
          const catName = lang === 'ru' ? cat.nameRu : cat.name
          const hasSelected = cat.instruments.some((i) => i.key === instrumentName)
          return (
            <details key={cat.name} open={hasSelected} className="group">
              <summary
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{catName}</span>
                <span className="ml-auto text-xs opacity-50">
                  {cat.instruments.length} {t('instrument.instruments')}
                </span>
              </summary>

              <div className="mt-2 space-y-1 pl-4">
                {cat.instruments.map((inst) => {
                  const def = getInstrument(inst.key)
                  const tuningKeys = Object.keys(def.tunings)
                  const isSelected = inst.key === instrumentName
                  const isExpanded = expanded === inst.key

                  return (
                    <div key={inst.key}>
                      <button
                        onClick={() => handleToggle(inst.key, tuningKeys)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected
                            ? 'var(--color-bg-card)'
                            : 'transparent',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {tuningKeys.length > 1 && (
                          <span
                            className={`shrink-0 text-base transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          >
                            ▶
                          </span>
                        )}
                        {tuningKeys.length === 1 && <span className="w-4 shrink-0" />}
                        <span className="font-medium">
                          {lang === 'ru' ? inst.labelRu ?? inst.label : inst.label}
                        </span>
                        <span
                          className="text-xs opacity-50"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          ({def.stringCount} {t('instrument.strings')})
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-xs text-blue-400">
                            {tuningLabel(tuningName, lang)}
                          </span>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {tuningKeys.map((tk) => (
                            <button
                              key={tk}
                              onClick={() => handleSelect(inst.key, tk)}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-colors ${
                                isSelected && tk === tuningName
                                  ? 'ring-1 ring-blue-500'
                                  : ''
                              }`}
                              style={{
                                backgroundColor:
                                  isSelected && tk === tuningName
                                    ? 'var(--color-bg-card)'
                                    : 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              <span
                                className={`shrink-0 ${
                                  isSelected && tk === tuningName
                                    ? 'text-blue-400'
                                    : ''
                                }`}
                              >
                                {isSelected && tk === tuningName ? '●' : '○'}
                              </span>
                              <span>
                                {tuningLabel(tk, lang)}
                                {tk === def.defaultTuning && (
                                  <span className="ml-1 text-xs opacity-40">
                                    ({t('instrument.default')})
                                  </span>
                                )}
                              </span>
                              <span className="ml-auto truncate opacity-40 max-w-[180px]">
                                {notesToShort(def.tunings[tk])}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
