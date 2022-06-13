import Blixo from '../../lib/blixo';

const blixo = Blixo({ 
  apiKey: '',
  mode: ''
});

blixo.invoices.list({
  page: 1,
  perPage: 10,
}).then(res => {
  const { response, errors } = res;
});