// pages/reviewEdit/reviewEdit.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
// recordStatus
const UNRECORDED = 0
const RECORDING = 1
const RECORDED = 2

// recordAuthStatus
const UNVERIFIED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const recorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      recordStatusText: ['长按录音', '松开停止', '重新录音'],
      type: 0,
      movie: null,
      inputValue: "",
      duration: 0,
      recordStatus: UNRECORDED,
      recordAuthStatus: UNVERIFIED
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        movie: JSON.parse(options.movie),
        type: parseInt(options.type_id)
      })
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onSubmitClick: function() {
    let comment = {}
    let dataObj = {}
      dataObj.type = this.data.type
      dataObj.movie = this.data.movie
      comment.content = this.data.inputValue
      comment.duration = this.data.duration
      dataObj.comment = comment
      console.log(dataObj)
    wx.navigateTo({
      url: '/pages/reviewPreview/reviewPreview?dataObj='+encodeURIComponent(JSON.stringify(dataObj))
    })
  },


    getRecordAuth(forceAuth) {
        wx.getSetting({
            success: (res) => {
                let auth = res.authSetting['scope.record']
                console.log(auth)
                if (auth === undefined) {
                    if (forceAuth) {
                        wx.authorize({
                            scope: 'scope.record',
                            success: () => {
                                this.setData({
                                    recordAuthStatus: AUTHORIZED
                                })
                            },
                            fail: error => {
                                console.log(error)
                                this.setData({
                                    recordAuthStatus: UNAUTHORIZED
                                })
                            }
                        })
                    }
                } else if (auth === false) {
                    this.setData({
                        recordAuthStatus: UNAUTHORIZED
                    })
                } else if (auth === true) {
                    this.setData({
                        recordAuthStatus: AUTHORIZED
                    })
                }
            },
            fail: error => {
                console.log(error)
            }
        })
    },


    settingCallBack(event) {
        console.log(event)
        let auth = event.detail.authSetting['scope.record']

        if (auth === false) {
            this.setData({
                recordAuthStatus: UNAUTHORIZED
            })
        } else {
            this.setData({
                recordAuthStatus: AUTHORIZED
            })
        }
    },

    startRecord() {
        if (this.data.recordAuthStatus === UNVERIFIED) {
            this.getRecordAuth(true)
        } else if (this.data.recordAuthStatus === AUTHORIZED) {
            recorderManager.onStart(() => {
                wx.vibrateShort();
                this.setData({
                    recordStatus: RECORDING,
                })
            })
            const options = {
                duration: 60000,
                sampleRate: 44100,
                numberOfChannels: 1,
                encodeBitRate: 192000,
                format: 'mp3',
                frameSize: 50
            }
            recorderManager.start(options)
        }
    },

    stopRecord() {
      if(this.data.recordAuthStatus == AUTHORIZED){
          recorderManager.stop()
          recorderManager.onStop((res) => {
              console.log(res)
              this.setData({
                  duration: parseInt(res.duration),
                  recordStatus: RECORDED,
                  inputValue: res.tempFilePath
              })
          })
      }
        // }
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      if(app.getUserInfo()){
          this.getRecordAuth(false);
      }else {
          wx.navigateTo({
              url: '/pages/login/login'
          })
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})