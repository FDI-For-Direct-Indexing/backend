const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", async (req, res) => {
  const data = JSON.stringify(req.body);
  console.log(`Sending data to Python script: ${data}`);

  const pythonRoot = path.join(__dirname, "../myenv/bin/python");
  const scriptPath = path.join(__dirname, "../service/stock_backtest.py");
  const pythonProcess = spawn(pythonRoot, [scriptPath]);

  let resultString = "";

  pythonProcess.stdout.on("data", (data) => {
    resultString += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      try {
        const result = JSON.parse(resultString);
        res.json(result);
      } catch (error) {
        console.error("Failed to parse Python response:", error);
        res.status(500).json({ error: "Failed to parse Python response" });
      }
    }
  });

  pythonProcess.stdin.write(data);
  pythonProcess.stdin.end();
});

module.exports = router;
