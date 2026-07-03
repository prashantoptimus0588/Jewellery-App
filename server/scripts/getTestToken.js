require('dotenv').config();
const { signToken } = require('../src/lib/jwt');
const prisma = require('../src/lib/prisma');

(async () => {
  const email = process.argv[2]; // pass email as arg
  if (!email) return console.log('Usage: node scripts/getTestToken.js you@example.com');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return console.log('No user found with that email');

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  console.log('\nToken:\n', token);
  process.exit(0);
})();


/*
node scripts/getTestToken.js prashantsingh0588@gmail.com
*/