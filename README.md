  # Blixo JS SDK
This repository contains the JS client library for the Blixo API.

## Prerequisite
- Node >= 12.13.0
- Use `yarn` or `npm` to install package

## Installation

We can install the package via our Git URL.

```
yarn add https://github.com/Blixo/blixo-js-sdk.git
```

## Usage

First, you must instantiate a new Blixo Client

```
import Blixo from "blixo-js-sdk";

const blixo = Blixo({ 
  apiKey: '<YOUR_BLIXO_API_KEY>', 
  mode: '<ENVIRONMENT>'
});

```

* **apiKey**: you can go to `Blixo > Settings > API Keys` to generate a new API Key for your own.

* **mode**: we're supporting a few modes such as `local`, `development`, `staging`, and `production`. They're corresponding with our server environment. You can choose one of these options to use.

Then, API calls can be made like this:

```
blixo.customers.list({
  page: 1,
  perPage: 10,
}).then(res => {
  const { response, errors } = res;
});
```

## List of supported APIs
- **customers**
  - get list of customers
    ```
      blixo.customers.list({
        page: 1,
        perPage: 10,
      }).then(res => {
        const { response, errors } = res;
      });
    ```
  - get customer by Blixo's customer ID
    ```
    blixo.customers.get({
      customerId: '<blixo-customer-id>'
    }).then(res => {
      const { response, errors } = res;
    });
    ```
  - get customer by Shopify's customer ID
    ```
    blixo.customers.get({
      customerId: '<shopify-customer-id>',
      provider: 'shopify'
    }).then(res => {
      const { response, errors } = res;
    });
    ```
- **items / products**
  - get list of items/products
    ```
    blixo.items.list({
      page: 1,
      perPage: 10,
    }).then(res => {
      const { response, errors } = res;
    });
    ```
  - get item/product by Blixo's item ID
    ```
    blixo.items.get({
      itemId: '<blixo-item-id>',
    }).then(res => {
      const { response, errors } = res;
    });
    ```
  - get item/product by Shopify's product ID
    ```
    blixo.items.get({
      itemId: '<shopify-product-id>',
      provider: 'shopify'
    }).then(res => {
      const { response, errors } = res;
    });
    ```
- **subscriptions**
  - get list of subscriptions
    ```
      blixo.subscriptions.list({
        page: 1,
        perPage: 10,
      }).then(res => {
        const { response, errors } = res;
      });
    ```
  - get list of subscriptions by given Shopify's customer ID
    ```
      blixo.subscriptions.list({
        page: 1,
        perPage: 10,
        provider: 'shopify',
        customerId: '<shopify-customer-id>'
      }).then(res => {
        const { response, errors } = res;
      });
    ```
- **addons**
  - get list of addons
    ```
      blixo.addons.list({
        page: 1,
        perPage: 10,
      }).then(res => {
        const { response, errors } = res;
      });
    ```
- **invoices**
  - get list of invoices
    ```
    blixo.invoices.list({
      page: 1,
      perPage: 10,
    }).then(res => {
      const { response, errors } = res;
    });
    ```