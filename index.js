const csv = require('csv-parser')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const results = [], csvHeader = []
const myFile = 'sample_data/mixed_data.csv'
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

const filterEmpty = (entries) => {
  const emptyRows = [];
  const nonEmptyRows = [];
  entries.forEach(element => {
    if (isEmpty(element)) {
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
        isValidId(element)
        && isValidName(element)
        && isValidEmail(element)
        && isValidAddress(element)
        && isValidCountry(element)
        && isValidPostal(element)
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
    if (isGoodAddress(element)) {
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
    if (recognizedCountries.usa.includes(element.country)) {
      index = 'usa'
      //usa.push(element)
    } else if (recognizedCountries.canada.includes(element.country)) {
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

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .pipe(csv({skipHeader: false}))
      .on('headers', header => {
        header.forEach(element => {
          csvHeader.push({id:element, title:element})
        })
      })
      .on('data', (data) => results.push(data))
      .on('error', err => {
        console.log(err)
        reject(err)
      })
      .on('end', () => {
        //Filter empty from non-empty
        let errorFilter = filterEmpty(results)
        let errors = errorFilter[0], leftovers = errorFilter[1]

        //Filter valid from non-valid
        let validFilter = filterValid(leftovers)
        let valid = validFilter[0], invalid = validFilter[1]

        //Combine all errors into one array
        errors = [...errors, ...invalid]
        
        //Filter bad address from good address
        let addressFilter = filterAddress(valid)
        let good = addressFilter[0], badAddress = addressFilter[1]

        //Filter by country, combine results into one object
        let countryFilter = filterCountry(good)
        const filteredResults = Object.assign({errors:errors}, {bad_address:badAddress}, countryFilter)
        
        resolve(filteredResults)
      });
  })
}

getFile(myFile)
  .then (results => {
    let myPath = ''
    for (index in results) {
      if (results[index].length == 0) {
        console.log(index,'is empty. File was not created.')
      } else {
        //console.log(results[index])
        myPath = 'new_data/'+index.toLowerCase()+'.csv'
        const csvWriter = createCsvWriter({
          path: myPath,
          header: csvHeader
        });
        csvWriter
          .writeRecords(results[index])
          .then(() => {
            console.log('The CSV file was written successfully')
          });
      }
    }
  })
