import axios from "axios";
import _ from 'lodash';
import Addons from "./addOns";
import Customers from "./customers";
import Invoices from "./invoices";
import Items from "./items";
import Shopify from "./shopify";
import Subscriptions from "./subscriptions";
import Widgets from "./widgets";

const Blixo = ({ apiKey } = {}) => {
  const configs = {
    apiKey
  }
  return {
    addons: Addons(configs),
    customers: Customers(configs),
    invoices: Invoices(configs),
    items: Items(configs),
    shopify: Shopify(configs),
    subscriptions: Subscriptions(configs),
    widgets: Widgets(configs),
  }
}

export default Blixo
