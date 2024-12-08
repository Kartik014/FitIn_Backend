class PostDTO {
  constructor(
    postid,
    userid,
    caption,
    postingtime = new Date(),
    location = null,
    medialink = null,
    filetype = null
  ) {
    this.postid = postid; // Optional, generated if not provided
    this.userid = userid;
    this.caption = caption;
    this.postingtime = postingtime;
    this.location = location;
    this.medialink = medialink;
    this.filetype = filetype;
  }

  //   validateFileType(filetype) {
  //     const allowedFileTypes = ["image", "video", "audio", "document", null];
  //     if (!allowedFileTypes.includes(filetype)) {
  //       throw new Error(
  //         `Invalid file type: ${filetype}. Allowed types are ${allowedFileTypes.join(
  //           ", "
  //         )}`
  //       );
  //     }
  //     return filetype;
  //   }
}

export default PostDTO;
