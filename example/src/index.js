import Blixo from '../../lib/blixo';

const blixo = Blixo({ apiKey: '<YOUR_BLIX_API_KEY>' });

blixo.invoices.list({
  page: 1,
  perPage: 10,
}).then(res => {
  const { response, errors } = res;
});