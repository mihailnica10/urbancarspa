import { build } from 'esbuild'
import { glob } from 'glob'
import { copyFileSync, mkdirSync, rmSync, existsSync } from 'fs'
import { dirname, join, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const functionsDir = join(rootDir, 'functions')
const distFunctionsDir = join(rootDir, 'dist', 'functions')

// Clean dist/functions
if (existsSync(distFunctionsDir)) {
  rmSync(distFunctionsDir, { recursive: true })
}
mkdirSync(distFunctionsDir, { recursive: true })

// Get all TypeScript function files
const functionFiles = glob.sync('**/*.ts', { cwd: functionsDir })

console.log(`Bundling ${functionFiles.length} function files...`)

for (const file of functionFiles) {
  const srcPath = join(functionsDir, file)
  const dstPath = join(distFunctionsDir, file.replace(/\.ts$/, '.js'))
  const dstDir = dirname(dstPath)
  
  mkdirSync(dstDir, { recursive: true })
  
  // Bundle with esbuild
  await build({
    entryPoints: [srcPath],
    bundle: true,
    outfile: dstPath,
    format: 'esm',
    target: 'es2022',
    platform: 'browser',
    external: ['@cloudflare/workers-types'],
    loader: {
      '.ts': 'ts'
    },
    // Allow accessing Cloudflare bindings from global
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  })
  
  console.log(`  Bundled: ${file}`)
}

// Copy _middleware.ts (if not in functionFiles)
const middlewarePath = join(functionsDir, '_middleware.ts')
if (existsSync(middlewarePath)) {
  const dstMiddleware = join(distFunctionsDir, '_middleware.js')
  await build({
    entryPoints: [middlewarePath],
    bundle: true,
    outfile: dstMiddleware,
    format: 'esm',
    target: 'es2022',
    platform: 'browser',
    external: ['@cloudflare/workers-types'],
    loader: { '.ts': 'ts' }
  })
  console.log('  Bundled: _middleware.ts')
}

console.log('Functions bundled successfully!')
