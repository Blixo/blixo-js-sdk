import _ from 'lodash'

const DEFAULT_CONFIGS = {
  containerId: 'subscription-widget',
}

const Subscriptions = () => {
  const render = (options = {}) => {
    const { purchaseOptions = {}, translations = {} } = options
    const {
      defaultSelectdOption,
      purchaseOptionOrder,
      autoInject,
      oneTimeVerbiage = '',
      subscriptionVerbiage = '',
      saveButtonVerbiage,
      deliveryEveryVerbiage,
      changeEveryVerbiage,
      deliveryDropdownLabel,
      fontColor,
      selectionBackgroundColor,
      selectionTextColor,
    } = purchaseOptions

    const { month } = translations

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
        <div class="blixo-type blixo-type-subscription ${
          isSubscriptionSelected ? 'blixo-type-active' : ''
        }">
          <input
            class="blixo-type-input"
            name="purchase-type"
            type="radio"
            value="subscription"
            id="subscription"
            checked=${isSubscriptionSelected}
          />
          <label for="subscription">
            ${subscriptionVerbiage}
            <p>Delivery every: 1 ${month}</p>
          </label>
        </div>
        <div class="blixo-type blixo-type-onetime ${
          !isSubscriptionSelected ? 'blixo-type-active' : ''
        }">
          <input
            class="blixo-type-input"
            name="purchase-type"
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

  const initialise = (configs) => {
    const renderOptions = _.get(configs, 'renderOptions')
    const containerId = _.get(
      configs,
      'containerId',
      DEFAULT_CONFIGS.containerId,
    )
    const wrapper = document.getElementById(containerId)
    const compliedTemplate = render(renderOptions)
    wrapper.innerHTML = compliedTemplate
    addEvent(wrapper)
  }

  const addEvent = (wrapper) => {
    const inputs = (wrapper || document).getElementsByClassName(
      'blixo-type-input',
    )

    console.log('addEvent')
    for (let input of inputs) {
      input.addEventListener('click', function () {
        for (let input of inputs) {
          input.parentElement.classList.remove('blixo-type-active')
        }

        input.parentElement.classList.add('blixo-type-active')
      })
    }
  }

  const addToCart = () => {
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
      fetch(window.Shopify.routes.root + 'cart/add.js', {
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
  }
}

export default Subscriptions
