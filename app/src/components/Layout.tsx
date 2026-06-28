import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar.tsx'
import { useAppStore } from '@/store/index.ts'

export function Layout() {
  const theme = useAppStore((s) => s.theme)
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="min-h-screen pb-16 md:pt-14 md:pb-0">
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}
