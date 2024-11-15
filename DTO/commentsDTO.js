class CommentDTO {
  constructor(postId, userId, text, timestamp = Date.now(), replies = []) {
    this.postId = postId;
    this.userId = userId;
    this.text = text;
    this.timestamp = timestamp;

    this.replies = replies;
  }
}

class ReplyDTO {
  constructor(userId, text, timestamp = Date.now()) {
    this.userId = userId;
    this.text = text;
    this.timestamp = timestamp;
  }
}

export { CommentDTO, ReplyDTO };
