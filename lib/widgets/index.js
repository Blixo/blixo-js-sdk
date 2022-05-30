import _ from 'lodash'
import { SHOPIFY_PRODUCT_TYPES } from '../constants'
import Items from '../Items'
import Shopify from '../shopify'

const DEFAULT_CONFIGS = {
  containerId: 'subscription-widget',
}

const DEFAULT_TRANSLATIONS = {
  days: 'Days',
  week: 'Week',
  weeks: 'Weeks',
  month: 'Month',
  months: 'Months',
}

const SubscriptionWidget = (configs) => {
  const items = Items(configs);
  const shopify = Shopify(configs);

  const render = (options = {}, item) => {
    const { purchaseOptions = {}, translations = DEFAULT_TRANSLATIONS } = options
    const { id } = item
    const integrationsShopify = _.get(item, 'integrations.shopify', {})
    const { interval, intervalCount, productType } = integrationsShopify;

    const {
      defaultSelectdOption = 'subscription',
      purchaseOptionOrder = 'oneTime',
      autoInject,
      oneTimeVerbiage = 'One time',
      subscriptionVerbiage = 'Subscribe',
      saveButtonVerbiage,
      deliveryEveryVerbiage = 'Delivery Every',
      changeEveryVerbiage,
      deliveryDropdownLabel,
      fontColor = '#000000',
      selectionBackgroundColor = '#efefef',
      selectionTextColor = '#000000',
    } = purchaseOptions

    const subscriptionDescription = `${deliveryEveryVerbiage} ${intervalCount} ${_.get(
      translations,
      interval,
    )}`

    const isSubscriptionSelected = defaultSelectdOption === 'subscription'

    const subscriptionOption = `
      <div class="blixo-type blixo-type-subscription ${
        isSubscriptionSelected ? 'blixo-type-active' : ''
      }">
        <input
          class="blixo-type-input"
          name="properties[purchaseType]"
          type="radio"
          value="subscription"
          id="subscription"
          ${isSubscriptionSelected ? 'checked="checked"' : ''}
        />

        <label for="subscription">${subscriptionVerbiage}<p>${subscriptionDescription}</p>
        </label>
      </div>
    `

    const oneTimeOption = `
      <div class="blixo-type blixo-type-oneTime ${
        !isSubscriptionSelected ? 'blixo-type-active' : ''
      }">
        <input
          class="blixo-type-input"
          name="properties[purchaseType]"
          type="radio"
          value="oneTime"
          id="oneTime"
          ${!isSubscriptionSelected ? 'checked="checked"' : ''}
        />
        <label for="oneTime">${oneTimeVerbiage}</label>
      </div>
    `

    let subscriptionOptions = [];
    if (productType === SHOPIFY_PRODUCT_TYPES.subscription) {
      subscriptionOptions = [subscriptionOption]
    } else if (productType === SHOPIFY_PRODUCT_TYPES.oneTimeAndSubscription) {
      if (purchaseOptionOrder === 'oneTime') {
        subscriptionOptions = [oneTimeOption, subscriptionOption]
      } else {
        subscriptionOptions = [subscriptionOption, oneTimeOption]
      }
    } else {
      return '';
    }

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
        <input type="hidden" name="properties[description]" value="${subscriptionDescription}" />
        ${subscriptionOptions.join('')}
      </div>
    `
    return htmlTemplate
  }

  const initialise = async (configs) => {
    const productId = _.get(configs, 'productId')
    const { response, errors } = await items.getItemByProductId(productId);

    if (errors) {
      throw new Error(_.get(errors, 'messages'));
    }

    const item = _.get(response, 'data');
    const intergrationShopify = _.get(item, 'integrations.shopify', {})
    const productType = _.get(intergrationShopify, 'productType')

    if (
      productType === SHOPIFY_PRODUCT_TYPES.inactive ||
      productType === SHOPIFY_PRODUCT_TYPES.prePaidSubscription
    ) {
      return
    }

    const { response: shopifyResponse, errors: shopifyErrors } = await shopify.get();
    const renderOptions = _.get(shopifyResponse, 'data.settings.subscriptionWidget');

    if (shopifyErrors) {
      throw new Error(_.get(shopifyErrors, 'messages'));
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
    const inputs = (wrapper || document).getElementsByClassName(
      'blixo-type-input',
    )

    for (let input of inputs) {
      input.addEventListener('click', function () {
        for (let input of inputs) {
          input.parentElement.classList.remove('blixo-type-active')
        }

        input.parentElement.classList.add('blixo-type-active')
      })
    }
  }

  return {
    render,
    initialise,
  }
}

const Widgets = (configs) => {
  return {
    subscription: SubscriptionWidget(configs)
  }
}

export default Widgets;
