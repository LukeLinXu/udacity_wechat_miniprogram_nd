const DB = require('../utils/db.js')
module.exports = {
  /**
   * 拉取商品列表
   * 
   */
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  }
} 