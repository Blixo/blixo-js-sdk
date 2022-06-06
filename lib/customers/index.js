import _ from 'lodash';
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
  get: {
    url: 'customers/${customerId}',
    method: 'GET',
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

  const getCustomer = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.get, { customerId: _.get(params, 'customerId') }, {
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
    get: getCustomer,
    getCustomerByShopifyCustomerId,
  }
}

export default Customers
