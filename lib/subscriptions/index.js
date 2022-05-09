const DEFAULT_CONFIGS = {
  containerId: 'subscription-widget',
}

const Subscriptions = () => {
  const render = () => {
    const htmlTemplate = `
      <style>
        .blixo-type {
          padding: 8px;
        }
        .blixo-type-active {
          background: #efefef;
        }
      </style>
      <div>
        <div class="blixo-type blixo-type-subscription blixo-type-active">
          <input
            class="blixo-type-input"
            name="purchase-type"
            type="radio"
            value="subscription"
            id="subscription"
            checked
          />
          <label for="subscription">Subscription</label>
          <div>Description</div>
        </div>
        <div class="blixo-type blixo-type-onetime">
          <input
            class="blixo-type-input"
            name="purchase-type"
            type="radio"
            value="onetime"
            id="onetime"
          />
          <label for="onetime">One-time purchse</label>
        </div>
      </div>
    `
    return htmlTemplate
  }

  const initialise = (configs) => {
    const containerId = _.get(
      configs,
      'containerId',
      DEFAULT_CONFIGS.containerId,
    )
    const wrapper = document.getElementById(containerId)
    const compliedTemplate = render()
    wrapper.innerHTML = compliedTemplate
    wrapper
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

  return {
    render,
    initialise,
  }
}

export default Subscriptions
