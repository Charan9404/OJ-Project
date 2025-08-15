import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import userModel from "../models/userModel.js"

// JWT Strategy for protecting routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies?.token]),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.id)
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        return done(error, false)
      }
    },
  ),
)

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await userModel.findOne({ googleId: profile.id })

        if (user) {
          return done(null, user)
        }

        // Check if user exists with same email
        user = await userModel.findOne({ email: profile.emails[0].value })

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id
          user.isAccountVerified = true // Google accounts are pre-verified
          await user.save()
          return done(null, user)
        }

        // Create new user
        user = new userModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: "google-oauth", // Placeholder password for Google users
          isAccountVerified: true, // Google accounts are pre-verified
          profilePicture: profile.photos[0]?.value,
        })

        await user.save()
        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

export default passport
