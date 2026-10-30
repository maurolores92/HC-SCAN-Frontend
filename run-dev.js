const { loadEnvConfig } = require('@next/env')
const { spawn } = require('child_process')

// Carga las variables desde .env / .env.local
loadEnvConfig(__dirname)

const port = process.env.PORT || '3000'

// Levanta Next.js escuchando en 0.0.0.0 con el puerto configurado
const devProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', port], {
  stdio: 'inherit',
  shell: true
})

devProcess.on('exit', code => {
  process.exit(code ?? 0)
})
