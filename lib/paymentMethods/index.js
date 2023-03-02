import { getAuthentication, getRequestInfo, request } from '../utils';

const CONFIGS = {
  sendUpdateEmail: {
    url: 'shopify/customerPaymentMethods/sendUpdateEmail',
    method: 'POST',
  },
};

export default (configs) => {
  const sendUpdateEmail = async (payload) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CONFIGS.sendUpdateEmail),
      data: payload
    });
  };
  return {
    sendUpdateEmail,
  };
};
