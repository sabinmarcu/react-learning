module.exports = (author, comment, size = 10) -> "#{author.substr(0, size)}#{comment.substr(0, size)}#{comment.substr(comment.length - size, size)}"
