const DB = require('../utils/db.js')
module.exports = {
  detail: async ctx => {
    let commentId = + ctx.params.id
    let comment

    if (!isNaN(commentId)) {
      comment = (await DB.query('select * from comments where comments.id = ?', [commentId]))[0]
    } else {
      comment = {}
    }
    ctx.state.data = comment
  },

  listByUserId: async ctx => {
    let commentId = ctx.params.id
    let comment

    if (commentId) {
      comment = (await DB.query('select * from comments where comments.user_id = ?', [commentId]))
    } else {
      comment = {}
    }
    ctx.state.data = comment
  },

  listByMovieId: async ctx => {
    let commentId = + ctx.params.id
    let comment

    if (!isNaN(commentId)) {
      comment = (await DB.query('select * from comments where comments.movie_id = ?', [commentId]))
    } else {
      comment = {}
    }
    ctx.state.data = comment
  }
} 