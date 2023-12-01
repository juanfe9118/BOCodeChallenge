import postgresql from 'pg'

const { Pool } = postgresql

export default (callback = null) => {
  const pool = new Pool({
    user: process.env.DB_USER ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgis',
    password: process.env.DB_PASSWORD ?? '',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
  })

  const connection = {
    pool,
    query: (...args) => {
      return pool.connect().then((client) => {
        return client.query(...args).then((res) => {
          client.release()
          return res.rows
        })
      })
    },
  }

  process.postgresql = connection

  if (callback) {
    callback(connection)
  }

  return connection
}
