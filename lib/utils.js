import axios from 'axios'
import { Authorization, BASE_URL } from './constants';
import _ from 'lodash'

export const getRequestInfo = (configs) => {
  return {
    ...configs,
    url: `${BASE_URL}/${configs.url}`,
  }
}

export const getHeaders = () => {
  return {
    Authorization,
  }
}

export const request = (payload) => {
  return axios(payload).then((res) => {
    console.log('res', res)
    return {
      response: _.get(res, 'data'),
      errors: null,
    }
  }).catch(e => {
    console.log('e', e.response.data.message)
    return {
      errors: {
        message: _.get(e, 'response.data.message', 'Unknown Error')
      },
    }
  })
}
