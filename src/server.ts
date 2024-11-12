import express, { Request, Response } from "express";

const app = express();
app.use(express.json());
const port = 3030;

app.post("/ph", (req: Request, res: Response) => {
  // Handle PH PUT request
  const phValue = req.body.ph;
  console.log("Received PH value:", phValue);
  // ... process the PH value as needed ...
  res.sendStatus(200);
});

app.post("/temp", (req: Request, res: Response) => {
  // Handle temperature PUT request
  const temperature = req.body.temp;
  console.log("Received temperature:", temperature);
  // ... process the temperature as needed ...
  res.sendStatus(200);
});

app.post("/humidity", (req: Request, res: Response) => {
  // Handle humidity PUT request
  const humidity = req.body.humidity;
  console.log("Received humidity:", humidity);
  // ... process the humidity as needed ...
  // store the humidity in a database
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
