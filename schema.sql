DROP TABLE IF EXISTS users;

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  default_address TEXT,
  default_num_of_restaurants INTEGER,
  default_price_level INTEGER,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);