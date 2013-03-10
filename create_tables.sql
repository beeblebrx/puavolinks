CREATE SEQUENCE posters_id_seq;
CREATE SEQUENCE channels_id_seq;
CREATE SEQUENCE links_id_seq;

CREATE TABLE posters(
       pid integer PRIMARY KEY DEFAULT nextval('posters_id_seq'),
       nick varchar(16) NOT NULL CHECK (nick <> '') UNIQUE
);

CREATE TABLE channels(
       cid integer PRIMARY KEY DEFAULT nextval('channels_id_seq'),
       channel_name varchar(32) NOT NULL CHECK (channel_name <> '') UNIQUE
);

CREATE TABLE links(
       id integer PRIMARY KEY DEFAULT nextval('links_id_seq'),
       url text NOT NULL CHECK (url <> ''),
       poster integer REFERENCES posters(pid),
       date_posted date DEFAULT current_timestamp,
       channel integer REFERENCES channels(cid),
       CONSTRAINT unique_url UNIQUE(url)
);

GRANT ALL ON posters TO puavobot;
GRANT ALL ON channels TO puavobot;
GRANT ALL ON links TO puavobot;
GRANT ALL ON SEQUENCE posters_id_seq TO puavobot;
GRANT ALL ON SEQUENCE channels_id_seq TO puavobot;
GRANT ALL ON SEQUENCE links_id_seq TO puavobot;
