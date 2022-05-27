import { getAuthentication, getRequestInfo, request } from '../utils'

const SUBSCRIPTIONS_CONFIGS = {
  list: {
    url: 'subscriptions',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
}

const Subscriptions = (configs) => {
  const listSubscriptions = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.list, {}, {
        params,
      }),
    })
  }

  return {
    list: listSubscriptions,
  }
}

export default Subscriptions
