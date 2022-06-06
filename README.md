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

const blixo = Blixo({ apiKey: '<YOUR_BLIXO_API_KEY>'});

```

To obtain API Key, you can go to `Blixo > Settings > API Keys` to generate a new one for your own.

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
- addons
- customers
- invoices
- items
- subscriptions