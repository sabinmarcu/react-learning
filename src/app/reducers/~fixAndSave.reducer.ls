_              = require "underscore"
db             = require "../helpers/db"
const makeKey  = require "./makeKey"
initialState   = require "./initialState"
defkey         = makeKey initialState.commentsById["noitems"].author, initialState.commentsById["noitems"].comment

module.exports = (state, action) ->
    s = _.clone state
    if s.comments.length > 1 && (((s.comments.indexOf "noitems") >= 0) or ((s.comments.indexOf defkey) >= 0))
        s.comments = _.without s.comments, "noitems", defkey
        delete s.commentsById.noitems
        delete s.commentsById[defkey]

    db.upsert("state", ((doc) ->
        doc.state = s
        doc
    )).then (-> console.log "UPDATE_SUCCESS"), ((err) -> console.log "UPDATE_FAIL", err)

    s
