import { NavLink } from 'react-router-dom'
import { useAppStore } from '@/store/index.ts'
import { GuitarIcon, MetronomeIcon, NoteIcon, ExerciseIcon, SunIcon, MoonIcon, GithubIcon } from '@/components/Icons.tsx'

const NAV_ITEMS = [
  { to: '/', label: 'Главная', icon: <GuitarIcon /> },
  { to: '/metronome', label: 'Метроном', icon: <MetronomeIcon /> },
  { to: '/tuner', label: 'Тюнер', icon: <NoteIcon /> },
  { to: '/train', label: 'Тренировка', icon: <ExerciseIcon /> },
]

const SUN = <SunIcon />
const MOON = <MoonIcon />

export function NavBar() {
  const { theme, toggleTheme } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t md:top-0 md:bottom-auto md:border-t-0 md:border-b"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-2 py-1 md:px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-col items-center px-2 py-1 text-xs transition-colors md:px-3 md:text-sm ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <span className="text-lg md:text-xl">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </NavLink>
        ))}
        <a
          href="https://github.com/kretoffer/amlifo-web"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-300 md:text-sm"
        >
          <span className="text-lg md:text-xl"><GithubIcon /></span>
          <span className="hidden md:inline">GitHub</span>
        </a>
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-300 md:text-sm"
        >
          <span className="text-lg md:text-xl">{theme === 'dark' ? SUN : MOON}</span>
          <span className="hidden md:inline">{theme === 'dark' ? 'Светлая' : 'Тёмная'}</span>
        </button>
      </div>
    </nav>
  )
}
