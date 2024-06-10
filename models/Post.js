/**
 * @swagger
 * components:
 *  schemas:
 *   Post:
 *    properties:
 *      content:
 *        type: string
 *        description: 게시글 내용
 *      created_date:
 *        type: string
 *        description: 게시글 작성일
 */

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
