const {Client} = require('pg');
const connectionString = 'postgresql://james:inse2c@localhost:5432/ecochefdb'
//connect
const client = new Client({
   connectionString
});

client.connect()
.then(() => console.log("Connection Established to Database"))
.catch(e => console.log(e))
.finally(() => client.end());

 /* const { Client } = require('pg');

//Connect
const client = new Client({
    user: 'James',
    host: 'http://127.0.0.1//',
    database: 'EcoChefDB',
    password: 'inse2cjames',
    port: 5432,
  })
client.connect();


// Testing with a current time query
client.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    client.end();
  })

  */