import { getAuthentication, getRequestInfo, request } from '../utils';

const SUBSCRIPTIONS_CONFIGS = {
  list: {
    url: 'subscriptions',
    method: 'GET',
    params: {
      page: 1,
      perPage: 10,
    },
  },
  add: {
    url: 'subscriptions',
    method: 'POST',
  },
  update: {
    url: 'subscriptions/${subscriptionId}',
    method: 'PATCH',
  }
};

const Subscriptions = (configs) => {
  const listSubscriptions = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.list, {}, {
        params,
      }),
    });
  };

  const addSubscription = async (body) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.add),
      body,
    });
  };

  const updateSubscription = async (body) => {
    const id = _.get(body, 'id', _.get(body, 'subscriptionId'));
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.getByProductId, { subscriptionId: id }),
      ..._.omit(body, ['id', 'subscriptionId']),
    });
  };

  return {
    list: listSubscriptions,
    add: addSubscription,
    update: updateSubscription,
  };
};

export default Subscriptions;
