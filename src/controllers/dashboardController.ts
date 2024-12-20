import { Response } from 'express';
import pool from '../config/db';
import { RequestWithUser } from '../types/RequestWithUser';

// Function to fetch the dashboard data
export const getDashboard = async (req: RequestWithUser, res: Response): Promise<void> => {
  const userId = req.user?.user_id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized access' });
    return;
  }

  try {
    const devices = await pool.query(
      `
      SELECT 
      d.device_id AS device_id,
        d.layer AS layer,
        d.area AS area,
        d.name AS name,
        d.unit AS unit,
        d.status AS status,
        d.type AS type,
        COALESCE(latest_data.value, NULL) AS value
      FROM device d
      LEFT JOIN (
        SELECT DISTINCT ON (device_id) 
          device_id, 
          value, 
          timestamp
        FROM data
        ORDER BY device_id, timestamp DESC
      ) latest_data ON d.device_id = latest_data.device_id
      WHERE d.user_id = $1
      ORDER BY d.layer, d.area, d.type, d.name
      `,
      [userId]
    );

    if (devices.rows.length === 0) {
      res.status(404).json({ error: 'No devices found for the user' });
      return;
    }

    const groupedData = devices.rows.reduce((acc: any, device: any) => {
      if (!acc[device.layer]) {
        acc[device.layer] = {};
      }
      if (!acc[device.layer][device.area]) {
        acc[device.layer][device.area] = { sensors: [], motors: [] };
      }

      const category = device.type === 'sensor' ? 'sensors' : 'motors';
      acc[device.layer][device.area][category].push({
        name: device.name,
        unit: device.unit,
        status: device.status,
        value: device.value,
      });

      return acc;
    }, {});

    res.status(200).json(groupedData);
  } catch (error: any) {
    console.error('Error fetching dashboard:', error.message);
    res.status(500).json({ error: 'Error fetching dashboard' });
  }
};



// Function to fetch detailed dashboard data for a specific layer
export const getDashboardDetail = async (req: RequestWithUser, res: Response): Promise<void> => {
  const userId = req.user?.user_id;
  const { layer } = req.params;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized access' });
    return;
  }

  if (!layer) {
    res.status(400).json({ error: 'Layer parameter is required' });
    return;
  }

  try {
    const data = await pool.query(
      `
      SELECT 
        d.area AS area,
        d.name AS name,
        d.unit AS unit,
        d.status AS status,
        d.type AS type,
        da.value AS value,
        da.timestamp AS timestamp
      FROM device d
      LEFT JOIN data da ON d.device_id = da.device_id
      WHERE d.layer = $1 AND d.user_id = $2
      ORDER BY d.area, d.type, d.name, da.timestamp DESC
      `,
      [layer, userId]
    );

    if (data.rows.length === 0) {
      res.status(404).json({ error: `No data found for layer ${layer}` });
      return;
    }

    const groupedData = data.rows.reduce((acc: any, device: any) => {
      if (!acc[device.area]) {
        acc[device.area] = { sensors: {}, motors: {} };
      }

      const category = device.type === 'sensor' ? 'sensors' : 'motors';

      if (!acc[device.area][category][device.name]) {
        acc[device.area][category][device.name] = {
          unit: device.unit,
          status: device.status,
          values: [],
        };
      }

      if (device.value !== null && device.timestamp !== null) {
        acc[device.area][category][device.name].values.push({
          value: device.value,
          timestamp: device.timestamp,
        });
      }

      return acc;
    }, {});

    res.status(200).json(groupedData);
  } catch (error: any) {
    console.error('Error fetching layer details:', error.message);
    res.status(500).json({ error: 'Error fetching layer details' });
  }
};



