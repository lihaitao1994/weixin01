// pages/welcome/welcmoe.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    onTap: function() {
        //此方法跳转子页面
        //wx.navigateTo({
        //url: '../posts/post',
        //})   

        //此方法跳转主页面
        wx.switchTab({
            url: '../posts/post',
            success: function(res) {
                //跳转成功时执行
                console.log("跳转成功")
            },
            fail: function() {
                //跳转失败时执行
                console.log("跳转失败")
            },
            complete: function() {
                //无论跳转成功或失败都执行
            },
        })
    }
})