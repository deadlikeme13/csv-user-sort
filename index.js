const csv = require('csv-parser')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const filter = require('./filter')
const results = [], csvHeader = []
const myFile = './sample_data/mixed_data.csv'

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
        let errorFilter = filter.filterEmpty(results)
        let errors = errorFilter[0], leftovers = errorFilter[1]

        //Filter valid from non-valid
        let validFilter = filter.filterValid(leftovers)
        let valid = validFilter[0], invalid = validFilter[1]

        //Combine all errors into one array
        errors = [...errors, ...invalid]
        
        //Filter bad address from good address
        let addressFilter = filter.filterAddress(valid)
        let good = addressFilter[0], badAddress = addressFilter[1]

        //Filter by country, combine results into one object
        let countryFilter = filter.filterCountry(good)
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
        myPath = 'sorted_data/'+index.toLowerCase()+'.csv'
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