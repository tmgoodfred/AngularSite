const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: '192.168.1.245', // or '127.0.0.1'
  user: 'root',
  password: 'rockgod111', // Replace with your actual password
  database: 'WebsiteDB'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MariaDB database.');
});

// Register a new user
app.post('/api/register', (req, res) => {
  const { UserName, UserPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(UserPassword, 8);
  const CreateDate = new Date();

  db.query('INSERT INTO UserTable (UserName, UserPassword, CreateDate) VALUES (?, ?, ?)', [UserName, hashedPassword, CreateDate], (err, results) => {
    if (err) {
      res.status(500).send('Error registering user');
      return;
    }
    res.status(200).send('User registered successfully');
  });
});

// Login a user
app.post('/api/login', (req, res) => {
  const { UserName, UserPassword } = req.body;

  db.query('SELECT * FROM UserTable WHERE UserName = ?', [UserName], (err, results) => {
    if (err) {
      res.status(500).send('Error logging in');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(UserPassword, user.UserPassword);

    if (!passwordIsValid) {
      res.status(401).send('Invalid password');
      return;
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 }); // 24 hours
    res.status(200).send({ auth: true, token });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
