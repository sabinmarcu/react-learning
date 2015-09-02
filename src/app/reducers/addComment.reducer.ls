_              = require "underscore"
actionTypes    = require "../config/actionTypes"
const makeKey  = require "./makeKey"

module.exports = (state, action) !->
    if action.type is actionTypes.ADD_COMMENT
        key = makeKey action.author, action.comment
        comms = state.comments.slice 0
        commsMap = _.clone state.commentsById
        if (comms.indexOf key) < 0
            comms.push key
            commsMap[key] = author: action.author, comment: action.comment
        return comments: comms, commentsById: commsMap
    return state
