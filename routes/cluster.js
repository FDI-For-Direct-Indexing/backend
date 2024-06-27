const express = require("express");
const router = express.Router();
const cluster = require("../service/cluster");

/**
 * @swagger
 * tags:
 *   name: Cluster
 *   description: Clustering related API
 */

/**
 * @swagger
 * /cluster:
 *   post:
 *     summary: Get cluster results based on stock list and slider values
 *     tags: [Cluster]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "005930"
 *                     name:
 *                       type: string
 *                       example: "Samsung Electronics"
 *                     profitability:
 *                       type: number
 *                       example: 8.5
 *                     stability:
 *                       type: number
 *                       example: 7.2
 *                     activity:
 *                       type: number
 *                       example: 6.8
 *                     potential:
 *                       type: number
 *                       example: 9.1
 *                     ogoong_rate:
 *                       type: number
 *                       example: 8.3
 *               sliderValues:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [0.5, 0.7, 0.3]
 *     responses:
 *       200:
 *         description: Cluster results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     format: int32
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "005930"
 *                         name:
 *                           type: string
 *                           example: "Samsung Electronics"
 *                         x:
 *                           type: number
 *                           example: 1.23
 *                         y:
 *                           type: number
 *                           example: 2.34
 *                         수익성:
 *                           type: number
 *                           example: 8.5
 *                         안정성:
 *                           type: number
 *                           example: 7.2
 *                         활동성:
 *                           type: number
 *                           example: 6.8
 *                         생산성:
 *                           type: number
 *                           example: 9.1
 *                         오공지수:
 *                           type: number
 *                           example: 8.3
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post("/", async (req, res) => {
  const { stockList, sliderValues } = req.body;

  return res.json(await cluster.getClusterResult(stockList, sliderValues));
});

module.exports = router;
