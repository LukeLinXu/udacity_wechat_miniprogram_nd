const DB = require('../utils/db.js')
module.exports = {
  /**
   * 拉取商品列表
   * 
   */
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },

  detail: async ctx => {
    let movieId = + ctx.params.id
    let movie

    if (!isNaN(movieId)) {
      movie = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]
    } else {
      movie = {}
    }
    ctx.state.data = movie
  }
} 