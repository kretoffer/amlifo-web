import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { MetronomeIcon, NoteIcon, ExerciseIcon } from '@/components/Icons'

export function HomePage() {
  const { t } = useTranslation()

  const CARDS = [
    { to: '/metronome', title: t('home.metronomeTitle'), desc: t('home.metronomeDesc'), icon: <MetronomeIcon/> },
    { to: '/tuner', title: t('home.tunerTitle'), desc: t('home.tunerDesc'), icon: <NoteIcon/> },
    { to: '/train', title: t('home.trainTitle'), desc: t('home.trainDesc'), icon: <ExerciseIcon/> },
  ]

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{t('meta.homeTitle')}</title>
        <meta name="description" content={t('meta.homeDesc')} />
        <meta property="og:title" content={t('meta.homeTitle')} />
        <meta property="og:description" content={t('meta.homeDesc')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amlifo.web.app" />
        <meta property="og:image" content="https://amlifo.web.app/favicon.svg" />
      </Helmet>

      <div className="flex justify-center items-center">
        <img src='/favicon.svg' width={80} className="relative" style={{ left: -32 }} />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold md:text-4xl" style={{ color: 'var(--color-text)' }}>
            Amlifo
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {t('home.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map((card, i) => {
          const isLastOdd = i === CARDS.length - 1 && CARDS.length % 2 === 1
          return (
            <div key={card.to} className={isLastOdd ? 'md:col-span-2 flex justify-center' : ''}>
              <Link
                to={card.to}
                className={`block rounded-xl p-5 transition-transform hover:scale-[1.02] w-full ${isLastOdd ? 'md:max-w-[calc(50%-0.5rem)]' : ''}`}
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {card.desc}
                </p>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
