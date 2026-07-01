
const { PrismaClient } = require('../generated/prisma');

// 2. We can go back to the simple setup for v6
const prisma = new PrismaClient();

module.exports = prisma;