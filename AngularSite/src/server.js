const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Database configuration
const dbConfig = {
  host: '127.0.0.1', // or '127.0.0.1'
  user: 'root',
  password: 'rockgod111', // Replace with your actual password
  database: 'WebsiteDB'
};

// Function to create a new database connection
function createDbConnection() {
  return mysql.createConnection(dbConfig);
}

// Register a new user
app.post('/api/register', (req, res) => {
  const { UserName, UserPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(UserPassword, 8);
  const CreateDate = new Date();

  const db = createDbConnection();
  db.query('INSERT INTO UserTable (UserName, UserPassword, CreateDate) VALUES (?, ?, ?)', [UserName, hashedPassword, CreateDate], (err, results) => {
    db.end();
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

  const db = createDbConnection();
  db.query('SELECT * FROM UserTable WHERE UserName = ?', [UserName], (err, results) => {
    if (err) {
      db.end();
      res.status(500).send('Error logging in');
      return;
    }
    if (results.length === 0) {
      db.end();
      res.status(404).send('User not found');
      return;
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(UserPassword, user.UserPassword);

    if (!passwordIsValid) {
      db.end();
      res.status(401).send('Invalid password');
      return;
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 }); // 24 hours
    db.end();
    res.status(200).send({ auth: true, token });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


