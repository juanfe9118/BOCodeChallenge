import { Router } from 'express'

const routes = Router()

routes.get('/users-by-kms', async (req, res) => {
  try {
    const { lat, long, kms } = req.query
    const latFloat = parseFloat(lat)
    const longFloat = parseFloat(long)
    const queryStr = `SELECT 
      id, username, latitude, longitude,
      (ROUND(earth_distance(ll_to_earth(${latFloat}, ${longFloat}), ll_to_earth(latitude, longitude))::NUMERIC, 2) / 1000) AS distance
    FROM
      users
    WHERE
      earth_box(ll_to_earth(${latFloat}, ${longFloat}), ${kms} * 1000) @> ll_to_earth(latitude, longitude)
    AND
      earth_distance(ll_to_earth(${latFloat}, ${longFloat}), ll_to_earth(latitude, longitude)) <= ${kms} * 1000.0
    ORDER BY distance;`
    const rows = await process.postgresql.query(queryStr);
    res.json({success: true, data: rows})
  } catch (err) {
    console.error(err)
    res.status(500).json({success: false. err})
  }
})

routes.post('/user', async (req, res) => {
  try {
    const { username, lat, long } = req.body
    const WGS84 = 4326
    const latFloat = parseFloat(lat)
    const longFloat = parseFloat(long)
    const queryStr = `INSERT INTO users (username, latitude, longitude, location, created_at) VALUES (
      '${username}', ${latFloat}, ${longFloat}, ST_SetSRID(ST_MakePoint(${latFloat}, ${longFloat}), ${WGS84}), current_timestamp) ON CONFLICT DO NOTHING;`
    await process.postgresql.query(queryStr)
    res.json({success: true, data: "User created"})
  } catch (err) {
    console.error(err)
    res.status(500).json({success: false, err})
  }
})

export default routes