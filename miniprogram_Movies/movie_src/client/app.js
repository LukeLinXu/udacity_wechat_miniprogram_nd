//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let userInfo

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },

    data: {
        locationAuthType: UNPROMPTED
    },

    login({ success, error }) {
        if (userInfo){
            console.log("login check success1")
            return success && success({userInfo})
        } else {
            console.log("login check success2")
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo'] === false) {

                        this.data.locationAuthType = UNAUTHORIZED
                        // 已拒绝授权
                        wx.showModal({
                            title: '提示',
                            content: '请授权我们获取您的用户信息',
                            showCancel: false
                        })
                        error && error()
                    } else {
                        this.data.locationAuthType = AUTHORIZED
                        this.doQcloudLogin({ success, error })
                    }
                }
            })
        }
    },

    doQcloudLogin({ success, error }) {
        // 调用 qcloud 登陆接口
        qcloud.login({
            success: result => {
                if (result) {
                    console.log("doQcloudLogin check success1")
                    success && success({
                        userInfo
                    })
                } else {
                    console.log("doQcloudLogin check success2")
                    success && success({
                        userInfo
                    })
                }
            },
            fail: () => {
                console.log("doQcloudLogin check fail"+ error)
                error && error()
            }
        })
    },

    getUserInfo(){
        return this.userInfo
    },

    setUserInfo(userInfo){
        this.userInfo = userInfo
    }
})