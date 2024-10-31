import express from "express";
import { initializeDatabase } from "./db-init.js";
import combinationGeneratorRoutes from "./combination-generator/combination-generator.route.js";

const app = express();

app.use(express.json());
app.use("/api/generate", combinationGeneratorRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

initializeDatabase();

const PORT = 5300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
