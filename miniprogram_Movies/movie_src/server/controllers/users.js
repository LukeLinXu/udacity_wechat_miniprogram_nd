const DB = require('../utils/db.js')
module.exports = {
  detail: async ctx => {
    let userId = ctx.params.id
    let user
    let likesDetail
    
    if (userId) {
      user = (await DB.query('select * from users where users.id = ?', [userId]))[0]
      likesDetail = (await DB.query('select * from comments where comments.id in ('+user.likes+')'))
      for(i  = 0; i < likesDetail.length; i++){
          let comment = likesDetail[i]
          comment.movie = (await DB.query('select * from movies where movies.id = ?', [comment.movie_id]))[0];
          comment.user = (await DB.query('select * from users where users.id = ?', [comment.user_id]))[0];
      }
      user.likesDetail = likesDetail
    } else {
      user = {}
    }
    ctx.state.data = user
  }
} 