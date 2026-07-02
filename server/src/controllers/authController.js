const prisma = require('../lib/prisma');
const { signToken } = require('../lib/jwt');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/send-otp  { identifier: email or phone }
const sendOtp = async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: 'identifier is required' });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await prisma.otpCode.create({
    data: { identifier, code, expiresAt },
  });

  // TODO: integrate real SMS/email provider. For now, log it (dev only).
  console.log(`OTP for ${identifier}: ${code}`);

  res.json({ message: 'OTP sent' });
};

// POST /api/auth/verify-otp  { identifier, code, name? }
const verifyOtp = async (req, res) => {
  const { identifier, code, name } = req.body;
  if (!identifier || !code) {
    return res.status(400).json({ error: 'identifier and code are required' });
  }

  const otp = await prisma.otpCode.findFirst({
    where: { identifier, code, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return res.status(400).json({ error: 'Invalid or expired OTP' });

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

  const isEmail = identifier.includes('@');
  let user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { phone: identifier },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || 'New User',
        email: isEmail ? identifier : `${identifier}@placeholder.local`,
        phone: isEmail ? null : identifier,
        provider: 'OTP',
      },
    });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user });
};

// POST /api/auth/google  { idToken }
const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken is required' });

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        provider: 'GOOGLE',
        googleId: payload.sub,
      },
    });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      provider: true,
      createdAt: true,
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
};

module.exports = { sendOtp, verifyOtp, googleAuth, getMe };