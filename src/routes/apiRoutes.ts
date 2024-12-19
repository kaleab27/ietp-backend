import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import * as authController from '../controllers/authController';
import * as dashboardController from '../controllers/dashboardController';
import * as deviceController from '../controllers/deviceController';
import * as readingController from '../controllers/readingController';
import * as setupController from '../controllers/setupController';
import pool from '../config/db';

const router = Router();

// Authentication Routes
router.get("/", async (req: Request, res: Response) => {
    try {
      // Attempt to connect to the database
      const client = await pool.connect();
      client.release(); // Release the client back to the pool
      res.json("success");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Database connection error:", error.message);
      } else {
        console.error("Database connection error:", error);
      }
      res.status(500).json("failed");
    }
  });
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Dashboard Routes
router.get('/dashboard', authenticateToken,dashboardController.getDashboard);
router.get('/dashboard-detail/:layer',   authenticateToken ,dashboardController.getDashboardDetail);

// Device Routes
router.post('/device',deviceController.registerDevice);

// router.delete('/delete-device',authenticateToken , )

// Reading Routes
router.post('/reading',readingController.postReading);

// Setup and Initialization Routes (Admin/Dev Use)
router.get('/setup/create-tables', setupController.createTables);
router.get('/setup/seed-database', setupController.seedDatabase);

export default router;
