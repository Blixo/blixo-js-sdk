import { getAuthentication, getRequestInfo, request } from '../utils';

const ADDONS_CONFIGS = {
  list: {
    url: 'addons',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
}

const Addons = (configs) => {
  const listAddons = async (params) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(ADDONS_CONFIGS.list, {}, {
        params,
      }),
    })
  }

  return {
    list: listAddons,
  }
}

export default Addons
