import { getAuthentication, getRequestInfo, request } from '../utils';

const INVOICES_CONFIGS = {
  list: {
    url: 'invoices',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
  add: {
    url: 'invoices',
    method: 'POST',
  },
  getByProductId: {
    url: 'invoices/getProductById/${productId}',
    method: 'GET',
  },
}

const Invoices = (configs) => {
  const listInvoices = async ({ query: params}) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(INVOICES_CONFIGS.list, {}, {
        params,
      }),
    })
  }

  return {
    list: listInvoices,
  }
}

export default Invoices
