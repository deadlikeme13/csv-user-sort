# csv-user-sort

Take a .csv file and sort each user in the file based on their address and create a file for each unique country.

The headers for the file should be:
id, first_name, last_name, email, address, country, postal

Columns data follows the following rules:
- id - integer between 1-999999
- first_name and last_name - string at least 2 characters long, letters only (non numbers, no spaces)
- email - valid email string (any characters)
- address - string at least 2 characters long (containing number/letters/spaces, up to 5 words)
- country - string 2-3 characters long, capitals only
- postal - string between 4-8 characters, uppercase letters only

If any column is missing or does not contain valid data that record is placed in the errors.csv file:

If postal code does not match country that record is placed in the bad_address.csv file:
- US = 12345
- CND = A1A 1A1 || A1A1A1 || A1A-1A1
- Other countries = any valid postal should be accepted
