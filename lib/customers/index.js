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
  getByShopifyCustomerId: {
    url: 'customers/getShopifyCustomer/${shopifyCustomerId}',
    method: 'GET',
  },
}

const Customers = (configs) => {
  const listCustomers = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.list, {}, {
        params,
      }),
    })
  }

  const getCustomerByShopifyCustomerId = async (shopifyCustomerId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.getByShopifyCustomerId, { shopifyCustomerId }),
    })
  }

  return {
    list: listCustomers,
    getCustomerByShopifyCustomerId,
  }
}

export default Customers
