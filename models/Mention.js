const mongoose = require("mongoose");
const { monkeyRankingDbConnection } = require("./db");

const MentionSchema = new mongoose.Schema(
    {
        corporate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Corporate",
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

const Mention = monkeyRankingDbConnection.model("Mention", MentionSchema);
module.exports = Mention;