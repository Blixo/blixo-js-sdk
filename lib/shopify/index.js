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

let _version = '';

const getVersionParam = async (webUrl) => {
  try {
    if(!_version) {
      _version = await fetch(`${webUrl}/version.txt`).then(res => res.text());
    }
    if(_version) return `?ver=${_version}`;
    return '';
  } catch (err) {}
  return '';
};

const getTemplateData = (selector) => {
  try {
    const script = document.querySelector(selector)
    return script && JSON.parse(script.innerHTML)
  } catch (e) {
    console.warn(e)
  }
}

const loadStoreData = () => {
  const customer = getTemplateData('#json-customer');
  window.shopifyCustomer = customer;
}

const checkoutRenderer = async () => {
  loadStoreData();
  let scriptEle = document.createElement("script");
  // const webUrl = 'http://localhost:13000';
  // const urlObj = new URL(`/static/js/bundle.js`, webUrl);
  const webUrl = 'https://blixo-develop.web.app';
  const urlObj = new URL(`/static/js/checkout_${getMode()}.js${await getVersionParam(webUrl)}`, webUrl);
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

const portalRenderer = async () => {
  loadStoreData();
  let scriptEle = document.createElement("script");
  const webUrl = 'http://localhost:13000';
  const urlObj = new URL(`/static/js/bundle.js`, webUrl);
  // const webUrl = 'https://blixo-develop.web.app';
  // const urlObj = new URL(`/static/js/checkout_${getMode()}.js${await getVersionParam(webUrl)}`, webUrl);
  const checkoutScript = urlObj.toString();

  scriptEle.setAttribute("src", checkoutScript);
  document.body.appendChild(scriptEle);
  scriptEle.addEventListener("load", () => {
    blixoPortalRenderer && blixoPortalRenderer();
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
};

const SHOPIFY_CONFIGS = {
  get: {
    url: "integrations/shopify/storeinfo",
    method: "GET",
    params: {
      page: 1,
      perPage: 10,
    },
  },
  findSellingPlan: {
    url: "integrations/shopify/findSellingPlan",
    method: 'POST',
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

  const findSellingPlan = async ({ variant_id, product_id, variant_title }) => {
    return request({
      // headers: getHeaders(),
      ...getAuthentication(configs),
      ...getRequestInfo(SHOPIFY_CONFIGS.findSellingPlan),
      data: { variant_id, product_id, variant_title }
    });
  };

  const getBuyClient = async (params) => {
    const info = await getShopify();
    const domain = _.get(info, "response.data.origin") || _.get(info, "response.data.domain");
    const accessToken = _.get(info, 'response.data.accessToken');
    const assets = _.get(info, 'response.data.assets');
    localStorage.setItem('assetsTags', JSON.stringify({ assets }));
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
        return _.get(resData, 'data');
      },
      mutation: async (query, variables) => {
        const url = `https://${config.domain}/api/${config.apiVersion}/graphql`;

        const resData = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: `${query}`, variables }),
        }).then((r) => r.json());
        return _.get(resData, 'data');
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

  const checkoutUrl = async () => {
    const client = await getBuyClient();
    const { config } = client;
    const checkout = await client.checkout.create();
    const cartData = await client.fetch("cart.json");
    // const baseUrl = getBaseURL();
    // const webUrl = getWebURL();
    // const urlObj = new URL("/portal/checkout", webUrl);
    const webUrl = `https://${config.domain}`;
    const urlObj = new URL("/pages/checkout", webUrl);
    const items = _.get(cartData, 'items') || [];
    if (items.length) {
      const lineItems = items.map((item) => {
        return {
          variantId: btoa(`gid://shopify/ProductVariant/${item.variant_id}`),
          quantity: parseInt(item.quantity, 10),
          customAttributes: _.map(item.properties, (value, key) => {
            return { key, value: `${value}` }
          }),
        };
      });
      const data = await client.checkout.addLineItems(checkout.id, lineItems);
    }
    const checkout_token = base64Url.encode(`${checkout.id}`);
    urlObj.searchParams.set("checkout_token", checkout_token);
    urlObj.searchParams.set("store_name", config.domain);
    const checkoutUrl = urlObj.toString();
    return checkoutUrl;
  };

  const checkout = async () => {
    const url = await checkoutUrl();

    window.location.href = url;
    return checkoutUrl;
  };

  const applySellingPlan = async (bundleItem, cartItems) => {
    const id = _.get(bundleItem, 'key')
    const { variant_id, product_id, variant_title } = bundleItem;
    const sellingPlanInfo = await findSellingPlan({ variant_id, product_id, variant_title });
    const selling_plan_gui = _.last(_.split(_.get(sellingPlanInfo, 'response.data'), '/'));
    const selling_plan = selling_plan_gui ? parseInt(selling_plan_gui) : selling_plan_gui;
    const lineIndex = _.findIndex(cartItems, item => item.key === id);
    const line = lineIndex + 1;
    if(selling_plan && line) {
      await fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          line,
          selling_plan,
          quantity: bundleItem.quantity,
        })
      }).then(response => response.json()).catch(error => {
        console.log('apply selling_plan error', error)
      });
    }
  }

  return {
    get: getShopify,
    checkout,
    checkoutUrl,
    checkoutRenderer,
    portalRenderer,
    findSellingPlan,
    applySellingPlan,
  };
};

export default Shopify;
