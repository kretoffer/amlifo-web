import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import App from './App.tsx'
import './i18n/i18n.ts'

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState | null } = {}
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  )
  return { html, helmetContext }
}
