var express = require("express");
const Price = require("../models/Price");
var router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RealtimePrice
 *   description: API for retrieving real-time stock prices
 */

/**
 * @swagger
 * /realtimePrice/price/{stockCode}:
 *   get:
 *     summary: Get real-time price data for a given stock code
 *     tags: [RealtimePrice]
 *     parameters:
 *       - in: path
 *         name: stockCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock code to retrieve price data for
 *     responses:
 *       200:
 *         description: Real-time price data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1e8e6c9f0e1d2e"
 *                   corporate_id:
 *                     type: string
 *                     example: "005930"
 *                   price:
 *                     type: number
 *                     example: 82000
 *                   compare:
 *                     type: number
 *                     example: -500
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-27T12:34:56Z"
 *       500:
 *         description: Server error
 */

// 클라이언트 요청 처리 (하루치 데이터 전송)
router.get("/price/:stockCode", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const stockPrices = await Price.find({
    timestamp: { $gte: today, $lt: tomorrow },
  });

  res.json(stockPrices);
});

module.exports = router;
