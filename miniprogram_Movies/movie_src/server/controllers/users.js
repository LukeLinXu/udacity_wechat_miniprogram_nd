const DB = require('../utils/db.js')
module.exports = {
  detail: async ctx => {
    let userId = ctx.state.$wxInfo.userinfo.openId
    let user
    let likesDetail
    
    if (userId) {
        let tempList = (await DB.query('select * from users where users.id = ?', [userId]))
        if(tempList.length == 0){
            await DB.query('INSERT INTO users(id, name, avatar, likes) VALUES (?, ?, ?, ?)', [userId, ctx.state.$wxInfo.userinfo.nickName, ctx.state.$wxInfo.userinfo.avatarUrl, ""])
            user = (await DB.query('select * from users where users.id = ?', [userId]))[0]
            user.likesDetail = {}
        }else {
            user = tempList[0]
            user.likesDetail = {}
            if(user.likes){
                likesDetail = (await DB.query('select * from comments where comments.id in ('+user.likes+')'))
                for(i  = 0; i < likesDetail.length; i++){
                    let comment = likesDetail[i]
                    comment.movie = (await DB.query('select * from movies where movies.id = ?', [comment.movie_id]))[0];
                    comment.user = (await DB.query('select * from users where users.id = ?', [comment.user_id]))[0];
                    comment.name = comment.user.name
                    comment.avatar = comment.user.avatar
                }
                user.likesDetail = likesDetail
            }
        }
    } else {
      user = {}
    }
    ctx.state.data = user
  },

  updateLikes: async ctx =>{
      let userId = ctx.state.$wxInfo.userinfo.openId
      const { commentId, add } = ctx.request.body;
      let userLikeString
      let userLikeArray
      let tempList = (await DB.query('select * from users where users.id = ?', [userId]))
      if(tempList.length == 0){
          await DB.query('INSERT INTO users(id, name, avatar, likes) VALUES (?, ?, ?, ?)', [ctx.state.$wxInfo.userinfo.openId, ctx.state.$wxInfo.userinfo.nickName, ctx.state.$wxInfo.userinfo.avatarUrl, ""])
          userLikeString = ""
      }else {
          userLikeString = tempList[0].likes
      }
      userLikeArray = userLikeString.split(',')
      if(add){
          userLikeArray.push(commentId.toString())
      }else {
          let temp = userLikeArray.indexOf(commentId.toString())
          if(temp > -1){
              userLikeArray.splice(temp, 1)
          }
      }
      let finalS = userLikeArray.join(",")
      if(finalS.startsWith(",")){
          finalS = finalS.substring(1, finalS.size)
      }
      await DB.query('UPDATE users SET users.likes = ? WHERE users.id = ?', [finalS, userId])
      ctx.state.data = finalS
  },

} 