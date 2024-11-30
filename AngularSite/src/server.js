const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rockgod111',
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
  const { UserName, UserPass } = req.body;

  if (!UserPass) {
    res.status(400).json({ error: 'UserPass is required' });
    return;
  }

  db.query('SELECT * FROM UserTable WHERE UserName = ?', [UserName], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error checking username' });
      return;
    }
    if (results.length > 0) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(UserPass, 8);
    const CreateDate = new Date();

    db.query('INSERT INTO UserTable (UserName, UserPass, CreateDate) VALUES (?, ?, ?)', [UserName, hashedPassword, CreateDate], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error registering user' });
        return;
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

// Login a user
app.post('/api/login', (req, res) => {
  const { UserName, UserPass } = req.body;

  db.query('SELECT * FROM UserTable WHERE UserName = ?', [UserName], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error logging in' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = results[0];

    const passwordIsValid = bcrypt.compareSync(UserPass, user.UserPass);

    if (!passwordIsValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    const token = jwt.sign({ id: user.id, userName: user.UserName }, 'secret', { expiresIn: 86400 }); // 24 hours
    res.status(200).json({ auth: true, token });
  });
});

// Verify token
app.post('/api/verifyToken', (req, res) => {
  const { token } = req.body;

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    res.status(200).json({ userName: decoded.userName });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
