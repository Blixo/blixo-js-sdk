  # blixo-js-sdk
### To use Blixo SDK

1. Inport blixo from Blixo;
2. Init blixo instance with publicKey (from Blixo's settings on Blixo system)
3. Access model acc methods to get data


### Example
```
import Blixo from "blixo-js-sdk";

const blixo = Blixo({ publicKey: 'public key'});
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