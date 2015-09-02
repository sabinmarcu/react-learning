actionTypes    = require "../config/actionTypes.lson"
module.exports = (author, comment) -> {type: actionTypes.ADD_COMMENT, author, comment}
