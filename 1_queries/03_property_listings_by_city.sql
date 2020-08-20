SELECT properties.*, round(avg(property_reviews.rating)) as avg_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city = 'Vancouver'
GROUP BY properties.id
HAVING  round(avg(rating)) >= 4
ORDER BY cost_per_night
LIMIT 10;