
INSERT INTO users (name, email, password)
VALUES ('Caia', 'cc@lhl.ca','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Trent', 'ty@lhl.ca','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Toby', 'tc@lhl.ca','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (
	owner_id, title, description, 
	thumbnail_photo_url, cover_photo_url, 
	cost_per_night, parking_spaces, 
	number_of_bathrooms, number_of_bedrooms, 
	country, street, city, province, post_code,
	active
	)
VALUES (
	1, 'Red', 'description1',
	'red.thumbnailphoto.ca', 'red.coverphoto.ca', 
	2534, 4, 
	3, 3, 
	'CA', 'Donttell', 'Torono', 'ON', '124675',
	False
	),
	(
	2, 'Blue', 'description2',
	'blue.thumbnailphoto.ca', 'blue.coverphoto.ca', 
	2534, 4, 
	3, 3, 
	'USA', 'Secret', 'San Diegi', 'CA', '345732',
	False
	),
	(
	3, 'Yello', 'description3',
	'yello.thumbnailphoto.ca', 'yello.coverphoto.ca', 
	2534, 4, 
	3, 3, 
	'CA', 'Shhhhhh', 'Clear Water', 'BC', '235764',
	False
	);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1 , 3, 'msg'),
(2, 2, 2, 2, 'msg'),
(3, 3, 3, 4, 'msg');