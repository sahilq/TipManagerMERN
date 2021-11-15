//required libraries
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');

//local files
const { JWT_SECRET } = require('./config/index');
const User = require('./models/users');

//JWT STARATEGY

//TODO:
//1- Validate token[*]
//2- Search user[*]
//3- return user[*]
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // finding the user by user_id saved in token
        const user = await User.findById(payload.sub);
        // check if exists
        if (!user) {
          //handle not found
          return done(null, false);
        }
        if (!user.sessionToken === payload.sessionToken) {
          //handle not found
          return done(null, false);
        }
        //return user
        done(null, user);
      } catch (e) {
        done(e, false);
      }
    }
  )
);

//LOCAL STRATEGY

//TODO:
//1- Search user[*]
//2- Call user models method to validate password[*]
//3- return user[*]

passport.use(
  //local strategy uses Username
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await User.findOne({ email });

        // If not, handle it
        if (!user) {
          return done(null, false);
        }
        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);
        // If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
