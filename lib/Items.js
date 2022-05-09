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

const Items = {
  list: listItems,
  add: addItems,
}

export default Items;
