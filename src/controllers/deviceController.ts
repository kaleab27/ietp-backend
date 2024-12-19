import { RequestWithUser } from '../types/RequestWithUser';
import { Response } from 'express';
import pool from '../config/db';
import { Device } from '../models/types';
import { type } from 'os';

export const registerDevice = async (req: RequestWithUser, res: Response): Promise<void> => {
  const userId = req.user?.user_id; // Extracted from authentication middleware
  const { name, layer, unit, type, area ,critical_high, critical_low } = req.body;

  // Validate user ID
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized access' });
    return; // Explicitly end the execution here for safety
  }

  // Validate required fields
  console.log(name , layer ,unit ,type)
  if ( !name || !unit || !type) {
    res.status(400).json({ error: 'Missing required fields' });
    return; // Explicitly end the execution here for safety
  }

  try {
    // Insert the new device into the database
    const result = await pool.query(
      'INSERT INTO "device" (name, layer, unit, type, critical_high, critical_low, user_id, status , area) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9) RETURNING *',
      [
        name,
        layer,
        unit,
        type,
        critical_high || null,
        critical_low || null,
        userId,
        type === 'motor' ? 'inactive' : 'active', // Default status based on device type
        area,
      ]
    );

    const newDevice: Device = result.rows[0]; // Extract the newly inserted device
    res.status(201).json({ message: 'Device registered', device: newDevice });
  } catch (error: any) {
    console.error('Error registering device:', error.message);

    if (res.headersSent) {
      // Log the issue but avoid sending another response if headers were already sent
      console.error('Headers already sent. Cannot send a response.');
    } else {
      // Handle duplicate device ID error (PostgreSQL specific error code)
      if (error.code === '23505') {
        res.status(409).json({ error: 'Device ID already exists' });
      } else {
        res.status(500).json({ error: 'Error registering device' });
      }
    }
  }
};

// export const deleteDevice = async (req:RequestWithUser , res: Response):Promise<void>=>{
//   const userId = req.user?.user_id; // Extracted from authentication middleware
//   const { device_id} = req.body;

// }
