pouchdb        = require "pouchdb"
upsert         = require "pouchdb-upsert"
_instance      = null

pouchdb.plugin upsert

module.exports = do ->
    if not _instance? then _instance = new pouchdb "test"
    _instance
