// Function to log in an existing user
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { User } from '../models/types';

// Function to sign up a new user
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(
      'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    // Retrieve the newly created user
    const user: User = result.rows[0];

    // Respond with success message and user details (without the password)
    res.status(201).json({ message: 'User created', user: { ...user, password: undefined } });
  } catch (error: any) {
    // Handle potential errors gracefully
    console.error('Error creating user:', error.message);
   res.status(500).json({ error: 'Error creating user' });
  }
};

// Function to log in an existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    // Query the database for the user
    const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);

    // Check if the user exists
    if (result.rows.length === 0) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    // Retrieve the user details
    const user: User = result.rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate a JSON Web Token
    const token = jwt.sign(
      { user_id: user.user_id, name: user.name },'default_secret', // Provide a fallback for JWT_SECRET
      { expiresIn: '1h' }
    );

    // Respond with the token
     res.status(200).json({ token });
     return;
  } catch (error: any) {
    // Handle potential errors gracefully
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Error logging in' });
    return;
  }
};
 