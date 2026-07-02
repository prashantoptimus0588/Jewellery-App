// server/src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('../lib/prisma');
const { signToken } = require('../lib/jwt');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              avatar,
              provider: 'GOOGLE',
              googleId: profile.id,
            },
          });
        } else if (!user.googleId) {
          user = await prisma.user.update({
            where: { email },
            data: { googleId: profile.id, avatar, provider: 'GOOGLE' },
          });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;