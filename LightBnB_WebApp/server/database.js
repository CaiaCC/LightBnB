require('dotenv').config();

const {Pool} = require('pg');
const congfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST
};
const pool = new Pool(congfig);
pool.connect();

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;
  return pool.query(queryString, [email])
    .then(res => res ? res.rows[0] : null)
    .catch(err => err);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT * FROM users
  WHERE id = $1;
  `;
  return pool.query(queryString, [id])
    .then(res => res ? res.rows[0] : null)
    .catch(err => err);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
    INSERT INTO users (
    name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return pool.query(queryString, [user.name, user.email, user.password])
    .then(res => res ? res.rows[0] : null)
    .catch(err => err);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = reservations.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  return pool.query(queryString, [guest_id, limit])
    .then(res => res ? res.rows[0] : null)
    .catch(err => err);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    if (!options.city) {
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${(queryParams.length)} `;
    }
  }
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    if (!options.city && !options.maximum_price_per_night) {
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${(queryParams.length)} `;
    }
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `HAVING owner_id = $${queryParams.length} `;
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    if (!options.owner_id) {
      queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
    } else {
      queryString += `AND avg(property_reviews.rating) >= $${queryParams.length} `;
    }
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(error => error);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
    INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  return pool.query(queryString, [property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms])
    .then(res => res ? res.rows[0] : null)
    .catch(err => err);
};
exports.addProperty = addProperty;