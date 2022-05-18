import { getHeaders, getRequestInfo, request } from "./utils";
import { BLIXO_API_CONFIGS } from "./constants";

const ITEMS_CONFIGS = {
  list: {
    url: 'items',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10
    }
  },
  add: {
    url: 'items',
    method: 'POST',
  },
  getByProductId: {
    url: 'items/getProductById/${productId}',
    method: 'GET',
  },
}
const listItems = async (params) => {
  return request({
    headers: getHeaders(),
    ...getRequestInfo(ITEMS_CONFIGS.list)
  })
}

const addItems = async (body) => {
  return request({
    headers: getHeaders(),
    ...getRequestInfo(ITEMS_CONFIGS.add),
    body,
  })
}

export const getItemByProductId = async (productId) => {
  return request({
    headers: getHeaders(),
    ...getRequestInfo(ITEMS_CONFIGS.getByProductId, { productId }),
  })
}

const Items = {
  list: listItems,
  add: addItems,
  getItemByProductId,
}

export default Items;
