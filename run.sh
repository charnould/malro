#!/bin/bash -e


# create_folders
#
# A bash function to initiate needed folder structure.
# For LOCAL and DEV purpose ONLY.
# BTW, it won't work on production.
cleanup () {
    rm -rf $( pwd; )/datastore/*
    mkdir -p $( pwd; )/datastore/archives
    mkdir -p $( pwd; )/datastore/images
    mkdir -p $( pwd; )/datastore/images/tmp
    mkdir -p $( pwd; )/datastore/images/originals
    }


# init_db
#
# A bash function to initiate both locally and on prod server.
# This function is also useful to run DB migration if needed.
init_db () {
    sqlite3 datastore/events.db ".read $( pwd; )/helpers/migrate/v.0.0.sql"
    }


# archive_db
#
# A bash function to archive `events.db` (MALRO events).
# Archives are available at https://www.malro.org/datastore/archives/yyyy-mm-dd.db.gz
# and made by a cronjob running every day around midnight (GMT).
# `users.db` is NOT archived but backed up through Hetzner rolling auto-backups.
archive_db () {

    today=$(date +"%Y-%m-%d")
    
    sqlite3 $( pwd; )/datastore/events.db "VACUUM INTO '$( pwd; )/datastore/archives/${today}.db'";    

    gzip $( pwd; )/datastore/archives/${today}.db
    
    # Because Cloudflare caches only .gz and not .gzip, change archive extension.
    # https://developers.cloudflare.com/cache/concepts/default-cache-behavior/#default-cached-file-extensions
    mv $( pwd; )/datastore/archives/${today}.db.gzip $( pwd; )/datastore/archives/${today}.db.gz
    rm -f $( pwd; )/datastore/archives/${today}.db.gzip
    }


# seed_db
#
# Seed DB with some fake data
# Used when a local env. is initiated 
seed_db () {    
    sqlite3 datastore/events.db ".read $( pwd; )/helpers/migrate/seed.sql"
    echo "Database seeded"
    }


# trash_organization
#
# A hack to be able to trash_organization() using bash.
# Useful when someone has made some tests in production,
# is not a spam and you just want to keep MALRO DB clean.
trash_organization () {
    echo "---------------------------------"
    echo "What domain do you want to trash?"
    echo "(e.g. 'test.org', must be lowercase)"
    read domain
    echo "-----------------------------"
    echo "You're gonna trash '$domain'."
    read -p "Are you REALLY sure? (Y/n) " -r
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        bun models/events.ts trash_organization $domain
        echo "'$domain' has been trashed!"
    fi
    }

    
"$@"
