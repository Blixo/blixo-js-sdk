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
} from './helpers';

const Blixo = ({ apiKey, mode } = {}) => {
  const configs = {
    apiKey,
    mode,
  };
  Config.set('apiKey', apiKey);
  Config.set('mode', mode);
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
    }
  };
};

export default Blixo;
