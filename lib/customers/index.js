import _ from 'lodash';
import { GATEWAY_TYPES } from '../constants';
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
  deleteCustomerPaymentMethod: {
    url: 'customers/${customerId}/paymentMethods',
    method: 'DELETE',
  },
  markDefaultPaymentMethod: {
    url: 'customers/${customerId}',
    method: 'PATCH',
  },
  getClientToken: {
    url: 'paymentGateways/clientToken',
    method: 'GET'
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

  const deleteCustomerPaymentMethod = async (paymentSource, customerId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.deleteCustomerPaymentMethod, { customerId }),
      data: {
        paymentSource
      }
    })
  }

  const markDefaultPaymentMethod = async (paymentSources, customerId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.markDefaultPaymentMethod, { customerId }),
      data: {
        paymentSources
      }
    })
  }

  const getClientToken = async () => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.getClientToken, {}, {
        params: {
          gateway: GATEWAY_TYPES.braintree
        }
      }),
    })
  }

  return {
    list: listCustomers,
    get: getCustomer,
    getCustomerByShopifyCustomerId,
    getClientToken,
    deleteCustomerPaymentMethod,
    markDefaultPaymentMethod,
  }
}

export default Customers
