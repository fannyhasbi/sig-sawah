-- DB migration for MySQL

CREATE TABLE field (
  id INT NOT NULL AUTO_INCREMENT,
  color VARCHAR(50),
  landowner VARCHAR(500) NOT NULL,
  crop VARCHAR(500),
  area float,
  hamlet VARCHAR(100),
  planting_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE geometries (
  id INT NOT NULL AUTO_INCREMENT,
  geo_type VARCHAR(50) NOT NULL,
  coordinates TEXT,
  field_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (field_id) REFERENCES field(id)
);