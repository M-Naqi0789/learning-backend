// auth is just:
// prove who the user is (auth)
// decide what they’re allowed to do (authZ)


// PHASE 1: RAW MECHANICS

// bcrypt passwords
// never store real passwords
// hash them with bcrypt
// DB should only see scrambled garbage

// JWT
// a token that says who the user is
// header = type
// payload = user data
// signature = proof it wasn’t tampered

// cookies
// tokens go here
// HttpOnly = JS can’t steal it
// Secure = only sent over HTTPS

// env vars
// AUTH_SECRET, DB_URL, GOOGLE_SECRET
// never hardcode this stuff
// put it in .env or you get hacked on day one


// PHASE 2: NEXTAUTH

// auth.ts / [...nextauth].ts
// this is where all auth rules live

// providers
// credentials = email + password
// google = sign in with google

// credentials provider
// you write:
// find user in DB
// compare bcrypt password
// return user if correct

// oauth providers
// google handles login
// you just get user info

// adapters
// connects nextauth to your DB
// prisma, drizzle, etc
// this is how users get saved


// PHASE 3: PROTECTING PAGES

// middleware
// runs before page loads
// if no session -> redirect to /login

// useSession()
// client side
// show username
// show logout button

// auth()
// server side
// block API calls
// block server components from fetching data


// PHASE 4: AUTHORIZATION

// user roles
// user
// admin
// moderator

// stored in DB
// added to session

// checks
// if (session.user.role !== "admin")
// deny access


// WHAT ACTUALLY MATTERS

// hashing keeps passwords safe
// cookies keep tokens safe
// middleware blocks pages
// roles block features

