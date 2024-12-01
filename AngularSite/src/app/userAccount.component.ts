const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configure CORS to allow requests from your public IP and localhost
app.use(cors({
  origin: ['http://99.108.171.159:81', 'http://localhost:4200'], // Replace 'http://99.108.171.159:81' with your actual public IP
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Create a connection to the database
const db = mysql.createConnection({
  host: '127.0.0.1', // Use '127.0.0.1' to explicitly specify the IPv4 loopback address
  user: 'root',
  password: 'rockgod111', // Replace with your actual password
  database: 'WebsiteDB'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MariaDB database.');
});

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Register a new user
app.post('/api/register', (req, res) => {
  console.log('Register endpoint hit');
  const { UserName, UserPass } = req.body;
  console.log('Request body:', req.body);
  console.log('UserName:', UserName);
  console.log('UserPass:', UserPass);

  if (!UserPass) {
    console.error('UserPass is undefined');
    res.status(400).json({ error: 'UserPass is required' });
    return;
  }

  // Check if the username already exists
  db.query('SELECT * FROM UserTable WHERE UserName = ?', [UserName], (err, results) => {
    if (err) {
      console.error('Error checking username:', err.message);
      res.status(500).json({ error: 'Error checking username' });
      return;
    }
    if (results.length > 0) {
      console.log('Username already exists');
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash the password and insert the new user
    const hashedPassword = bcrypt.hashSync(UserPass, 8);
    const CreateDate = new Date();

    db.query('INSERT INTO UserTable (UserName, UserPass, CreateDate) VALUES (?, ?, ?)', [UserName, hashedPassword, CreateDate], (err, results) => {
      if (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ error: 'Error registering user' });
        return;
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

// Login a user
app.post('/api/login', (req, res) => {
  console.log('Login endpoint hit');
  const { UserName, UserPass } = req.body;
  console.log('UserName:', UserName);
  console.log('UserPass:', UserPass);

  db.query('SELECT * FROM UserTable WHERE UserName = ?', [UserName], (err, results) => {
    if (err) {
      console.error('Error logging in:', err.message);
      res.status(500).json({ error: 'Error logging in' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = results[0];
    console.log('User from DB:', user);

    if (!user.UserPass) {
      console.error('UserPass from DB is undefined');
      res.status(500).json({ error: 'Server error' });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(UserPass, user.UserPass);
    console.log('Password is valid:', passwordIsValid);

    if (!passwordIsValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 }); // 24 hours
    res.status(200).json({ auth: true, token });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

