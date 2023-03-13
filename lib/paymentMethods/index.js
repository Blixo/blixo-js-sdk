import { getAuthentication, getRequestInfo, request } from '../utils';

const CONFIGS = {
  get: {
    url: 'shopify/customerPaymentMethods/${customerPaymentMethodId}',
    method: 'GET',
  },
  list: {
    url: 'shopify/customerPaymentMethods',
    method: 'GET',
  },
  revoke: {
    url: 'shopify/customerPaymentMethods/revoke',
    method: 'POST',
  },
  send: {
    url: 'shopify/customerPaymentMethods/send',
    method: 'POST',
  },
};

export default (configs) => {
  const get = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CONFIGS.get, { 
        customerPaymentMethodId: _.get(params, 'customerPaymentMethodId')
      }, {
        params,
      }),
    });
  };
  const list = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CONFIGS.list, {}, {
        params,
      }),
    });
  };
  const revoke = async (payload) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CONFIGS.revoke),
      data: payload
    });
  };
  const send = async (payload) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CONFIGS.send),
      data: payload
    });
  };
  return {
    get,
    revoke,
    send,
    list,
  };
};
