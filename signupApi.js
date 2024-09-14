const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Create an Express app
const app = express();
const port = 2000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signupDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// User model
const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Return success response with token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Home route
app.get('/home', (req, res) => {
  const data = [
    { id: '45', name: 'Rahul Gupta', enrollment: 'AJU/220941', course: 'BBA', intermediate: 'Commerce' },
    { id: '46', name: 'Sonia Mehta', enrollment: 'AJU/220951', course: 'B.Ed', intermediate: 'ARTs' },
    { id: '47', name: 'Karan Singh', enrollment: 'AJU/220961', course: 'B.Tech', intermediate: 'Science' },
    { id: '48', name: 'Sakshi Verma', enrollment: 'AJU/220971', course: 'BCA', intermediate: 'Computer Science' },
    { id: '49', name: 'Mohit Raj', enrollment: 'AJU/220981', course: 'B.Com', intermediate: 'Commerce' },
    { id: '50', name: 'Reena Chauhan', enrollment: 'AJU/220991', course: 'BA', intermediate: 'ARTs' },
    // Add more entries as needed
  ];

  res.status(200).json(data);
});


// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      // Return success response with token
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
