const express = require("express");
const router = express.Router();
const corporates = require("../service/corporates");

/**
 * @swagger
 * tags:
 *   name: Corporates
 *   description: API for managing corporate information
 */

/**
 * @swagger
 * /corporates/search:
 *   get:
 *     summary: Search for a corporate by keyword
 *     tags: [Corporates]
 *     parameters:
 *       - in: query
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
 * /corporates/include:
 *   get:
 *     summary: Search for corporates that include the given keyword
 *     tags: [Corporates]
 *     parameters:
 *       - in: query
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

/**
 * @swagger
 * /corporates/list:
 *   get:
 *     summary: Get a list of all corporates
 *     tags: [Corporates]
 *     responses:
 *       200:
 *         description: List of all corporates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "005930"
 *                   name:
 *                     type: string
 *                     example: "Samsung Electronics"
 *                   profit:
 *                     type: number
 *                     example: 8.5
 *                   growth:
 *                     type: number
 *                     example: 7.2
 *                   safety:
 *                     type: number
 *                     example: 6.8
 *                   efficiency:
 *                     type: number
 *                     example: 9.1
 *                   oogong_rate:
 *                     type: number
 *                     example: 8.3
 *       500:
 *         description: Server error
 */

router.get("/search", async function (req, res, next) {
  const keyword = req.query.keyword;
  return res.json(await corporates.searchCorporate(keyword));
});

router.get("/include", async function (req, res, next) {
  const keyword = req.query.keyword;
  return res.json(await corporates.searchIncludedCorporate(keyword));
});

router.get("/list", async function (req, res, next) {
  return res.json(await corporates.getCorporates());
});
module.exports = router;
