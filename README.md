# BO-CodeChallenge
A code challenge that includes geospatial information displayed in a mini app

### Installation
- In order to get this app up and running you have to first set up a postgresql server. If you don't have postgresql set up in you local system you can find the steps to do so in the [PostgresQL Official Site](https://www.postgresql.org/) and also install [PostGIS](https://postgis.net/). Once you've set up your database server, make sure to fill out the fields in the [.env](./Backend/.env) file inside the Backend directory. This will ensure that when the app server runs it can connect correctly to the db.

- After completing the previous steps you need to cd into the [Backend](./Backend/)  as well as the [Frontend](./Frontend/) directories and install all the dependencies by running `npm i`. Once finished, you can start both servers by running `npm start` from both directories.

### Usage
Once installed and running the app will let you create users based on coordinates in a map and will even allow you to find all the people located within a certain radius.

### License
This app is licensed under the MIT License.
