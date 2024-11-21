class AccountDTO {
  constructor(
    userid,
    name,
    username,
    bio = null,
    ispublic = 1,
    isverified = 0,
    thumbnailimage = null
  ) {
    this.userid = userid;
    this.name = name;
    this.username = username;
    this.bio = bio;
    this.ispublic = ispublic;
    this.isverified = isverified;
    this.thumbnailimage = thumbnailimage;
  }
}

export default AccountDTO;
