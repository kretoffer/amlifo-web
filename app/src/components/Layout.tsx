import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar.tsx'
import { InstrumentSelector } from './InstrumentSelector.tsx'
import { InstrumentIcon } from './Icons.tsx'
import { useAppStore } from '@/store/index.ts'
import { getInstrument } from '@kretoffer/guitar-audio-kit'

export function Layout() {
  const theme = useAppStore((s) => s.theme)
  const instrumentName = useAppStore((s) => s.instrumentName)
  const { i18n } = useTranslation()
  const [selectorOpen, setSelectorOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const def = getInstrument(instrumentName)
  const instLabel = i18n.language === 'ru' ? def.nameRu : def.name

  return (
    <div className="min-h-screen pb-16 md:pt-14 md:pb-0">
      <NavBar />

      <button
        onClick={() => setSelectorOpen(true)}
        className="fixed top-2 left-2 z-[60] flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors md:top-4 md:left-4"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
        title={instLabel}
      >
        <InstrumentIcon className="h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden sm:inline max-w-32 truncate">{instLabel}</span>
      </button>

      <main className="mx-auto max-w-3xl px-4 py-4 pt-14 md:pt-16">
        <Outlet />
      </main>

      <InstrumentSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
      />
    </div>
  )
}
