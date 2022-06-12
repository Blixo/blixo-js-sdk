import axios from 'axios'
import { APP_CONFIGS, APP_MODE, Authorization } from './constants'
import _ from 'lodash'

export const getBaseURL = (configs) => {
  const mode = _.get(configs, 'mode', APP_MODE.dev);

  const appConfigs = _.get(APP_CONFIGS, mode);

  return _.get(appConfigs, 'baseUrl')
}

export const getRequestInfo = (configs, data, additionInfo = {}) => {
  const templated = _.template(`${getBaseURL()}/${configs.url}`)
  const url = templated(data)
  return {
    ...configs,
    url,
    ...additionInfo,
  }
}

export const getAuthentication = (configs) => {
  return {
    auth: {
      username: _.get(configs, 'apiKey'),
      password: '',
    },
  }
}

export const getHeaders = () => {
  return {
    Authorization,
  }
}

export const request = (payload) => {
  return axios(payload)
    .then((res) => {
      return {
        response: _.get(res, 'data'),
        errors: null,
      }
    })
    .catch((e) => {
      return {
        errors: {
          message: _.get(e, 'response.data.message', 'Unknown Error'),
        },
      }
    })
}
