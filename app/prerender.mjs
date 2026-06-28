import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, 'dist')

async function prerender() {
  const { render } = await import(path.resolve(__dirname, 'dist-ssr/entry-server.js'))

  const template = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8')

  // Remove the fallback title from template (helmet provides it)
  const cleanTemplate = template.replace('<title>Amlifo</title>', '')

  const routes = ['/', '/metronome', '/tuner', '/train']

  for (const route of routes) {
    const { html } = render(route)

    // Extract helmet tags from rendered body
    const helmetHtml = html.match(/<title[^>]*>.*?<\/title>|<meta[^>]*>|<link[^>]*>/g) || []

    const helmetTitle = helmetHtml.find(t => t.startsWith('<title')) || ''
    const helmetMeta = helmetHtml
      .filter(t => t.startsWith('<meta'))
      .filter(t => !t.includes('charset') && !t.includes('viewport'))
      .join('')
    const helmetLink = helmetHtml
      .filter(t => t.startsWith('<link') && t.includes('canonical'))
      .join('')

    // Remove helmet-generated tags from body HTML (they're injected into head)
    let cleanHtml = html
      .replace(/<title[^>]*>.*?<\/title>/g, '')
      .replace(/<meta[^>]*>/g, '')
      .replace(/<link[^>]*>/g, '')

    let fullHtml = cleanTemplate
      .replace('</head>', `${helmetTitle}${helmetMeta}${helmetLink}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${cleanHtml}</div>`)

    const outDir = route === '/'
      ? distDir
      : path.join(distDir, route.slice(1))

    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), fullHtml)

    console.log(`Prerendered: ${route}`)
  }
}

prerender().catch(console.error)
