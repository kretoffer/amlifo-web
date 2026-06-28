import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar.tsx'
import { useAppStore } from '@/store/index.ts'
import { useEffect } from 'react'

export function Layout() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen pb-16 md:pt-14 md:pb-0">
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}
