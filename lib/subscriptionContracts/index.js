import _ from 'lodash';
import { getAuthentication, getRequestInfo, request } from '../utils';

const CONFIGS = {
  get: {
    url: 'shopify/subscriptionContracts/${subscriptionContractId}',
    method: 'GET',
  },
};

export default (configs) => {
  const get = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(CONFIGS.get, { subscriptionContractId: _.get(params, 'subscriptionContractId') }, {
        params,
      }),
    })
  };
  return {
    get,
  };
};
