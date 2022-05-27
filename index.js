import Blixo from "./lib/blixo";

console.log('Blixo SDK');

const blixo = Blixo({ publicKey: 'if4YqCdSx9@LlseziQF7VmD98Un9b'});

// blixo.invoices.list({
//   page: 1,
//   perPage: 10,
//   paymentStatus: ['OUTSTANDING'],
// }).then(res => {
//   const { response, errors } = res;

//   if (errors) {
//     return;
//   }

//   console.log('LIST ITEMS success', response.data.length);
// })


// blixo.items.add().then(res => {
//   console.log('ADD ITEMS success', res);
// })

export default Blixo;

