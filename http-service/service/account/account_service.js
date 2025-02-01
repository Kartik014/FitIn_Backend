import account from "../../database/models/account/account.js";

const accountService = {
  addAccount: async (accountDTO) => {
    try {
      const createdAccount = await account.addAccount(accountDTO);
      return createdAccount;
    } catch (err) {
      console.error("Error in addAccount service: ", err);
      throw err;
    }
  },

  getAccount: async (userid) => {
    try {
      const accountData = await account.getAccount(userid);
      if (!accountData) {
        throw new Error("Account not found");
      }
      return accountData;
    } catch (err) {
      console.error("Error in getAccount service: ", err);
      throw err;
    }
  },

  updateAccount: async (accountDTO) => {
    try {
      const updatedAccount = await account.updateAccount(accountDTO);
      return updatedAccount;
    } catch (err) {
      console.error("Error in updateAccount service: ", err);
      throw err;
    }
  },

  deleteAccount: async (userid) => {
    try {
      const deletedAccount = await account.deleteAccount(userid);
      return deletedAccount;
    } catch (err) {
      console.error("Error in deleteAccount service: ", err);
      throw err;
    }
  },
};

export default accountService;
