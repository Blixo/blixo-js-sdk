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