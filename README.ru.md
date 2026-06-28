<p align="center">
  <h1>Amlifo</h1>
  <a href="https://github.com/kretoffer/Amlifo-web/actions"><img src="https://img.shields.io/github/actions/workflow/status/kretoffer/Amlifo-web/ci.yml?style=for-the-badge&logo=github&label=tests&color=8A2BE2" alt="Tests"></a>
  <a href="https://github.com/kretoffer/Amlifo-web/stargazers"><img src="https://img.shields.io/github/stars/kretoffer/Amlifo-web?style=for-the-badge&logo=githubsponsors&logoColor=FFFFFF&label=stars&color=FFD700" alt="Stars"></a>
  <a href="https://github.com/kretoffer/Amlifo-web/issues"><img src="https://img.shields.io/github/issues/kretoffer/Amlifo-web?style=for-the-badge&logo=openbugbounty&logoColor=FFFFFF&label=issues&color=FF6B6B" alt="Issues"></a>
  <a href="https://github.com/kretoffer/Amlifo-web/contributors"><img src="https://img.shields.io/github/contributors/kretoffer/Amlifo-web?style=for-the-badge&logo=applepodcasts&logoColor=FFFFFF&label=contributors&color=FF6B6B" alt="Contributors"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/kretoffer/Amlifo-web?style=for-the-badge&logo=libreoffice" alt="LICENSE"></a>
</p>

Веб-приложение для практики игры на гитаре, построенное на React. Включает метроном, тюнер, мини-игру с аккордами и просмотр уроков с табами Guitar Pro.

## Возможности

- **🎵 Метроном** — Визуальный и звуковой метроном с регулировкой BPM (30-300), выбором размера, tap tempo и индикатором долей
- **🎶 Тюнер** — Тюнер в реальном времени через микрофон (Web Audio API), выбор струны, отображение центов
- **🎯 Упражнение** — Два режима:
  - Режим 1: на грифе показывается диаграмма аккорда — сыграй его правильно
  - Режим 2: показывается только название аккорда — узнай и сыграй
  - Пострунная обратная связь в реальном времени с цветовой индикацией

## Архитектура

Использует @kretoffer/quitar-audio-kit [GitHub](https://github.com/kretoffer/guitar-audio-kit) [Npm](https://www.npmjs.com/package/@kretoffer/guitar-audio-kit)

## Технологии

- **Фронтенд:** Vite + React 19 + TypeScript + Tailwind CSS
- **Состояние:** Zustand
- **Табы:** AlphaTab (Guitar Pro 3-7)
- **Аудио:** Web Audio API (метроном, тюнер, детекция аккордов)
- **Линтинг:** oxlint
