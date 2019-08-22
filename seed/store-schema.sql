-- Drop table

-- DROP TABLE stores;
CREATE EXTENSION postgis;
CREATE TABLE stores (
	id serial NOT NULL,
	store_name varchar(100) NULL,
	store_location varchar(100) NULL,
	address text NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	zip_code varchar(100) NULL,
	geom geometry(POINT, 4326) NULL,
	latitude varchar(100) NULL,
	longitude varchar(100) NULL,
	county varchar(100) NULL,
	CONSTRAINT stores_pkey PRIMARY KEY (id)
);
