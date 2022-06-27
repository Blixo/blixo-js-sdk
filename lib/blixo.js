import _ from "lodash";
import Addons from "./addons";
import Customers from "./customers";
import Invoices from "./invoices";
import Items from "./items";
import Shopify from "./shopify";
import Subscriptions from "./subscriptions";
import Widgets from "./widgets";
import Config from "./Config";

const Blixo = ({ apiKey, mode } = {}) => {
  const configs = {
    apiKey,
    mode,
  };
  Config.set("apiKey", apiKey);
  Config.set("mode", mode);
  return {
    addons: Addons(configs),
    customers: Customers(configs),
    invoices: Invoices(configs),
    items: Items(configs),
    shopify: Shopify(configs),
    subscriptions: Subscriptions(configs),
    widgets: Widgets(configs),
  };
};

export default Blixo;
