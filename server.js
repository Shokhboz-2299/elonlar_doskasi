const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Env variables 
dotenv.config()

// connecting to database 
connectDB()

// routes 
const homeRoutes = require('./routes/homeRoutes')
const postersRoutes = require('./routes/posterRoutes')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')



const app = express()

// Initialize session store 
const store = new MongoStore({
  collection:'sessions',
  uri: process.env.MONGO_URI
})

// Body parser 
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Session configuration 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false,
  store
}))

//SET static folder
app.use(express.static(path.join(__dirname, 'public')))

// Initialize template engine (Handlebars) 
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

// Initialize rotes 
app.use('/', homeRoutes );
app.use('/posters', postersRoutes );
app.use('/auth', authRoutes );
app.use('/profile', profileRoutes)



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})