// const { Pool } = require('pg');
// const ENV = process.env.NODE_ENV || 'development';

// require('dotenv').config({
//   path: `${__dirname}/../.env.${ENV}`,
// });

// if (!process.env.PGDATABASE) {
//   throw new Error('PGDATABASE not set');
// }
// console.log('PGDATABASE:', process.env.PGDATABASE);

// module.exports = new Pool();

const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

const database = process.env.NODE_ENV === 'test' 
  ? process.env.PGDATABASE_TEST 
  : process.env.PGDATABASE;

if (!database) {
  throw new Error('PGDATABASE not set');
}

console.log('PGDATABASE:', database);

module.exports = new Pool({
  database: database
});

