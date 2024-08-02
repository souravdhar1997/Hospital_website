const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const path = require('path')


const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'))

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
  
app.use(flash())
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', 'views')


//user routes
const frontendRoute = require('./routes/FrontendRoute')
app.use(frontendRoute)

// //admin routes
const AdminRoute = require('./routes/AdminRoute')
app.use('/admin', AdminRoute)

//blog routes
const apiRoute = require('./routes/ApiRoute')
app.use('/api', apiRoute)
 
const port = 1700
const dbcon = "mongodb+srv://mailsouravdhar:uZFXOrCetjzCvh07@cluster0.oxclckb.mongodb.net/novena"

mongoose.connect(dbcon, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, () => {
            console.log(`app is running on port -> http://localhost:${port}`);
            console.log('database is connected');
        })
    }).catch(error => {
        console.log(error);
    })
