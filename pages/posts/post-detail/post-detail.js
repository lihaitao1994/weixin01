// pages/posts/post-datail/post-datail.js
var postsData = require('../../../data/posts-data.js')
var app = getApp()

Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function(option) {
        var postId = option.id
        this.data.currentPostId = postId
        var postData = postsData.postList[postId] //postsData是个对象，下面的postList才是
        //this.data.postData = postData; 好像不管用
        //或许是异步的原因？
        this.setData({
            postData: postData
        });

        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postcollected = postsCollected[postId]
            this.setData({
                collected: postcollected
            })
        } else {
            var postsCollected = {}
            postsCollected[postId] = false
            wx.setStorageSync('posts_collected', postsCollected)
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }

        this.setMusicMonitor()

    },

    setMusicMonitor: function() {
        var that = this
        wx.onBackgroundAudioPlay(function() {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true
            app.globalData.g_currentMusicPostId = that.data.currentPostId
        })
        wx.onBackgroundAudioPause(function() {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false
            app.globalData.g_currentMusicPostId = null
        })
    },

    onColletionTap: function(event) {
        var postsCollected = wx.getStorageSync('posts_collected')
        var postCollected = postsCollected[this.data.currentPostId]
        //收藏变成未收藏，未收藏变为收藏
        postCollected = !postCollected
        postsCollected[this.data.currentPostId] = postCollected
        this.showToast(postsCollected, postCollected)
    },

    showModal: function(postsCollected, postCollected) {
        var that = this
        wx.showModal({
            title: '收藏',
            content: postCollected ? '是否收藏' : '取消收藏该文章',
            confirmText: '确认',
            cancelText: '取消',
            confirmColor: '#405f80',
            cancelColor: '#333',
            success: function(res) {
                if (res.confirm) {
                    //更新文章是否的缓存值
                    wx.setStorageSync('posts_collected', postsCollected)
                    //更新数据绑定变量，从而实现图片切换
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast: function(postsCollected, postCollected) {
        //更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected)
        //更新数据绑定变量，从而实现图片切换
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消收藏',
            duration: 1000,
            icon: 'success',
        })
    },

    onShareTap: function(event) {
        var itemList = [
            '分享给微信好友',
            '分享到朋友圈',
            '分享到QQ',
            '分享到微博',
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#405f80',
            success: function(res) {
                //res.cancel用户是否取消了按钮
                //res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: '用户是否取消' + res.cancel + '现在无法实现分享功能',
                })
            }
        })
    },

    onMusicTap: function(event) {
        var currentPostId = this.data.currentPostId
        var postData = postsData.postList[currentPostId]
        var isPlayingMusic = this.data.isPlayingMusic

        if (isPlayingMusic) {
            wx.pauseBackgroundAudio()
            this.setData({
                isPlayingMusic: false
            })
        } else {
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            backgroundAudioManager.title = postData.music.title
            backgroundAudioManager.coverImgUrl = postData.music.coverImg
            //设置了 src 之后会自动播放
            backgroundAudioManager.src = postData.music.url

            this.setData({
                isPlayingMusic: true
            })
        }
        // wx.playBackgroundAudio({
        //     dataUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
        //     title: '此时此刻',
        //     coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        // })



    }
})