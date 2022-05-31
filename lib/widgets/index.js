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

const INTERVAL_SINGLE_KEY_MAP = {
  days: 'days', // minimun day is 2
  weeks: 'week',
  months: 'month'
}

const SubscriptionWidget = (configs) => {
  const items = Items(configs);
  const shopify = Shopify(configs);

  const render = (options = {}, item) => {
    const { purchaseOptions = {}, translations = DEFAULT_TRANSLATIONS } = options
    const { id } = item
    const integrationsShopify = _.get(item, 'integrations.shopify', {})
    const { interval, intervalCount, productType } = integrationsShopify;

    // fallback for old product that doesn't support multiple intervals;
    const { intervals = [{ count: intervalCount, interval, }]} = integrationsShopify;

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


    const isSubscriptionSelected = defaultSelectdOption === 'subscription'

    const firstInterval = _.first(intervals);
    let firstSubscriptionDescription = '';

    const subscriptionOptions = _.map(intervals, ({ count, interval }, index) => {
      const intervalKey = count === 1 ? INTERVAL_SINGLE_KEY_MAP[interval] : interval;
      const subscriptionDescription = `${deliveryEveryVerbiage} ${count} ${_.get(
        translations,
        intervalKey,
      )}`

      if (index === 0) {
        firstSubscriptionDescription = subscriptionDescription;
      }

      return `
        <div class="blixo-type blixo-type-subscription ${
          isSubscriptionSelected && index === 0 ? 'blixo-type-active' : ''
        }">
          <input
            class="blixo-type-input"
            name="properties[purchaseType]"
            type="radio"
            value="subscription-${index}"
            id="subscription-${index}"
            data-count="${count}"
            data-interval="${interval}"
            data-description="${subscriptionDescription}"
            ${isSubscriptionSelected && index === 0? 'checked="checked"' : ''}
          />

          <label for="subscription-${index}">${subscriptionVerbiage}<p>${subscriptionDescription}</p>
          </label>
        </div>
      `;
    });

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

    let allOptions = [];
    if (productType === SHOPIFY_PRODUCT_TYPES.subscription) {
      allOptions = subscriptionOptions;
    } else if (productType === SHOPIFY_PRODUCT_TYPES.oneTimeAndSubscription) {
      if (purchaseOptionOrder === 'oneTime') {
        allOptions = [oneTimeOption, ...subscriptionOptions]
      } else {
        allOptions = [...subscriptionOptions, oneTimeOption]
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
        <input type="hidden" id="hidden-description" name="properties[description]" value="${firstSubscriptionDescription}" />
        <input type="hidden" id="hidden-count" name="properties[count]" value="${_.get(firstInterval, 'count')}" />
        <input type="hidden" id="hidden-interval" name="properties[interval]" value="${_.get(firstInterval, 'interval')}" />
        ${allOptions.join('')}
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

  const addEvent = (wrapper = document) => {
    const inputs = wrapper.getElementsByClassName(
      'blixo-type-input',
    )

    // hidden input to provide cart properties
    const inputCount = document.getElementById("hidden-count");
    const inputDescription = document.getElementById("hidden-description");
    const inputInterval = document.getElementById("hidden-interval");

    for (let input of inputs) {
      input.addEventListener('click', function () {
        for (let input of inputs) {
          input.parentElement.classList.remove('blixo-type-active')
        }

        input.parentElement.classList.add('blixo-type-active');
        inputCount.setAttribute('value', input.dataset.count);
        inputDescription.setAttribute('value', input.dataset.description);
        inputInterval.setAttribute('value', input.dataset.interval);
      })
    }
  }

  return {
    initialise,
  }
}

const Widgets = (configs) => {
  return {
    subscription: SubscriptionWidget(configs)
  }
}

export default Widgets;
