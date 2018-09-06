const DB = require('../utils/db.js')
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },

  detail: async ctx => {
      const userId = ctx.state.$wxInfo.userinfo.openId;
      const movieId = + ctx.params.id;
    let movie;

    if (!isNaN(movieId)) {
      movie = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]
        let temp = (await DB.query('SELECT * FROM comments WHERE comments.user_id = ? AND comments.movie_id = ?', [userId, movieId]))
        movie.isReviewed = temp.length != 0
    } else {
      movie = {}
    }
    ctx.state.data = movie
  }
} 