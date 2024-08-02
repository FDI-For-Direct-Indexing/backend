const axios = require("axios");
const Mention = require("../models/Mention");
const Corporate = require("../models/Corporate");


async function getNaverChart(keywords, period) {

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    const endDateString = endDate.toISOString().split("T")[0];
    const startDateString = startDate.toISOString().split("T")[0];

    let keywordGroups = [];
    for (let i = 0; i < keywords.length; i++) {
        keywordGroups.push({
            groupName: keywords[i],
            keywords: [keywords[i]],
        });
    }

    var request_body = {
        startDate: startDateString,
        endDate: endDateString,
        timeUnit: "date",
        keywordGroups: keywordGroups,
    };

    try {
        const response = await axios.post(
            "https://openapi.naver.com/v1/datalab/search",
            JSON.stringify(request_body),
            {
                headers: {
                    "X-Naver-Client-Id": process.env.NAVER_TREND_API_ID,
                    "X-Naver-Client-Secret": process.env.NAVER_TREND_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.results;
    } catch (err) {
        throw err;
    }
}

function saveMention(corporate_id, amount) {
    const newMention = new Mention({
        corporate_id: corporate_id,
        amount: amount,
    });

    try {
        newMention.save();
        console.log(corporate_id, amount, " Mention saved successfully");
    } catch (err) {
        console.error("Error saving mention:", err);
    }
};

async function dataIsToday() {
    try {
        const mention = await Mention.findOne();

        if (!mention) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isToday = mention.updatedAt >= today;

        if (isToday) {
            return true;
        } else {
            await Mention.deleteMany({});
            return false;
        }
    } catch (err) {
        console.error('Error checking data:', err);
        throw err;
    }
}

async function saveMentionsForAllCorporates() {
    const dontNeedUpdate = await dataIsToday();
    if (dontNeedUpdate) {
        console.log('Mention Data is up to date');
        return;
    }

    try {
        const corporates = await Corporate.find()
        for (let i = 0; i < corporates.length; i += 5) { // 
            const chunk = corporates.slice(i, i + 5);
            const names = chunk.map(corp => corp.name);
            try {
                const data = await getNaverChart(names, 1);

                await Promise.all(data.map((item, index) => {
                    saveMention(chunk[index]._id, item.data[0].ratio)
                }));

            } catch (err) {
                console.error('Error fetching chart data:', err);
            }
        }
    } catch (err) {
        console.error('Error fetching corporates:', err);
    }
}

module.exports = {
    getNaverChart, saveMentionsForAllCorporates
};