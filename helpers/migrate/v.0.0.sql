ATTACH DATABASE 'datastore/users.db' AS users;

--
--
--
--
-- EVENTS DB
--
--
--
--
-- Create events table
-- CAUTION: This schema must be a perfect duplicate of users.drafts
CREATE TABLE
  IF NOT EXISTS main.events (
    id TEXT PRIMARY KEY,
    created_by TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    linked_to TEXT NOT NULL,
    longitude REAL NOT NULL,
    latitude REAL NOT NULL,
    country TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    timezone TEXT NOT NULL,
    type TEXT NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    door_time INTEGER NOT NULL,
    mandatory_booking TEXT NOT NULL,
    booking_start TEXT DEFAULT NULL,
    booking_medium TEXT NOT NULL,
    featuring TEXT DEFAULT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    currency TEXT NOT NULL,
    description TEXT,
    calendar TEXT,
    support_email TEXT DEFAULT NULL,
    support_phone TEXT DEFAULT NULL
  );

-- Create calendar table
CREATE TABLE
  IF NOT EXISTS main.calendar (
    id TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT NOT NULL,
    adult_fee REAL NOT NULL,
    child_fee REAL NOT NULL,
    audio_lang TEXT,
    feature TEXT
  );

-- Create linked_to table
CREATE TABLE
  IF NOT EXISTS main.linked_to (id TEXT NOT NULL, domain TEXT NOT NULL);

--
--
--
--
--
--
--
--
-- Create trigger on event insert
CREATE TRIGGER IF NOT EXISTS main.on_event_insert AFTER INSERT ON events BEGIN
DELETE FROM calendar
WHERE
  id = NEW.id;

DELETE FROM linked_to
WHERE
  id = NEW.id;

INSERT INTO
  calendar (
    id,
    start,
    end,
    adult_fee,
    child_fee,
    audio_lang,
    feature
  )
SELECT
  NEW.id,
  JSON_EXTRACT (t.value, '$.start'),
  JSON_EXTRACT (t.value, '$.end'),
  JSON_EXTRACT (t.value, '$.adult_fee'),
  JSON_EXTRACT (t.value, '$.child_fee'),
  JSON_EXTRACT (t.value, '$.audio_lang'),
  JSON_EXTRACT (t.value, '$.feature')
FROM
  JSON_EACH (NEW.calendar) AS t;

INSERT INTO
  linked_to (id, domain)
SELECT
  NEW.id,
  a.value
FROM
  JSON_EACH (NEW.linked_to) AS a;

END;

--
--
--
--
--
-- Create trigger on event status update
--
CREATE TRIGGER IF NOT EXISTS main.on_event_status_update AFTER
UPDATE ON events WHEN new.status = 'trashed' BEGIN
-- 1) Delete all OLD denormalizations
-- in calendar...
DELETE FROM calendar
WHERE
  id = NEW.id;

-- in linked_to...
DELETE FROM linked_to
WHERE
  id = NEW.id;

END;

--
--
--
--
-- USERS DB
--
--
--
--
-- Create users table
CREATE TABLE
  IF NOT EXISTS users.users (
    email TEXT PRIMARY KEY,
    domain TEXT NOT NULL,
    lang TEXT NOT NULL,
    is_admin TEXT NOT NULL,
    created_at TEXT DEFAULT (strftime ('%Y-%m-%dT%H:%M', 'now')),
    created_by TEXT NOT NULL
  );

-- Create banned domain table
CREATE TABLE
  IF NOT EXISTS users.banned (
    domain TEXT PRIMARY KEY,
    added_from TEXT DEFAULT "third_party",
    added_at TEXT DEFAULT (strftime ('%Y-%m-%dT%H:%M', 'now'))
  );

-- Create drafts table
-- !! Must be an exact copy of main.events
CREATE TABLE
  IF NOT EXISTS users.drafts (
    id TEXT PRIMARY KEY,
    created_by TEXT NOT NULL,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    linked_to TEXT NOT NULL,
    longitude REAL NOT NULL,
    latitude REAL NOT NULL,
    country TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    timezone TEXT NOT NULL,
    type TEXT NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    door_time INTEGER NOT NULL,
    mandatory_booking TEXT NOT NULL,
    booking_start TEXT DEFAULT NULL,
    booking_medium TEXT NOT NULL,
    featuring TEXT DEFAULT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    currency TEXT NOT NULL,
    description TEXT,
    calendar TEXT,
    support_email TEXT DEFAULT NULL,
    support_phone TEXT DEFAULT NULL
  );

--
--
--
--
-- PRAGMA
--
--
--
--
-- events.db
PRAGMA main.journal_mode = WAL;

PRAGMA main.ignore_check_constraints = on;

PRAGMA main.synchronous = normal;

PRAGMA main.temp_store = memory;

PRAGMA main.mmap_size = 30000000000;

PRAGMA main.auto_vacuum = full;

-- users.db
PRAGMA users.journal_mode = WAL;

PRAGMA users.synchronous = normal;

PRAGMA users.temp_store = memory;

PRAGMA users.mmap_size = 30000000000;

PRAGMA users.auto_vacuum = full;
