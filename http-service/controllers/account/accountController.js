import { nanoid } from "nanoid";
import AccountDTO from "../../DTO/accountDTO.js"; // Ensure .js extension for ES modules
import bucket from "../../firebase.js"; // Ensure .js extension for ES modules
import accountService from "../../service/account/account_service.js"; // Ensure .js extension for ES modules

export const createAccount = async (req, res) => {
  try {
    let thumbnailimage = null;

    const profile = req.file || {}; // Ensure 'profile' is fetched properly
    if (profile) {
      const fileName = `${Date.now()}_${profile.originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: profile.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("finish", () => {
          let medialinkFile = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(fileName)}?alt=media`;
          thumbnailimage = medialinkFile;
          resolve();
        });
        blobStream.on("error", reject);
        blobStream.end(profile.buffer);
      });
    }

    const { userid, name, username, bio, ispublic, isverified } = req.body;

    const ispublicValue = ispublic === "TRUE" ? 1 : 0;
    const isverifiedValue = isverified === "TRUE" ? 1 : 0;

    const accountDTO = new AccountDTO(
      userid,
      name,
      username,
      bio,
      ispublicValue,
      isverifiedValue,
      thumbnailimage
    );

    // Add account using the service
    const newAccount = await accountService.addAccount(accountDTO);

    res.status(200).json({
      message: "Account created successfully",
      account: newAccount,
    });
  } catch (err) {
    console.error("Error in creating account:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const fetchAccount = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const accountData = await accountService.getAccount(userid);
    if (!accountData) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({ account: accountData });
  } catch (err) {
    console.error("Error in fetching account:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const editAccount = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let thumbnailimage = null;

    const profile = req.file || {}; // Ensure 'profile' is fetched properly
    if (profile) {
      const fileName = `${Date.now()}_${profile.originalname}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: profile.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("finish", () => {
          let medialinkFile = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(fileName)}?alt=media`;
          thumbnailimage = medialinkFile;
          resolve();
        });
        blobStream.on("error", reject);
        blobStream.end(profile.buffer);
      });
    }

    const { name, username, bio, ispublic, isverified } = req.body;

    const ispublicValue = ispublic === "TRUE" ? 1 : 0;
    const isverifiedValue = isverified === "TRUE" ? 1 : 0;

    const accountDTO = new AccountDTO(
      userid,
      name,
      username,
      bio,
      ispublicValue,
      isverifiedValue,
      thumbnailimage
    );

    console.log(accountDTO);
    console.log(req.body);

    const updatedAccount = await accountService.updateAccount(accountDTO);

    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({
      message: "Account updated successfully",
      account: updatedAccount,
    });
  } catch (err) {
    console.error("Error in editing account:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch account details to get the image URL
    const accountData = await accountService.getAccount(userid);

    if (!accountData) {
      return res.status(404).json({ message: "Account not found" });
    }

    const { thumbnailimage } = accountData;

    if (thumbnailimage) {
      // Extract the file path from the Firebase URL
      const filePath = decodeURIComponent(
        thumbnailimage.split("/o/")[1].split("?")[0]
      );

      // Delete the file from Firebase Storage
      await bucket.file(filePath).delete();
      console.log("Image deleted successfully");
    }

    // Delete the user account from the database
    await accountService.deleteAccount(userid);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
