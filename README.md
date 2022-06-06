  # Blixo JS SDK
This repository contains the JS client library for the Blixo API.

## Prerequisite
- Node >= 12.13.0
- Use `yarn` or `npm` to install package

## Installation

We can install the package via our Git URL.

`yarn add https://github.com/Blixo/blixo-js-sdk.git`

## Usage

1. Inport blixo from Blixo;
2. Init blixo instance with apiKey (from Blixo's settings on Blixo system)
3. Access model acc methods to get data


### Example
```
import Blixo from "blixo-js-sdk";

const blixo = Blixo({ apiKey: 'API Key'});

blixo.invoices.list({
  page: 1,
  perPage: 10,
}).then(res => {
  const { response, errors } = res;
})
```

List model
- addons
- customers
- invoices
- items
- subscriptions