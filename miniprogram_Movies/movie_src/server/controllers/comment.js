const DB = require('../utils/db.js')
module.exports = {

  random: async ctx => {
    let comment
    comment = (await DB.query('SELECT * FROM comments ORDER BY RAND() LIMIT 1'))[0]
    comment.movie = (await DB.query('select * from movies where movies.id = ?', [comment.movie_id]))[0]
    comment.user = (await DB.query('select * from users where users.id = ?', [comment.user_id]))[0]
    ctx.state.data = comment
  },

  detail: async ctx => {
    let commentId = + ctx.params.id
    let comment

    if (!isNaN(commentId)) {
      comment = (await DB.query('select * from comments where comments.id = ?', [commentId]))[0]
      comment.movie = (await DB.query('select * from movies where movies.id = ?', [comment.movie_id]))[0]
      comment.user = (await DB.query('select * from users where users.id = ?', [comment.user_id]))[0]
    } else {
      comment = {}
    }
    ctx.state.data = comment
  },

  listByUserId: async ctx => {
    let userId = ctx.state.$wxInfo.userinfo.openId
    let comment

    if (userId) {
      comment = (await DB.query('SELECT * FROM movies INNER JOIN comments ON comments.user_id = ? AND comments.movie_id=movies.id', [userId]))
    } else {
      comment = {}
    }
    ctx.state.data = comment
  },

  listByMovieId: async ctx => {
    let movieId = + ctx.params.id
    let comment

    if (!isNaN(movieId)) {
      comment = (await DB.query('SELECT * FROM users INNER JOIN comments ON comments.movie_id = ? AND comments.user_id=users.id', [movieId]))
    } else {
      comment = {}
    }
    ctx.state.data = comment
  }
} 