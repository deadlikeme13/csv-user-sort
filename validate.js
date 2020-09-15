const recognizedCountries = {
  usa: ['US','USA'],
  canada: ['CA','CAN']
}

const isEmpty = (row) => {
  for (const [key, value] of Object.entries(row)) {
    if (value == "") {
      return true
    }
  }
  return false
}

const isValidId = (row) => {
  if (row.id.match(/^[0-9]{1,6}$/)) { 
    return true
  }
  return false
}

const isValidName = (row) => {
  if (row.first_name.match(/^[A-Za-z]{2,}$/) && row.last_name.match(/^[A-Za-z]{2,}$/)) { 
    return true
  }
  return false
}

const isValidEmail = (row) => {
  if (row.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) { 
    return true
  }
  return false
}

const isValidAddress = (row) => {
  if (row.address.match(/^((\w)(\s+(\w+)){0,4}){2,}$/)) { 
    return true
  }
  return false
}

const isValidCountry = (row) => {
  if (row.country.match(/^[A-Z]{2,3}$/)) { 
    return true
  }
  return false
}

const isValidPostal = (row) => {
  if (row.postal.match(/^([A-Z0-9\-\s]){4,8}$/)) {
    return true
  }
  return false
}

const isGoodAddress = (row) => {
  if ((!recognizedCountries.usa.includes(row.country)) && (!recognizedCountries.canada.includes(row.country))) {
    return true
  } else if ((row.country.match(recognizedCountries.canada.key)) && (row.postal.match(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/))) {
    return true
  } else if ((row.country.match(recognizedCountries.usa.key)) && (row.postal.match(/^\d{5}$/))) {
    return true
  }
  return false
}

module.exports = { recognizedCountries, isEmpty, isValidId, isValidName, isValidEmail, isValidAddress, isValidCountry, isValidPostal, isGoodAddress }