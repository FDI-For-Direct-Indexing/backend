const WeightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profitability: {
      type: Number,
      required: true,
    },
    stability: {
      type: Number,
      required: true,
    },
    activity: {
      type: Number,
      required: true,
    },
    potential: {
      type: Number,
      required: true,
    },
    ogong_rate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Weight = mongoose.model("Weight", WeightSchema);

module.exports = Weight;
