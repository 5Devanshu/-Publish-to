const sqlite3 = require('sqlite3').verbose();

// Create a new database or connect to an existing one
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

// Serialize method to run queries in a sequential manner
db.serialize(() => {
  // Create the users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error("Table creation failed:", err.message);
    } else {
      console.log("Users table created successfully.");
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed the database connection.');
});
