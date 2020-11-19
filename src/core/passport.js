import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { User } from '../models';
import env from '../config/env';
import { getTokenCookie } from '../utils/auth-cookies';

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await User.findByEmail(email);

      if (!user || !await user.verifyPassword(password)) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: getTokenCookie,
    ignoreExpiration: false,
    secretOrKey: env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

export default passport;
