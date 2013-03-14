DROP SEQUENCE IF EXISTS posters_id_seq CASCADE;
DROP SEQUENCE IF EXISTS channels_id_seq CASCADE;
DROP SEQUENCE IF EXISTS links_id_seq CASCADE;
DROP SEQUENCE IF EXISTS keys_id_seq CASCADE;

CREATE SEQUENCE posters_id_seq;
CREATE SEQUENCE channels_id_seq;
CREATE SEQUENCE links_id_seq;
CREATE SEQUENCE keys_id_seq;

DROP TABLE IF EXISTS posters CASCADE;
CREATE TABLE posters(
       pid integer PRIMARY KEY DEFAULT nextval('posters_id_seq'),
       nick varchar(16) NOT NULL CHECK (nick <> '') UNIQUE
);

DROP TABLE IF EXISTS channels CASCADE;
CREATE TABLE channels(
       cid integer PRIMARY KEY DEFAULT nextval('channels_id_seq'),
       channel_name varchar(32) NOT NULL CHECK (channel_name <> '') UNIQUE
);

DROP TABLE IF EXISTS links;
CREATE TABLE links(
       id integer PRIMARY KEY DEFAULT nextval('links_id_seq'),
       url text NOT NULL CHECK (url <> ''),
       poster integer REFERENCES posters(pid),
       date_posted timestamp DEFAULT current_timestamp,
       channel integer REFERENCES channels(cid),
       CONSTRAINT unique_url UNIQUE(url)
);

DROP TABLE IF EXISTS keys;
CREATE TABLE keys(
       id integer PRIMARY KEY DEFAULT nextval('keys_id_seq'),
       key char(16) NOT NULL,
       active boolean NOT NULL,
       botname varchar(16)
);

DROP GROUP IF EXISTS webapps;
CREATE GROUP webapps;

GRANT ALL ON posters TO GROUP webapps;
GRANT ALL ON channels TO GROUP webapps;
GRANT ALL ON links TO GROUP webapps;
GRANT ALL ON SEQUENCE posters_id_seq TO GROUP webapps;
GRANT ALL ON SEQUENCE channels_id_seq TO GROUP webapps;
GRANT ALL ON SEQUENCE links_id_seq TO GROUP webapps;
GRANT ALL ON SEQUENCE keys_id_seq TO GROUP webapps;
