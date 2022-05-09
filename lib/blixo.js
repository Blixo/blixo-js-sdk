import axios from "axios";
import _ from 'lodash';
import Items from './Items';
import subscriptions from "./subscriptions";

const Blixo = ({ publicKey } = {}) => {


  return {
    items: Items,
    widgets: {
      subscriptions
    },
  }
}

export default Blixo
