import axios from "axios";
const CryptoJS = require("crypto-js");

const encryptPassword = (password) => {
  let cipherPassword = CryptoJS.AES.encrypt(
    password,
    process.env.PASS_HASH
  ).toString();
  return cipherPassword;
};

const allAccountUtil = {
  signup: async (email, password, firstname, lastname, phone, facebook, instagram) => {
    try {
      let facebookValue = !facebook ? null : facebook;
      let instagramValue = !instagram ? null : instagram;
      let cipherPassword = encryptPassword(password);
      let res = await axios.post(process.env.API_KEY + `/account/signup`, {
        email: email,
        password: cipherPassword,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        facebook: facebookValue,
        instagram: instagramValue
      })
      return res;
    } catch (e) {
      return e.response;
    }
  },
  getUser: async (id) => {
    try {
      let res = await axios.get(process.env.API_KEY + `/account/getUser/${id}`);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  changeThumbnail: async (owner, cipherCredential, blob) => {
    try {
      let formData = new FormData();
      formData.append(`userThumbnail`, blob[0]);
      formData.append('owner', owner);
      formData.append('cipherCredential', cipherCredential);
      let res = await axios({
        method: "put",
        url: process.env.API_KEY + `/account/changeThumbnail`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      return res;
    } catch (e) {
      return e.response;
    }
  },
  getMyPost: async (id) => {
    try {
      let res = await axios.get(process.env.API_KEY + `/account/getMyPost/${id}`);
      return res;
    } catch (e) {
      return e.response;
    }
  }, editContact: async (id, cipherCredential, firstname, lastname, phone, facebook, instagram) => {
    try {
      let res = await axios.put(process.env.API_KEY + "/account/edit", {
        id: id,
        cipherCredential: cipherCredential,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        facebook: facebook,
        instagram: instagram
      });
      return res;
    }
    catch (e) {
      return e.response;
    }
  },
  getUser: async (id) => {
    try {
      let res = await axios.get(process.env.API_KEY + `/account/getUser/${id}`);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  getMyDashboard: async (id) => {
    try {
      let res = await axios.get(
        process.env.API_KEY + `/account/getMyDashboard/${id}`
      );
      return res;
    } catch (e) {
      return e.response;
    }
  },
  getMyPost: async (id) => {
    try {
      let res = await axios.get(
        process.env.API_KEY + `/account/getMyPost/${id}`
      );
      return res;
    } catch (e) {
      return e.response;
    }
  },
};

export default allAccountUtil;
