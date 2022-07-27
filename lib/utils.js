import axios from "axios";
import { APP_CONFIGS, APP_MODE, Authorization } from "./constants";
import _ from "lodash";
import Config from "./Config";

export const getMode = () => {
  const mode = Config.get("mode") || APP_MODE.production;
  return mode;
};

export const getBaseURL = () => {
  const mode = Config.get("mode") || APP_MODE.production;
  const appConfigs = _.get(APP_CONFIGS, mode);
  return _.get(appConfigs, "baseUrl");
};

export const getWebURL = () => {
  const mode = Config.get("mode") || APP_MODE.production;
  const appConfigs = _.get(APP_CONFIGS, mode);
  return _.get(appConfigs, "webUrl");
};

export const getRequestInfo = (configs, data, additionInfo = {}) => {
  const templated = _.template(`${getBaseURL()}/${configs.url}`);
  const url = templated(data);
  return {
    ...configs,
    url,
    ...additionInfo,
  };
};

export const getAuthentication = (configs) => {
  // const accessToken = localStorage.getItem('accessTokenBlixoInt');
  // if(accessToken) {
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     }
  //   }
  // }
  return {
    auth: {
      username: _.get(configs, "apiKey"),
      password: "",
    },
  };
};

export const getHeaders = () => {
  return {
    Authorization,
  };
};

export const request = (payload) => {
  return axios(payload)
    .then((res) => {
      return {
        response: _.get(res, "data"),
        errors: null,
      };
    })
    .catch((e) => {
      return {
        errors: {
          message: _.get(e, "response.data.message", "Unknown Error"),
        },
      };
    });
};

export const base64Url = {
  unescape(str) {
    return (str + "===".slice((str.length + 3) % 4))
      .replace(/-/g, "+")
      .replace(/_/g, "/");
  },
  escape(str) {
    return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  },
  encode(str) {
    return this.escape(btoa(str));
  },
  decode(str) {
    return atob(this.unescape(str));
  },
};
