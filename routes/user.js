const express = require("express");
const user = require("../service/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const savedUser = await user.Signup(req.body.name);
  return res.status(201).json(savedUser);
});

module.exports = router;
