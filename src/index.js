const express = require('express');

const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { accountsCollection, connectToDatabase } = require('./config');
require('./auth');
const app = express();




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use passport session


// Use express-session middleware
app.use(session({
  secret: secretKey, // Replace with your own secret key
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Login with Google</a>')
});

// app.get('/google-login', (req, res) => {
//     res.render('google-login');
// })

app.get('/auth/google', 
  passport.authenticate('google' , {scope : ['email', 'profile']})
)
app.get('/login', (req, res) => {
  res.render('login');
})
app.get('/signup', (req, res) => {
    res.render('signup');
})

app.get('/homepage', (req, res) => {
  res.render('homepage');
})

// app.post('/google-login', (req, res) => {
//   passport.authenticate('google' , {scope : ['email', 'profile']})
// })

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Create a new user document
      const newUser = {
        name: username,
        password: password,
      };
  
      // Save the user to the database
      const result = await accountsCollection.insertOne(newUser);
  
      console.log("User registered successfully:", result);
      res.send("Signup successful!"); // Or redirect to another page
    } catch (err) {
      console.error("Error during signup:", err);
      if (err.code === 11000) {
        // Duplicate key error
        res.status(400).send("Username already exists. Please choose another.");
      } else {
        res.status(500).send("An error occurred during signup. Please try again.");
      }
    }
  });

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find user in the database
      const user = await accountsCollection.findOne({ name: username });
  
      if (!user) {
        // User not found
        return res.status(404).send("User not found. Please sign up first.");
      }
  
      // Check if password matches
      if (user.password !== password) {
        console.log(username.password);
        console.log(password);
        return res.status(401).send("Invalid password. Please try again.");
      }
  
      // Successful login
      console.log("Login successful!"); // Or redirect to a dashboard or another page
      res.redirect('/homepage')
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).send("An error occurred during login. Please try again.");
    }
  });

// app.get('/users', async (req, res) => {
//     try {
//         const users = await collection.find({}).toArray();
//         if (users && users.length >= 0) {
//             console.log(users[0].name);
//             res.send(users);
//         } else {
//             console.error("No users found");
//             res.status(404).send("No users found");
//         }
//     } catch (err) {
//         console.error("Error fetching users:", err);
//         res.status(500).send("An error occurred while fetching users. Please try again.");
//     }
// });
  
  // Start the server
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
const port = 5001;
app.listen(port,() => {
    console.log(`Server running on port ${port}`);
})