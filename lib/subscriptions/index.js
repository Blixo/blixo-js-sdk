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
  edit: {
    url: 'subscriptions/shopify',
    method: 'PUT',
  },
  shipNow: {
    url: 'subscriptions/shopify/shipNow',
    method: 'POST',
  },
  orderHistoies: {
    url: 'subscriptions/shopify/orderHistories',
    method: 'GET',
  },
  reactive: {
    url: 'subscriptions/${subscriptionId}/reactive',
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

  const editSubscription = async (body) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.edit),
      data: _.pick(body, [
        'subscriptionId',
        'variantTitle',
        'addons',
        'price',
        'fromPackNumber',
        'toPackNumber'
      ]),
    });
  };

  const shipNow = async (payload) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.shipNow),
      data: payload
    });
  }

  const orderHistories = async (params) => {
    return request({
      ...getAuthentication(configs),
      ...getRequestInfo(SUBSCRIPTIONS_CONFIGS.orderHistoies, {}, {
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
    reactActive: reactiveSubscription
  };
};

export default Subscriptions;
