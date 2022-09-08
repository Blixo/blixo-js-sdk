import _ from 'lodash';
import { allCountries } from 'country-region-data';

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
    province: blixoAddress.state,
    province_code: blixoAddress.state,
    country_code: blixoAddress.country,
    country_name: getCountryNameByCode(blixoAddress.country),
    country: getCountryNameByCode(blixoAddress.country),
    phone: _.first(_.compact(_.get(blixoAddress, 'phones', []))) || '',
  };

  if (blixoAddress.country === 'US') {
    _.set(
        rtn,
        'province', 
      _.get(getStateByCountryCode(blixoAddress.country), blixoAddress.state, '')
    );
  } else {
    _.set(
      rtn, 
      'province_code',
      getStateCodeByName(blixoAddress.country, blixoAddress.state)
    );
  }
  return rtn;
}
