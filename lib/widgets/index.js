class Widget {
  constructor(configs) {
    this.configs = configs;
  }

  initalise() {
    const container = document.createElement('div');

  }

  render() {
    const htmlTemplate = `
      <div>
        <h1>Hello world</h1>
      </div>
    `
    return htmlTemplate;
  }
}

const DEFAULT_CONFIGS = {
  containerId: 'subscription-widget'
}

const renderWidthget = (configs) => {
  const render = () => {
    const htmlTemplate = `
      <div >

      </div>
    `
    return htmlTemplate;
  }

  const initialise = () => {
    const containerId = _.get(configs, 'containerId', 'subscription-widget');
    const wrapper = document.getElementById(containerId)
    const compliedTemplate = render();
    wrapper.innerHTML = compliedTemplate;

    const button = document.getElementById('click');

    button.addEventListener('click', function () {
      console.log('click');
    })
  }


  return {
    render,
    initialise
  }
}

export default {
  renderWidthget,
  widget: Widget
}
