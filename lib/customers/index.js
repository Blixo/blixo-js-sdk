import { getAuthentication, getRequestInfo, request } from '../utils';

const CUSTOMERS_CONFIGS = {
  list: {
    url: 'customers',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
}

const Customers = (configs) => {
  const listCustomers = async (params) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.list, {}, {
        params,
      }),
    })
  }

  return {
    list: listCustomers,
  }
}

export default Customers
