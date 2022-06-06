import { getAuthentication, getHeaders, getRequestInfo, request } from '../utils';
import _ from 'lodash';

const ITEMS_CONFIGS = {
  list: {
    url: 'items',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
  add: {
    url: 'items',
    method: 'POST',
  },
  get: {
    url: 'items/${itemId}',
    method: 'GET',
  },
  getByProductId: {
    url: 'items/getProductById/${productId}',
    method: 'GET',
  },
}

const Items = (configs) => {
  const listItems = async (params) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(ITEMS_CONFIGS.list, {}, {
        params,
      }),
    })
  }

  const addItems = async (body) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(ITEMS_CONFIGS.add),
      body,
    })
  }

  const getItem = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(ITEMS_CONFIGS.get, { itemId: _.get(params, 'itemId') }, {
        params,
      }),
    })
  }

  const getItemByProductId = async (productId) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(ITEMS_CONFIGS.getByProductId, { productId }),
    })
  }

  return {
    list: listItems,
    get: getItem,
    // add: addItems,
    getItemByProductId,
  }
}

export default Items
