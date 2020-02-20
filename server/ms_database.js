const {Client} = require('pg');

//connect
const client = new Client({
    user: 'James',
    host: 'JamesUni',
    database: 'EcoChefDB',
    password: 'inse2cjames',
    port: 5432,

});

client.connect()
.then(() => console.log("Connection Established to Database"))
.catch(e => console.log)
.finally(() => client.end())

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