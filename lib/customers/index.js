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
  updateCustomer: {
    url: 'shopify/customers/${customerId}',
    method: 'PATCH',
  },
  resetPassword: {
    url: 'shopify/customers/${customerId}/resetPassword',
    method: 'POST',
  },
  updateCustomerAddress: {
    url: 'shopify/customers/${customerId}/addresses/${addressId}',
    method: 'PATCH',
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
  addPaymentMethod: {
    url: 'customers/${customerId}/paymentMethods',
    method: 'POST'
  },
  resolveShopifyCustomer: {
    url: 'customers/resolveShopifyCustomer/${email}',
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

  const updateCustomer = async (payload, shopifyCustomerId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.updateCustomer, { customerId: shopifyCustomerId }),
      data: payload
    })
  }

  const updateCustomerAddress = async (payload, shopifyCustomerId, addressId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.updateCustomerAddress, { customerId: shopifyCustomerId, addressId }),
      data: payload
    })
  }

  const resetCustomerPassword = async (payload, shopifyCustomerId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.resetPassword, { customerId: shopifyCustomerId }),
      data: payload
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

  const addPaymentMethod = async (payload, customerId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.addPaymentMethod, { customerId }),
      data: payload

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

  const resolveShopifyCustomer = async (email) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CUSTOMERS_CONFIGS.resolveShopifyCustomer, { email }),
    })
  }

  return {
    list: listCustomers,
    get: getCustomer,
    update: updateCustomer,
    updateAddress: updateCustomerAddress,
    getCustomerByShopifyCustomerId,
    getClientToken,
    deleteCustomerPaymentMethod,
    markDefaultPaymentMethod,
    addPaymentMethod,
    resolveShopifyCustomer,
    resetCustomerPassword
  }
}

export default Customers
