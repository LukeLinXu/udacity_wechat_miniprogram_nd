const DB = require('../utils/db.js')
module.exports = {
  detail: async ctx => {
    let userId = ctx.params.id
    let user
    
    if (userId) {
      user = (await DB.query('select * from users where users.id = ?', [userId]))[0]
    } else {
      user = {}
    }
    ctx.state.data = user
  }
} 