import _ from 'lodash'
import { SHOPIFY_PRODUCT_TYPES } from '../constants'
import { getItemByProductId } from '../Items'

const DEFAULT_CONFIGS = {
  containerId: 'subscription-widget',
}

const Subscriptions = () => {
  const render = (options = {}, item) => {
    const { purchaseOptions = {}, translations = {} } = options
    const { id } = item;
    const {
      defaultSelectdOption = 'subscription',
      purchaseOptionOrder,
      autoInject,
      oneTimeVerbiage = 'One time',
      subscriptionVerbiage = 'Subscribe',
      saveButtonVerbiage,
      deliveryEveryVerbiage,
      changeEveryVerbiage,
      deliveryDropdownLabel,
      fontColor = '#000000',
      selectionBackgroundColor = '#efefef',
      selectionTextColor = '#000000',
    } = purchaseOptions

    const { month = 'month' } = translations

    const isSubscriptionSelected = defaultSelectdOption === 'subscription'

    const htmlTemplate = `
      <style>
        .blixo-type {
          padding: 8px;
          color: ${fontColor}
        }
        .blixo-type-active {
          background: ${selectionBackgroundColor};
          color: ${selectionTextColor}
        }
      </style>
      <div>
        <input type="hidden" name="properties[itemId]" value="${id}" />

        <div class="blixo-type blixo-type-subscription ${
          isSubscriptionSelected ? 'blixo-type-active' : ''
        }">
          <input
            class="blixo-type-input"
            name="properties[purchaseType]"
            type="radio"
            value="subscription"
            id="subscription"
            checked=${isSubscriptionSelected}
          />

          <label for="subscription">${subscriptionVerbiage}<p>Delivery every: 1 ${month}</p>
          </label>
        </div>
        <div class="blixo-type blixo-type-onetime ${
          !isSubscriptionSelected ? 'blixo-type-active' : ''
        }">
          <input
            class="blixo-type-input"
            name="properties[purchaseType]"
            type="radio"
            value="onetime"
            id="onetime"
            checked=${!isSubscriptionSelected}
          />
          <label for="onetime">${oneTimeVerbiage}</label>
        </div>
      </div>
    `
    return htmlTemplate
  }

  const haveSubscription = () => {
    fetch('/products/red-rain-coat.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updates: {
          [variantId]: 99,
        },
      }),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  const initialise = async (configs) => {
    const renderOptions = _.get(configs, 'renderOptions');
    const productId = _.get(configs, 'productId');
    console.log('initial');
    const { response, errors } = await getItemByProductId(4815494807684); //hardcoding id

    if (errors) {
      return;
    }

    const item = _.get(response, 'data')
    const shopify = _.get(item, 'integrations.shopify', {})
    const productType = _.get(shopify, 'productType');
    console.log('productType', productType);

    if (productType === SHOPIFY_PRODUCT_TYPES.inactive || productType === SHOPIFY_PRODUCT_TYPES.prePaidSubscription) {
      return;
    }
    const containerId = _.get(
      configs,
      'containerId',
      DEFAULT_CONFIGS.containerId,
    )
    const wrapper = document.getElementById(containerId)
    const compliedTemplate = render(renderOptions, item)
    wrapper.innerHTML = compliedTemplate
    addEvent(wrapper)
  }

  const addEvent = (wrapper) => {
    const inputs = document.getElementsByClassName(
      'blixo-type-input',
    )

    console.log('addEvent')
    for (let input of inputs) {
      console.log('input')
      input.addEventListener('click', function () {
        console.log('click')
        for (let input of inputs) {
          input.parentElement.classList.remove('blixo-type-active')
        }

        input.parentElement.classList.add('blixo-type-active')
      })
    }
  }

  const updateCart = (variantId) => {
    fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updates: {
          [variantId]: 99,
        },
      }),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const addCart = (variantId) => {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          quanlity: 1,
          id: variantId,
          properties: {
            subscription: true,
            test: 'hello'
          }
        }],
      }),
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const addToCart = (Shopify) => {
    if (!Shopify) {
      return
    }

    const button = document.getElementById('test-button')
    console.log('add button event')
    button.addEventListener('click', function () {
      console.log('click button 1')
      let formData = {
        items: [
          {
            id: 36110175633573,
            quantity: 2,
          },
        ],
      }
      fetch(Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          console.log('res', response)
          return response.json()
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
  }

  return {
    render,
    initialise,
    addToCart,
    updateCart,
    addCart,
  }
}

export default Subscriptions
