import _ from 'lodash';
import Addons from './addons';
import Config from './Config';
import Customers from './customers';
import Invoices from './invoices';
import Items from './items';
import Shopify from './shopify';
import Subscriptions from './subscriptions';
import SubscriptionContracts from './subscriptionContracts';
import Widgets from './widgets';
import { 
  getCountryNameByCode,
  getStateByCountryCode,
  getStateCodeByName,
  getAllCountries,
  getAllStates,
  transformToShopifyAddress,
  transformToBlixoSubscriptionShippingAddress,
} from './helpers';

import {
  getBaseURL
} from './utils';

const Blixo = ({ apiKey, mode } = {}) => {
  const configs = {
    apiKey,
    mode,
  };
  apiKey && Config.set('apiKey', apiKey);
  mode && Config.set('mode', mode);
  const sdk = {
    addons: Addons(configs),
    customers: Customers(configs),
    products: {
      data: null,
      list: async () => {
        if(!sdk.products.data) {
          try {
            const shopUrl = sdk.helpers.getShopUrl('/products.json?limit=250');
            const response = shopUrl && await fetch(shopUrl);
            const products = _.get(await response.json(), 'products');
            sdk.products.data = products;
            sdk.products.dataMap = _.keyBy(products, 'id');
          } catch(err) {}
        }
        return sdk.products.data;
      },
      get: (id) => {
        return _.get(sdk.products.dataMap, id);
      }
    },
    customer: {
      data: null,
      get: async () => {
        if(!sdk.customer.data && _.get(window, '__st.cid')) {
          try {
            const shopUrl = sdk.helpers.getShopUrl('/admin/users/current.json');
            const response = shopUrl && await fetch(shopUrl);
            const customerData = _.get(await response.json(), 'user');
            sdk.customer.data = customerData;
          } catch(err) {}
        }
        return sdk.customer.data;
      },
      id: () => {
        // return _.get(sdk, 'customer.data.id') || _.get(window, '__st.cid') || _.get(window, 'blixoPageContext.customer_id');
        return _.get(window, 'blixoPageContext.customer_id') || _.get(sdk, 'customer.data.id') || _.get(window, '__st.cid');
      },
      uniqToken: () => {
        try {
          return ShopifyAnalytics.lib.user().traits().uniqToken;
        } catch(err) {}
      }
    },
    invoices: Invoices(configs),
    items: Items(configs),
    shopify: Shopify(configs),
    subscriptions: Subscriptions(configs),
    subscriptionContracts: SubscriptionContracts(configs),
    widgets: Widgets(configs),
    helpers: {
      getCountryNameByCode,
      getStateByCountryCode,
      getStateCodeByName,
      getAllCountries,
      getAllStates,
      transformToShopifyAddress,
      transformToBlixoSubscriptionShippingAddress,
      getShopUrl: (path) => {
        const shop = _.get(window, 'Shopify.shop');
        if(shop) {
          return `https://${shop}${path ? path : ''}`;
        }
      },
    },
  };
  return sdk;
};

let apiKey = '';
const getApiKey = async () => {
  apiKey = _.get(window, 'blixoPageContext.api_key');
  if(!apiKey) {
    try {
      let baseUrl = getBaseURL();
      const apiUrl = `${baseUrl}/apiKeys/storefront`;
      const response = await fetch(apiUrl, { method: 'POST' });
      const data = await response.json();
      apiKey = data.apiKey;
    } catch(err) {
      console.log(err);
    }
  }
  return _.get(window, 'blixoPageContext.api_key') || apiKey;
};

let blixoSdk = null;
export const getBlixoSdk = async (options = {}) => {
  const { mode } = options;
  const apiKey = await getApiKey();
  if(!blixoSdk) {
    blixoSdk = Blixo({ mode, apiKey });
  }
  // init data
  await blixoSdk.customer.get();
  return blixoSdk;
};

export default Blixo;
