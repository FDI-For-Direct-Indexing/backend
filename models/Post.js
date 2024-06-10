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
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
