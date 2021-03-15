const axios = require("axios");
const { stringify } = require("querystring");
const User = require("../models/user");
const Service = require("../models/service");
const AccountProvider = require("../models/accountProvider");
const { officeScopes } = require("../routes/accountProvider/auth");

class microsoftAuthProvider {
  constructor(userId, provider) {
    this.userId = userId;
    this.provider = provider;
  }

  hasTokenExpired = async token => {
    try {
      const urls = {
        MicrosoftGraph: "https://graph.microsoft.com/v1.0/me",
        Yammer: "https://api.yammer.com/api/v1/users/current.json"
      };
      const res = await axios.get(urls[this.provider], {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res?.status === 401;
    } catch (err) {
      return err?.response?.status === 401;
    }
  };

  refreshToken = async refreshToken => {
    try {
      const resources = {
        MicrosoftGraph: "https://graph.microsoft.com",
        Yammer: "https://api.yammer.com"
      };
      const res = await axios.post(
        `https://login.microsoftonline.com/${process.env.OFFICE_TENANT}/oauth2/token`,
        stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: process.env.OFFICE_KEY,
          client_secret: process.env.OFFICE_SECRET,
          scope: officeScopes,
          ...(resources[this.provider]
            ? { resource: resources[this.provider] }
            : {})
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
      return {
        accessToken: res?.data?.access_token || "",
        refreshToken: res?.data?.refresh_token || ""
      };
    } catch (err) {
      console.log(err.message);
      return {};
    }
  };

  getAccessToken = async () => {
    const user = await User.findById(this.userId);
    const services = (await Service.find({ _id: { $in: user.services } })).map(
      s => s.accountProvider
    );
    const accountProvider = (await AccountProvider.find({
      _id: { $in: services }
    })).find(ap => ap.name === this.provider);

    const expired = await this.hasTokenExpired(accountProvider?.token || "");
    if (expired) {
      const { accessToken, refreshToken } = await this.refreshToken(
        accountProvider?.refreshToken || ""
      );
      if (accessToken && refreshToken) {
        await AccountProvider.updateOne(
          { _id: accountProvider._id },
          { token: accessToken, refreshToken }
        );
        return accessToken;
      }
    }
    return accountProvider?.token || "";
  };
}

module.exports = microsoftAuthProvider;
