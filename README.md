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
blixo.invoices.list({
  page: 1,
  perPage: 10,
}).then(res => {
  const { response, errors } = res;
});
```

## List of supported APIs
- customers
  - list customers
    ```
      blixo.customers.list({
        page: 1,
        perPage: 10,
      }).then(res => {
        const { response, errors } = res;
      });
    ```
  - getCustomerByShopifyCustomerId
    ```
    blixo.customers.getCustomerByShopifyCustomerId(shopifyCustomerId).then(res => {
      const { response, errors } = res;
    });
    ```
- items
  - list items
    ```
    blixo.items.list({
      page: 1,
      perPage: 10,
    }).then(res => {
      const { response, errors } = res;
    });
    ```
  - getItemByProductId
    ```
    blixo.items.getItemByProductId(productId).then(res => {
      const { response, errors } = res;
    });
    ```
- invoices
  - list invoices
    ```
    blixo.invoices.list({
      page: 1,
      perPage: 10,
    }).then(res => {
      const { response, errors } = res;
    });
    ```
- subscriptions
  - list subscriptions
    ```
      blixo.subscriptions.list({
        page: 1,
        perPage: 10,
      }).then(res => {
        const { response, errors } = res;
      });
    ```
- addons
  - list addons
    ```
      blixo.addons.list({
        page: 1,
        perPage: 10,
      }).then(res => {
        const { response, errors } = res;
      });
    ```