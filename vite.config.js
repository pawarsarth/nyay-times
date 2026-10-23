import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

const site = JSON.parse(fs.readFileSync('./src/site.json', 'utf8'))
// "https://user.github.io/repo" -> "/repo/"   |   custom domain -> "/"
const base = new URL(site.url).pathname.replace(/\/?$/, '/')

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? base : '/',
}))
