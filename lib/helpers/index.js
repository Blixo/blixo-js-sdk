import { allCountries } from 'country-region-data';
import _ from 'lodash';

const countryOptions = { 'US': 'United States', 'CA': 'Canada' }

/**
 * Get all countries
 * Returns:
 *    Object(<countryCode: String, countryName: String>)
*/
export const getAllCountries = () =>  {
  return _.reduce(allCountries, (obj, params) => {
    obj[params[1]] = params[0]
    return obj
  }, {});
}

/**
 * Get country name by code
 * Params:
 *    countryCode: String 
 * Returns:
 *    countryName: String
*/
export const getCountryNameByCode = (countryCode = '') => {
  const countries = getAllCountries();
  return _.get(countries, countryCode)
}

/**
 * Get all states that grouped by country code
 * Params:
 *    countryCode: String
 * Returns:
 *    Object(<countryCode: String, states: Array>)
*/
export const getAllStates = () => {
  return _.reduce(allCountries, (obj, params) => {
    obj[params[1]] = params[2]
    return obj
  }, {});
}


/**
 * Get state by country code
 * Params:
 *    countryCode: String
 * Returns:
 *    Object(<stateCode: String, stateName: String>) : List of states
*/
export const getStateByCountryCode = (countryCode = '') => {
  const allStates = getAllStates();
  const states = allStates ? allStates[countryCode] : []
  return states && states.reduce((acc, [ name, abrv ]) => {
    acc[abrv] = name
    return acc
  }, {})
}

/**
 * Get state by country code
 * Params:
 *    countryCode: String
 *    stateName: String
 * Returns:
 *    stateCode: String
*/
export const getStateCodeByName = (countryCode = '', stateName = '') => {
  const statesBelongToCountry = _.invert(getStateByCountryCode(countryCode));
  return _.get(statesBelongToCountry, stateName, '');
}

/**
 * Transform blixo address to shopify address
 * Params:
 *    blixoCustomer: Object
 * Returns:
 *    shopifyAddress: Object
*/
export const transformToShopifyAddress = (blixoAddress = {}) => {
  const attns = _.split(_.get(blixoAddress, 'attn', ''), ' ');
  const rtn = {
    id: _.get(blixoAddress, 'integrations.shopify.addressId'),
    name: blixoAddress.attn,
    first_name: _.first(attns) || '',
    last_name: _.last(attns) || '',
    address1: blixoAddress.address1,
    address2: blixoAddress.address2,
    city: blixoAddress.city,
    zip: blixoAddress.zipCode,
    province: '',
    province_code: '',
    country_code: '',
    country_name: '',
    country: '',
    phone: _.first(_.compact(_.get(blixoAddress, 'phones', []))) || '',
  };

  if (!_.isEmpty(_.get(blixoAddress, 'country'))) {
    const countryCode = _.get(blixoAddress, 'country', '');
    _.set(rtn, 'country_code', countryCode);
    
    const countryName = getCountryNameByCode(countryCode);
    _.set(rtn, 'country', countryName);
    _.set(rtn, 'country_name', countryName);

    if (countryCode === 'US') {
      const code = _.get(blixoAddress, 'state', '');
      _.set(rtn, 'province_code', code);
      _.set(rtn, 'province', _.get(getStateByCountryCode(countryCode), code, ''));
    } else {
      // for other countries, we have to get province code by its name
      const provinceCode = getStateCodeByName(countryCode, _.get(blixoAddress, 'state', ''));
      _.set(rtn, 'province_code', provinceCode);
      _.set(rtn, 'province', _.get(blixoAddress, 'state', ''));
    }
  }

  // console.log('transform to shopify address: ', rtn)
  return rtn;
}

/**
 * Sample Shopify Address
 * @param {Object} shopifyAddress {
    "address1": "1 Rue des Carrieres",
    "address2": "Suite 1234",
    "city": "Montreal",
    "country": "Canada",
    "country_code": "CA",
    "country_name": "Canada",
    "company": "Fancy Co.",
    "customer_id": {
      "id": 1073339470
    },
    "first_name": "Samuel",
    "id": 207119551,
    "last_name": "de Champlain",
    "name": "Samuel de Champlain",
    "phone": "819-555-5555",
    "province": "Quebec",
    "province_code": "QC",
    "zip": "G1R 4P5"
  }
  @returns {Object} blixoAddress
 */
export const transformToBlixoSubscriptionShippingAddress = (shopifyAddress = {}) => {
  const name = _.get(shopifyAddress, 'name', _.trim(`${_.get(shopifyAddress, 'first_name')} ${_.get(shopifyAddress, 'last_name')}`)) || '';
  const rtn = {
    attn: name,
    name,
    address1: _.get(shopifyAddress, 'address1', ''),
    address2: _.get(shopifyAddress, 'address2', ''),
    city: _.get(shopifyAddress, 'city', ''),
    zipCode: _.get(shopifyAddress, 'zip', ''),
    country: '',
    state: _.get(shopifyAddress, 'province', ''),
    phones: _.compact([_.get(shopifyAddress, 'phone', '')]),
  };

  if (!_.isEmpty(_.get(shopifyAddress, 'country'))) {
    // country code
    const countryCode = _.invert(countryOptions)[_.get(shopifyAddress, 'country')];
    _.set(rtn, 'country', countryCode);
    if (countryCode === 'US' && !_.isEmpty(shopifyAddress, 'province')) {
      // set state code for US only
      _.set(rtn, 'state', getStateCodeByName(countryCode, _.get(shopifyAddress, 'province', '')));
    }
  }

  // For case, edit subscription shipping address from Shopify
  if (!_.isEmpty(_.get(shopifyAddress, 'id'))) {
    _.set(rtn, 'integrations.shopify.addressId', String(_.get(shopifyAddress, 'id', '')));
  }

  // console.log('transform to blixo subscription shipping address', rtn)
  return rtn;
};
