import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout.tsx'
import { HomePage } from '@/pages/Home.tsx'
import { MetronomePage } from '@/pages/MetronomePage.tsx'
import { TunerPage } from '@/pages/TunerPage.tsx'
import { ChordTrainPage } from '@/pages/ChordTrainPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/metronome" element={<MetronomePage />} />
        <Route path="/tuner" element={<TunerPage />} />
        <Route path="/train" element={<ChordTrainPage />} />
      </Route>
    </Routes>
  )
}
