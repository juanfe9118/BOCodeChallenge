import React, {useState, useEffect} from "react";
import instance from "../services/NetworkHelper";

const HomePage = () => {
  const [username, setUsername] = useState('')
  const [latitudeCreate, setLatitudeCreate] = useState('')
  const [longitudeCreate, setLongitudeCreate] = useState('')
  const [latitudeSearch, setLatitudeSearch] = useState('')
  const [longitudeSearch, setLongitudeSearch] = useState('')
  const [kmRadius, setKmRadius] = useState(0)
  const [data, setData] = useState([])
  const [response, setResponse] = useState('')
  const [validCreate, setValidCreate] = useState(false)
  const [validSearch, setValidSearch] = useState(false)
 
  const validateCoordinateCreate = () => {
    if (parseFloat(latitudeCreate) && parseFloat(longitudeCreate)) {
      setValidCreate(true)
    }
  }

  const validateCoordinateSearch = () => {
    if (parseFloat(latitudeSearch) && parseFloat(longitudeSearch)) {
      setValidSearch(true)
    }
  }

  useEffect(() => {
    async function createUser() {
      if (validCreate) {
        const res = await instance.post('/user', {username, lat: latitudeCreate, long: longitudeCreate})
        setResponse(res.data)
        setValidCreate(false)
      }
    }

    async function searchRadius() {
      if (validSearch) {
        const rows = await instance.get(`/users-by-kms?lat=${latitudeSearch}&long=${longitudeSearch}&kms=${kmRadius}`)
        console.log(rows)
        setData(rows.data.data)
        setValidSearch(false)
      }
    }
    createUser();
    searchRadius();
  }, [latitudeCreate, longitudeCreate, username, validCreate, kmRadius, latitudeSearch, longitudeSearch, validSearch])
  return(
    <div>
      <h1>People Locator</h1>
      <h4>This is a very basic app that allows you to create users with a location, and then retrieve all the users that are within a set radius in kilometers</h4>
      <div style={styles.container}>
        <div style={styles.subContainer}>
          <h5>Create User</h5>
          <p>Fill out the form below to create a new user, please include the location information.</p>
          <label style={styles.formField}>Username:
            <input 
              type="text"
              placeholder="eg: Mike Towers, mikeydawg24,etc"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label style={styles.formField}>Latitude:
            <input 
              type="text"
              value={latitudeCreate}
              onChange={(e) => setLatitudeCreate(e.target.value)}
            />
          </label>
          <label style={styles.formField}>Longitude:
            <input 
              type="text"
              value={longitudeCreate}
              onChange={(e) => setLongitudeCreate(e.target.value)}
            />
          </label>
          <button style={styles.button} onClick={()=>{validateCoordinateCreate()}}>Submit</button>
          {response && (
            <div>
              <p>{response.success ? "User created successfully" : "User could not be created check your information and try again"}</p>
           </div> 
          )}
        </div>
        <div style={styles.subContainer}>
          <h5>Find People Within a Radius</h5>
          <p>Fill out the form below to retrieve all the users within a specified radius from the point entered.</p>
          <label style={styles.formField}>Radius (in kilometers):
            <input 
              type="number"
              value={kmRadius}
              onChange={(e) => setKmRadius(e.target.value)}
            />
          </label>
          <label style={styles.formField}>Latitude:
            <input 
              type="text"
              value={latitudeSearch}
              onChange={(e) => setLatitudeSearch(e.target.value)}
            />
          </label>
          <label style={styles.formField}>Longitude:
            <input 
              type="text"
              value={longitudeSearch}
              onChange={(e) => setLongitudeSearch(e.target.value)}
            />
          </label>
          <button style={styles.button} onClick={()=>{validateCoordinateSearch()}}>Submit</button>
          {data.length > 0 && (
            <div>
              {data.map((person) => {
                return (
                  <div key={person.username}>
                    <p>{person.username} is at {parseFloat(person.distance).toFixed(2)}kms from your point</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    gap: '50px',
    padding: '1rem'
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: "0.5rem"
  },
  formField: {
    display: 'flex',
    gap: '1rem',
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: "0.25rem 0"
  },
  button: {
    width: '35%',
    height: '30px',
    alignSelf: 'center',
    marginTop: '.5rem',
    border: 'none',
    borderRadius: '50px',
    background: '#286624',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
}


export default HomePage