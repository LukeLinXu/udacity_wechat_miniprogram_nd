const DB = require('../utils/db.js')
module.exports = {
  detail: async ctx => {
    let userId = ctx.state.$wxInfo.userinfo.openId
    let user
    let likesDetail
    
    if (userId) {
        let tempList = (await DB.query('select * from users where users.id = ?', [userId]))
        if(tempList.length == 0){
            await DB.query('INSERT INTO users(id, name, avatar, likes) VALUES (?, ?, ?, ?)', [ctx.state.$wxInfo.userinfo.openId, ctx.state.$wxInfo.userinfo.nickName, ctx.state.$wxInfo.userinfo.avatarUrl, ""])
            user = {}
        }else {
            user = tempList[0]
            if(user.likes){
                likesDetail = (await DB.query('select * from comments where comments.id in ('+user.likes+')'))
                for(i  = 0; i < likesDetail.length; i++){
                    let comment = likesDetail[i]
                    comment.movie = (await DB.query('select * from movies where movies.id = ?', [comment.movie_id]))[0];
                    comment.user = (await DB.query('select * from users where users.id = ?', [comment.user_id]))[0];
                }
                user.likesDetail = likesDetail
            }
        }
    } else {
      user = {}
    }
    ctx.state.data = user
  }
} 