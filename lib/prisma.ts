// Normalize common Vercel/Neon environment variable names to DATABASE_URL so
// Prisma will pick up the connection string even if Vercel created prefixed
// variables when you connected the database from the dashboard.
const candidates = [
  'DATABASE_URL',
  'db_DATABASE_URL',
  'db_PRISMA_DATABASE_URL',
  'database_DATABASE_URL',
  'database_POSTGRES_URL',
  'database_PGHOST',
  'database_POSTGRES_URL_NO_SSL',
  'database_POSTGRES_URL_NON_POOLING',
  'database_DATABASE_URL_UNPOOLED',
]

for (const name of candidates) {
  if (!process.env.DATABASE_URL && process.env[name]) {
    process.env.DATABASE_URL = process.env[name]
    break
  }
}

import pkg from '@prisma/client'

const PrismaClient = (pkg as any).PrismaClient as new () => any

declare global {
  // eslint-disable-next-line no-var
  var prisma: InstanceType<typeof PrismaClient> | undefined
}

const prisma = global.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
