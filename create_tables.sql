CREATE TABLE posters(
       pid integer PRIMARY KEY,
       nick varchar(16) NOT NULL CHECK (nick <> '')
);

CREATE TABLE channels(
       cid integer PRIMARY KEY,
       channel_name varchar(32) NOT NULL CHECK (channel_name <> '') UNIQUE
);

CREATE TABLE links(
       url text NOT NULL CHECK (url <> ''),
       poster integer REFERENCES posters(pid),
       date_posted date DEFAULT current_timestamp,
       channel integer REFERENCES channels(cid),
       CONSTRAINT unique_url UNIQUE(url)
);
