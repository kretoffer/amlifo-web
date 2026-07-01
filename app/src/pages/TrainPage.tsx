import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChordTrainPage } from '@/pages/ChordTrainPage.tsx'
import { SpeedTrainPage } from '@/pages/SpeedTrainPage.tsx'
import { ExerciseIcon, ClockIcon } from '@/components/Icons.tsx'

export function TrainPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'classic' | 'speed'>('classic')

  return (
    <div>
      <div className="rounded-xl p-1.5 mb-6" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <div className="flex gap-1.5">
          <button
            onClick={() => setTab('classic')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === 'classic' ? 'bg-blue-500 text-white' : ''}`}
            style={{
              backgroundColor: tab === 'classic' ? undefined : 'transparent',
              color: tab === 'classic' ? undefined : 'var(--color-text)',
            }}
          >
            <span className="text-lg"><ExerciseIcon /></span>
            {t('train.byDiagram')} / {t('train.byName')}
          </button>
          <button
            onClick={() => setTab('speed')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === 'speed' ? 'bg-blue-500 text-white' : ''}`}
            style={{
              backgroundColor: tab === 'speed' ? undefined : 'transparent',
              color: tab === 'speed' ? undefined : 'var(--color-text)',
            }}
          >
            <span className="text-lg"><ClockIcon /></span>
            {t('speedTrain.title')}
          </button>
        </div>
      </div>

      {tab === 'classic' ? <ChordTrainPage /> : <SpeedTrainPage />}
    </div>
  )
}
