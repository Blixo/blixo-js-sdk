import axios from "axios";
import _ from 'lodash';
import Addons from "./addOns";
import Customers from "./customers";
import Invoices from "./invoices";
import Items from './Items';
import Subscriptions from "./subscriptions";
import Widgets from "./widgets";

const Blixo = ({ publicKey } = {}) => {
  const configs = {
    publicKey
  }
  return {
    addons: Addons(configs),
    customers: Customers(configs),
    invoices: Invoices(configs),
    items: Items(configs),
    subscriptions: Subscriptions(configs),
    widgets: Widgets(configs),
  }
}

export default Blixo
