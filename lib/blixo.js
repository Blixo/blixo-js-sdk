import Addons from './addons';
import Config from './Config';
import Customers from './customers';
import Invoices from './invoices';
import Items from './items';
import Shopify from './shopify';
import Subscriptions from './subscriptions';
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
  return {
    addons: Addons(configs),
    customers: Customers(configs),
    invoices: Invoices(configs),
    items: Items(configs),
    shopify: Shopify(configs),
    subscriptions: Subscriptions(configs),
    widgets: Widgets(configs),
    helpers: {
      getCountryNameByCode,
      getStateByCountryCode,
      getStateCodeByName,
      getAllCountries,
      getAllStates,
      transformToShopifyAddress,
      transformToBlixoSubscriptionShippingAddress,
    },
  };
};

let apiKey = '';
const getApiKey = async () => {
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
  return apiKey;
};

let blixoSdk = null;
export const getBlixoSdk = async (options = {}) => {
  const { mode } = options;
  const apiKey = await getApiKey();
  if(!blixoSdk) {
    blixoSdk = Blixo({ mode, apiKey });
  }
  return blixoSdk;
};

export default Blixo;
