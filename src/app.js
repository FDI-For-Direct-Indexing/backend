const express = require("express");

const app = express();

app.set("port", process.env.PORT || 3001);

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.listen(app.get("port"), () => {
  console.log("Start In ", app.get("port"), " Port");
});
