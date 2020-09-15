const validate = require('./validate')

const filterEmpty = (entries) => {
  const emptyRows = [];
  const nonEmptyRows = [];
  entries.forEach(element => {
    if (validate.isEmpty(element)) {
      emptyRows.push(element)
    } else {
      nonEmptyRows.push(element)
    }
  });
  return [emptyRows, nonEmptyRows]
}

const filterValid = (entries) => {
  const validRows = []
  const invalidRows = [];
  entries.forEach(element => {
    if (
      validate.isValidId(element)
        && validate.isValidName(element)
        && validate.isValidEmail(element)
        && validate.isValidAddress(element)
        && validate.isValidCountry(element)
        && validate.isValidPostal(element)
      ) {
      validRows.push(element)
    } else {
      invalidRows.push(element)
    }
  });
  return [validRows, invalidRows]
}

const filterAddress = (entries) => {
  const goodRows = []
  const badRows = [];
  entries.forEach(element => {
    if (validate.isGoodAddress(element)) {
      goodRows.push(element)
    } else {
      badRows.push(element)
    }
  });
  return [goodRows, badRows]
}

const filterCountry = (entries) => {
  
  const countryDictionary = {}
  let index = ''

  entries.forEach(element => {
    if (validate.recognizedCountries.usa.includes(element.country)) {
      index = 'usa'
      //usa.push(element)
    } else if (validate.recognizedCountries.canada.includes(element.country)) {
      index = 'canada'
      //canada.push(element)
    } else {
      index = element.country
      //otherCountries.push(element)
    }

    if (!(index in countryDictionary)) {
      countryDictionary[index] = []
    }

    countryDictionary[index].push(element)
  })

  return countryDictionary
}

module.exports = { filterEmpty, filterValid, filterAddress, filterCountry }