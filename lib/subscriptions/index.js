import { getAuthentication, getRequestInfo, request } from '../utils';
import _ from 'lodash';

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
  cancel: {
    url: 'subscriptions/${subscriptionId}/cancel',
    method: 'PATCH',
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
      data: body,
    });
  };

  const updateSubscription = async (body) => {
    const id = _.get(body, 'id', _.get(body, 'subscriptionId'));

    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.update, { subscriptionId: id }),
      data: _.omit(body, ['id', 'subscriptionId']),
    });
  };

  const cancelSubscription = async (subscriptionId, payload) => {
    // const id = _.get(body, 'id', _.get(body, 'subscriptionId'));
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.cancel, { subscriptionId }),
      data: {
        cancelNow: _.get(payload, 'cancelNow', 0)
      }
    });
  }

  return {
    list: listSubscriptions,
    add: addSubscription,
    update: updateSubscription,
    cancel: cancelSubscription,
  };
};

export default Subscriptions;
