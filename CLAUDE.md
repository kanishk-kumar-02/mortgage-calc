# Nivaas — Project Guide for Claude Code

## 1. Project Overview

Nivaas is a single-page, frontend-only Indian home loan (mortgage) EMI calculator.

- Target market: Indian homebuyers
- Brand: **Nivaas** — "Your home. Your numbers. No surprises."

## 2. Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 — CSS-based config via `@theme` in `globals.css`. **No `tailwind.config.ts`.**
- Framer Motion 12
- Bun as package manager — never use npm or yarn

## 3. Commands

- Run dev server: `bun dev`
- Type check: `bunx tsc --noEmit`
- Install packages: `bun add <package>`

## 4. Project Structure

- `src/app/page.tsx` — entire page, all components in one file, `"use client"`
- `src/app/layout.tsx` — fonts (Plus Jakarta Sans + Inter), metadata, server component
- `src/app/globals.css` — `@theme` colors, slider styles, ambient blob animations, `.glass` class

## 5. Design System

- Colors:
  - `--color-ink`: `#15192B`
  - `--color-indigo`: `#2541B2`
  - `--color-gold`: `#D4A537`
  - `--color-emerald`: `#1E8E5A`
  - `--color-cream`: `#FBF7F0`
  - `--color-mist`: `#EEF1F8`
- Fonts: Plus Jakarta Sans (headings), Inter (body)
- Style: soft premium fintech — glassmorphism navbar, rounded cards, ambient CSS blobs

## 6. Calculator Logic

- EMI formula: `P * r * (1+r)^n / ((1+r)^n - 1)`
- Loan range: ₹1L to ₹5Cr
- Rate range: 6% to 20%
- Tenure range: 1 to 30 years
- No chart libraries — donut chart is pure SVG only

## 7. Hard Rules — Claude Code must always follow these

- Zero TypeScript errors at all times
- Never use blanket `git add .` — always list specific files
- Never add co-author tags to commits
- Never install chart libraries (recharts, chart.js, etc.)
- Never add `tailwind.config.ts` — Tailwind v4 uses `globals.css`
- Mobile-first — every change must work at 375px
- All copy must be India-specific, no lorem ipsum
- No external image URLs

## 8. Accessibility Rules (from ui-ux-pro-max audit)

- All buttons must have `cursor-pointer` and `focus-visible:ring-2`
- Minimum contrast: `text-ink/60` or higher (never `text-ink/40` for readable text)
- Touch targets minimum 44x44px on mobile
- Respect `prefers-reduced-motion` on all animations
