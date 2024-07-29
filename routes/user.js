const express = require("express");
const user = require("../service/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const savedUser = await user.Signup(req.body.name);
  return res.status(201).json(savedUser);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const savedUser = await user.getUserById(id);
  return res.status(200).json(savedUser.name);
});

module.exports = router;
