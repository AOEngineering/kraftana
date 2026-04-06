// create-project.js
import fs from 'fs/promises'
import fss from 'fs'
import path from 'path'
import readline from 'readline'

const IGNORE = new Set([
  'node_modules',
  'dist',
  '.next',
  '.turbo',
  '.vercel',
  '.git',
  '.gitignore',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  '.DS_Store',
  'npm-debug.log',
  'yarn.lock',
  'pnpm-lock.yaml',
  'package-lock.json'
])

function askFactory() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise(res => rl.question(q, a => res(a.trim())))
  const close = () => rl.close()
  return { ask, close }
}

function isIgnored(name) {
  if (name === '.env.example') return false
  return IGNORE.has(name) || name.startsWith('.cache')
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const name = entry.name
    if (isIgnored(name)) continue

    const from = path.join(src, name)
    const to = path.join(dest, name)

    try {
      if (entry.isDirectory()) {
        await copyDir(from, to)
      } else if (entry.isSymbolicLink && entry.isSymbolicLink()) {
        // Skip symlinks, they cause trouble on Windows during template copies
        continue
      } else {
        // Use fs.cp when available for better behavior, fall back to streaming copy
        if (fss.cp) {
          await fss.promises.cp(from, to, { force: true, errorOnExist: false })
        } else {
          await fs.copyFile(from, to)
        }
      }
    } catch (err) {
      // Skip busy files instead of dying
      if (['EBUSY', 'EPERM', 'EACCES'].includes(err.code)) {
        console.warn(`Skipped busy file: ${from}`)
        continue
      }
      throw err
    }
  }
}

function sanitizeName(name) {
  // Turn any junk into a safe npm package name
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')     // keep dots and underscores if you like, mostly for npm rules
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'new-project'
}

function validatePort(p) {
  const n = Number(p)
  return Number.isInteger(n) && n > 0 && n < 65536 ? String(n) : '3000'
}

async function main() {
  const { ask, close } = askFactory()
  try {
    const templateDir = process.cwd()
    const baseDir = path.resolve(templateDir, '..', 'projects')

    const rawName = await ask('Enter your new project name: ')
    const projectName = sanitizeName(rawName)
    const port = validatePort(await ask('Enter the port for next start (default 3000): ') || '3000')

    const targetDir = path.join(baseDir, projectName)

    if (fss.existsSync(targetDir)) {
      console.error(`Project folder already exists: ${targetDir}`)
      return
    }

    console.log('Copying template, please wait...')
    await copyDir(templateDir, targetDir)

    // Update package.json if present
    const pkgPath = path.join(targetDir, 'package.json')
    if (fss.existsSync(pkgPath)) {
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))
      pkg.name = projectName
      pkg.scripts = pkg.scripts || {}
      pkg.scripts.start = `next start -p ${port}`
      pkg.scripts.dev = pkg.scripts.dev || 'next dev'
      await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2))
    }

    // Remove lock files and node_modules that might have slipped through
    for (const lock of ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']) {
      const p = path.join(targetDir, lock)
      if (fss.existsSync(p)) await fs.rm(p, { force: true })
    }
    const nm = path.join(targetDir, 'node_modules')
    if (fss.existsSync(nm)) await fs.rm(nm, { recursive: true, force: true })

    // Optional, write a simple .env.local with the port
    const envPath = path.join(targetDir, '.env.local')
    if (!fss.existsSync(envPath)) {
      await fs.writeFile(envPath, `PORT=${port}\n`)
    }

    console.log(`Project created at ${targetDir}`)
    console.log(`Next step:`)
    console.log(`cd ${targetDir} && npm install && npm run dev`)
  } finally {
    close()
  }
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
