// Legacy MySQL helper removed.
// The project now uses Prisma (see `lib/prisma.ts`).
// Keeping this shim prevents builds from failing if any code still imports `lib/db`.

const legacyDbShim: null = null

export default legacyDbShim
