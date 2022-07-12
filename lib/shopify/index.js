// import { getAuthentication, getRequestInfo, request } from '../utils';
import _ from "lodash";
import Client from "shopify-buy";

import {
  getAuthentication,
  getRequestInfo,
  request,
  base64Url,
  getMode,
  // getHeaders,
  // getBaseURL,
  // getWebURL,
} from "../utils";

const checkoutRenderer = () => {
  let scriptEle = document.createElement("script");
  // const webUrl = getWebURL();
  // const webUrl = 'http://localhost:13000';
  const webUrl = 'https://blixo-develop.web.app';
  const urlObj = new URL(`/static/js/checkout_${getMode()}.js`, webUrl);
  const checkoutScript = urlObj.toString();

  scriptEle.setAttribute("src", checkoutScript);
  document.body.appendChild(scriptEle);
  scriptEle.addEventListener("load", () => {
    blixoCheckoutRenderer && blixoCheckoutRenderer();
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
};

const SHOPIFY_CONFIGS = {
  get: {
    url: "integrations/shopify/info",
    method: "GET",
    params: {
      page: 1,
      perPage: 10,
    },
  },
};

const Shopify = (configs) => {
  const getShopify = async () => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SHOPIFY_CONFIGS.get),
    });
  };

  const getBuyClient = async (params) => {
    const info = await getShopify();
    const domain = _.get(info, "response.data.domain");
    const accessToken = _.get(info, 'response.data.accessToken');
    localStorage.setItem('accessTokenBlixoInt', accessToken);
    localStorage.setItem('accessToken', accessToken);
    const storefrontAccessToken = _.get(
      info,
      "response.data.storefrontAccessToken"
    );
    const client = Client.buildClient(
      {
        domain,
        storefrontAccessToken,
      },
      fetch
    );

    const { config } = client;
    const url = `https://${config.domain}/api/${config.apiVersion}/graphql`;
    const storeOrigin = `https://${config.domain}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-shopify-storefront-access-token": `${config.storefrontAccessToken}`,
    };
    Object.assign(client, {
      query: async (query) => {
        const resData = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: `${query}` }),
        }).then((r) => r.json());
        return resData?.data;
      },
      mutation: async (query, variables) => {
        const url = `https://${config.domain}/api/${config.apiVersion}/graphql`;

        const resData = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: `${query}`, variables }),
        }).then((r) => r.json());
        return resData?.data;
      },
      fetch: async (endpoint) => {
        const resData = await fetch(`${storeOrigin}/${endpoint}`).then((res) =>
          res.json()
        );
        return resData;
      },
    });
    return client;
  };

  const checkout = async () => {
    const client = await getBuyClient();
    const { config } = client;
    const checkout = await client.checkout.create();
    const cartData = await client.fetch("cart.json");
    // const baseUrl = getBaseURL();
    // const webUrl = getWebURL();
    // const urlObj = new URL("/portal/checkout", webUrl);
    const webUrl = `https://${config.domain}`;
    const urlObj = new URL("/pages/checkout", webUrl);
    const items = cartData?.items || [];
    if (items.length) {
      const lineItems = items.map((item) => {
        return {
          variantId: btoa(`gid://shopify/ProductVariant/${item.variant_id}`),
          quantity: parseInt(item.quantity, 10),
          customAttributes: _.map(item.properties, (value, key) => {
            return { key, value }
          }),
        };
      });
      const data = await client.checkout.addLineItems(checkout.id, lineItems);
    }
    const checkout_token = base64Url.encode(`${checkout.id}`);
    urlObj.searchParams.set("checkout_token", checkout_token);
    urlObj.searchParams.set("store_name", config.domain);
    const checkoutUrl = urlObj.toString();
    // urlObj.searchParams.set("token", token)
    window.location.href = checkoutUrl;
    return checkoutUrl;
  };

  return {
    get: getShopify,
    checkout,
    checkoutRenderer,
  };
};

export default Shopify;
