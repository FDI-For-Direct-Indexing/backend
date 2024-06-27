var express = require("express");
const stocks = require("../service/stocksDetail");
const router = express.Router();
const { setCurrentStockCode } = require("../service/stocksDetail");
const { onCodeRetrieved } = require("../service/koreainvestmentAPI/kisSocket");

/**
 * @swagger
 * tags:
 *   name: StocksDetail
 *   description: API for retrieving detailed stock information
 */

/**
 * @swagger
 * /stocksDetail/{code}:
 *   get:
 *     summary: Get detailed stock information by stock code
 *     tags: [StocksDetail]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock code to retrieve detailed information for
 *     responses:
 *       200:
 *         description: Detailed stock information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "005930"
 *                 name:
 *                   type: string
 *                   example: "Samsung Electronics"
 *                 price:
 *                   type: number
 *                   example: 82000
 *                 ogong_rate:
 *                   type: number
 *                   example: 8.3
 *                 profit:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       matrix:
 *                         type: string
 *                         example: "영업이익률"
 *                       rates:
 *                         type: number
 *                         example: 8.5
 *                 growth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       matrix:
 *                         type: string
 *                         example: "매출액증가율"
 *                       rates:
 *                         type: number
 *                         example: 7.2
 *                 stability:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       matrix:
 *                         type: string
 *                         example: "유동비율"
 *                       rates:
 *                         type: number
 *                         example: 6.8
 *                 efficiency:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       matrix:
 *                         type: string
 *                         example: "총자산회전율"
 *                       rates:
 *                         type: number
 *                         example: 9.1
 *       500:
 *         description: Server error
 */

/* GET stock */
router.get("/:code", async function (req, res, next) {
  const stockInfo = await stocks.getStockFundamentals(req.params.code);
  console.log(stockInfo);
  return res.json(stockInfo);
});

module.exports = router;
