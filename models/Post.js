const { mongo, default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    created_date: {
      type: Date,
      required: true,
    },
    corporate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CorporateFundamental",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
