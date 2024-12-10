import { Request, Response } from 'express';
import pool from '../config/db';

export const createTables = async (_req: Request, res: Response): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS "user" (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "device" (
      device_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      layer INT NOT NULL CHECK (layer >= 0),
      unit VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL CHECK (status IN ('active', 'inactive')),
      type VARCHAR(255) NOT NULL CHECK (type IN ('motor', 'sensor')),
      critical_high FLOAT,
      critical_low FLOAT,
      user_id UUID REFERENCES "user"(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "data" (
      data_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      device_id UUID REFERENCES "device"(device_id) ON DELETE CASCADE,
      value FLOAT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    res.status(200).json({ message: 'Tables created successfully' });
    return;
  } catch (error: any) {
    console.error('Error creating tables:', error.message);
    res.status(500).json({
      error: 'Error creating tables',
      details: error.message,
    });
    return;
  }
};

export const seedDatabase = async (_req: Request, res: Response): Promise<void> => {
  const query = `
    INSERT INTO "user" (name, email, password)
    VALUES
      ('Alice', 'alice@example.com', 'password1'),
      ('Bob', 'bob@example.com', 'password2')
    ON CONFLICT (email) DO NOTHING;

    INSERT INTO "device" (name, layer, unit, status, type, user_id)
    VALUES
      ('Temperature Sensor', 0, '°C', 'active', 'sensor', (SELECT user_id FROM "user" WHERE name='Alice')),
      ('Soil Moisture Sensor', 1, '%', 'active', 'sensor', (SELECT user_id FROM "user" WHERE name='Alice')),
      ('Irrigation Pump', 0, 'ON/OFF', 'inactive', 'motor', (SELECT user_id FROM "user" WHERE name='Alice'))
    ON CONFLICT (device_id) DO NOTHING;
  `;

  try {
    await pool.query(query);
    res.status(200).json({ message: 'Database seeded successfully' });
    return;
  } catch (error: any) {
    console.error('Error seeding database:', error.message);
    res.status(500).json({
      error: 'Error seeding database',
      details: error.message,
    });
    return;
  }
};
