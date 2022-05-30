import { getAuthentication, getRequestInfo, request } from '../utils';

const SHOPIFY_CONFIGS = {
  get: {
    url: 'integrations/shopify/info',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
}

const Shopify = (configs) => {
  const getShopify = async () => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SHOPIFY_CONFIGS.get),
    })
  }

  return {
    get: getShopify,
  }
}

export default Shopify
