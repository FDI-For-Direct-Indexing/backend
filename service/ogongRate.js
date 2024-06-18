const Corporate = require('../models/Corporate');
var request = require('request');

const accessComment = async (code, message) => {
  try {
    // 감정분석을 위한 API 호출
    const sentiment = await callSentimentAnalysisAPI(message);
    
    if (sentiment == null || sentiment == undefined || sentiment == "") {
      console.log('sentiment is null. 감정분석 실패');
      return;
    }
    // 감정분석 결과를 오공지수에 업데이트
    const result = await updateOgongRate(code, sentiment);
    return result;

  } catch (error) {
    console.error('accessComment error: ' + error);
  }
}

const callSentimentAnalysisAPI = async (message) => {
  try {
    const api_url = process.env.SENTI_API_URL;
    const options = {
      url: api_url,
      body: { 'content': message },
      json: true,
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.SENTI_API_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': process.env.SENTI_API_CLIENT_SECRET,
        'Content-Type': 'application/json' }
    };
    const sentiment = await new Promise((resolve, reject) => {
      request.post(options, function (error, response, body) {
        if (error){
          reject(error);
        } else {
          try {
            const sentimentValue = body.document.sentiment;
            resolve(sentimentValue);
          } catch (e) {
            reject(e);
          }
        }
      });
    });

    if (sentiment == 'positive') {
      return 100;
    } else if (sentiment == 'neutral') {
      return 50;
    } else { // negative
      return 0;
    }
  } catch (error) {
    console.error(error);
  }
}

const updateOgongRate = async (code, sentiment) => {
  const corporate = await Corporate.findOne({ code: code });
  if (!corporate.ogong_cnt) {
    corporate.ogong_cnt = 20;
  }
  if (sentiment == null){
    return;
  }
  ogongRate = corporate.ogong_rate * corporate.ogong_cnt / (corporate.ogong_cnt + 1) + sentiment / (corporate.ogong_cnt + 1); 
  corporate.ogong_rate = ogongRate;
  corporate.ogong_cnt += 1;
  await corporate.save();
  return ogongRate;
}

exports.accessComment = accessComment;