if(process.env.NODE_ENV != 'production') require('dotenv').config()

// Express
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// MongoDB
const mongoose = require('mongoose');
const dbURL = process.env.ATLASDB_URL;
main()
.then(res => console.log("DB is Connected."))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
}

//ejs
let ejs = require('ejs');
const path = require('path');
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));

//ejs-mate
let ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//Method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Express-session
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Connect-flash
const flash = require('connect-flash');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./util/ExpressError.js');
const Users = require('./models/user.js');

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600
});

store.on("error",() => {
    console.log("Error in mongo session store. \n\n",err);
});

const sesionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}




app.use(session(sesionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}/`);
});

app.get("/",(req,res)=>{
   res.redirect("/listings");
});

//Listing route
const listingRoutes = require("./routes/listing.js");
app.use("/listings",listingRoutes);

//Review Routes
const reviewRoutes = require("./routes/review.js");
app.use("/listings/:id/reviews",reviewRoutes);

//User Routes
const userRoutes = require("./routes/user.js");
app.use("/", userRoutes);

// app.get("/demo", async (req,res) => {
//     let newUser = new Users({
//         email : "demo1@gmail.com",
//         username : "demo1"
//     });

//     let registeredUser = await Users.register(newUser, "demo1");

//     res.send(registeredUser);
// });


// Error Handaling middilewares
app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page not found."));
});

app.use((err,req,res,next) => {
    let{statusCode = 500, message = "Something Went Wrong."} = err;
    res.status(statusCode).render("Errors/error",{message});
});