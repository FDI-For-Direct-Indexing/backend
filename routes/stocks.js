const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stocks
 *   description: API for managing stock information
 */

/**
 * @swagger
 * /stocks/search/{keyword}:
 *   get:
 *     summary: Search for a corporate by keyword
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: The keyword to search for a corporate
 *     responses:
 *       200:
 *         description: Corporate information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "005930"
 *       404:
 *         description: Corporate not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /stocks/include/{keyword}:
 *   get:
 *     summary: Search for corporates that include the given keyword
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: The keyword to search for corporates
 *     responses:
 *       200:
 *         description: List of corporates that include the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Samsung Electronics"
 *       500:
 *         description: Server error
 */

router.get("/search/:keyword", async function (req, res, next) {
  const keyword = req.params.keyword;
  return res.json(await stocks.searchCorporate(keyword));
});

router.get("/include/:keyword", async function (req, res, next) {
  const keyword = req.params.keyword;
  return res.json(await stocks.searchIncludedCorporate(keyword));
});

module.exports = router;
