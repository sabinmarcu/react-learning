actionTypes    = require "../config/actionTypes"
module.exports = (state, action) !->
    if action.type is actionTypes.RESET_COMMENTS then return (require "./initialState")
    return state
