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
    url: 'subscriptions/shopify',
    method: 'POST',
  },
  cancel: {
    url: 'subscriptions/${subscriptionId}/cancel',
    method: 'PATCH',
  },
  update: {
    url: 'subscriptions/${subscriptionId}',
    method: 'PATCH',
  },
  updateInterval: {
    url: 'subscriptions/shopify/updateInterval',
    method: 'POST',
  },
  delay: {
    url: 'subscriptions/shopify/delay',
    method: 'POST',
  },
  edit: {
    url: 'subscriptions/shopify',
    method: 'PUT',
  },
  shipNow: {
    url: 'subscriptions/shopify/shipNow',
    method: 'POST',
  },
  orderHistories: {
    url: 'subscriptions/shopify/orderHistories',
    method: 'GET',
  },
  reactive: {
    url: 'subscriptions/${subscriptionId}/reactive',
    method: 'PATCH',
  },
  updateAddress: {
    url: 'subscriptions/shopify/updateAddress',
    method: 'POST',
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

  const updateInterval = async (body) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.updateInterval),
      data: _.omit(body, ['id']),
    });
  };

  const delaySubscription = async (body) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.delay),
      data: _.pick(body, ['subscriptionId', 'interval', 'intervalCount']),
    });
  };

  const cancelSubscription = async (subscriptionId, payload) => {
    // const id = _.get(body, 'id', _.get(body, 'subscriptionId'));
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.cancel, { subscriptionId }),
      data: {
        cancelNow: _.get(payload, 'cancelNow', 0),
        notes: _.get(payload, 'notes', ''),
      }
    });
  }

  const editSubscription = async (body) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.edit),
      data: body,
    });
  };

  const shipNow = async (payload) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.shipNow),
      data: payload
    });
  }

  const updateAddress = async (payload) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.updateAddress),
      data: payload
    });
  }

  const orderHistories = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.orderHistories, {}, {
        params,
      }),
    });
  };

  const reactiveSubscription = async (subscriptionId) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.reactive, { subscriptionId }),
    });
  };


  return {
    list: listSubscriptions,
    add: addSubscription,
    update: updateSubscription,
    cancel: cancelSubscription,
    edit: editSubscription,
    shipNow,
    orderHistories,
    reactActive: reactiveSubscription,
    updateAddress,
    delay: delaySubscription,
    updateInterval: updateInterval,
  };
};

export default Subscriptions;
