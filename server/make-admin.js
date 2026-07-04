// server/make-admin.js (run once then delete)
require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function main() {
  const user = await prisma.user.update({
    where: { email: 'prashantsingh0588@gmail.com' }, // your login email
    data: { role: 'ADMIN' },
  });
  console.log('Admin set:', user.email, user.role);
}

main().catch(console.error).finally(() => prisma.$disconnect());