const express = require("express");
const passport = require("passport");
const bodyParser = require('body-parser')
const cors = require("cors");
var mongoose = require("mongoose");
var multer = require("multer");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./config/config.env" });
const applyRoutes = require('./routes');
const MongoClient = require('mongodb').MongoClient;
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts');
const app = express();

app.use(cors());
applyRoutes(app);

// create application/json parser
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// Importing routes for posts

app.use('/posts', postsRouter);

// Importing routes for course - content stream
const contentRouter = require('./routes/content')
app.use('/content', contentRouter);

var uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('connected', () => {
  console.log('connected to mongodb, status ' + mongoose.connection.readyState);
});

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

const commentsRouter = require('./routes/comments');
app.use('/', commentsRouter);
// get driver connection
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");

app.get('/', (req, res)=> res.send('Hello World!'));
app.use('/users', usersRouter);

// Importing routes for posts
const companyRouter = require('./routes/company');  
app.use('/company-profile', companyRouter);

//SEAL-3
require("dotenv").config({ path: "./config.env" });
const dbo = require("./db/conn"); 
const companyRoutes = require("./routes/company");

// SEAL-12: Setting storage for file uploads

var deliverableRouter = require('./routes/deliverables');
app.use('/deliverables', deliverableRouter);

var deliverableRoutes = require('./routes/deliverables');


//

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server is running on port: ${port}`);
});
