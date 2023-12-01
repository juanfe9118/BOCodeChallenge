import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './api/routes.mjs'
import postgresql from './db/postgresql.mjs'
import 'dotenv/config'

const app = express()

app.disable('x-powered-by')

const port = process.env.APP_PORT ?? 8080

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors())

app.use('/api/v1', routes)

//Get database ready and table created
postgresql(async (connection) => {
  try {
    await connection.query(`CREATE EXTENSION postgis;`)
  } catch (err) {
    console.info('Postgis is already installed')
  }

  try {
    await connection.query(`CREATE EXTENSION cube;`)
  } 
  catch (err) {
    console.info('Cube is already installed')
  }

  try {
    await connection.query(`CREATE EXTENSION earthdistance;`)
  } catch (err) {
    console.info('Earthdistance is already installed')
  }

  await connection.query(`CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    location GEOMETRY NOT NULL,
    created_at TIMESTAMP NOT NULL
    );`)
})

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`)
})
