<p align="center">
  <h1>Amlifo</h1>
  <a href="https://github.com/kretoffer/Amlifo-web/actions"><img src="https://img.shields.io/github/actions/workflow/status/kretoffer/Amlifo-web/ci.yml?style=for-the-badge&logo=github&label=tests&color=8A2BE2" alt="Tests"></a>
  <a href="https://github.com/kretoffer/Amlifo-web/stargazers"><img src="https://img.shields.io/github/stars/kretoffer/Amlifo-web?style=for-the-badge&logo=githubsponsors&logoColor=FFFFFF&label=stars&color=FFD700" alt="Stars"></a>
  <a href="https://github.com/kretoffer/Amlifo-web/issues"><img src="https://img.shields.io/github/issues/kretoffer/Amlifo-web?style=for-the-badge&logo=openbugbounty&logoColor=FFFFFF&label=issues&color=FF6B6B" alt="Issues"></a>
  <a href="https://github.com/kretoffer/Amlifo-web/contributors"><img src="https://img.shields.io/github/contributors/kretoffer/Amlifo-web?style=for-the-badge&logo=applepodcasts&logoColor=FFFFFF&label=contributors&color=FF6B6B" alt="Contributors"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/kretoffer/Amlifo-web?style=for-the-badge&logo=libreoffice" alt="LICENSE"></a>
</p>

A web application for guitar practice built with React, featuring a metronome, tuner, chord mini-game, and lesson viewer with Guitar Pro tab support.

## Features

- **🎵 Metronome** — Visual and audio metronome with adjustable BPM (30-300), time signature, tap tempo, and beat indicator
- **🎶 Tuner** — Real-time guitar tuner using Web Audio API microphone input with per-string selection and cent-accurate display
- **🎯 Chord Game** — Two modes:
  - Mode 1: Shows a chord diagram on the fretboard — play it correctly
  - Mode 2: Shows only the chord name — recognize and play it
  - Real-time string-by-string feedback with color-coded visualization

## Architecture

Use @kretoffer/quitar-audio-kit [GitHub](https://github.com/kretoffer/guitar-audio-kit) [Npm](https://www.npmjs.com/package/@kretoffer/guitar-audio-kit)

## Tech Stack

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS
- **State:** Zustand
- **Tab rendering:** AlphaTab (Guitar Pro 3-7)
- **Audio:** Web Audio API (metronome, tuner, chord detection)
- **Linting:** oxlint
