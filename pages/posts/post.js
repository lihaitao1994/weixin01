// 只可以用相对路径
var postsData = require('../../data/posts-data.js')

Page({
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        //this.data.post_key = postsData.postList  //理论上和下面一句相同
        this.setData({
            post_key: postsData.postList
        });
    },

    onPostTap: function(event) {
        var postId = event.currentTarget.dataset.postid;
        //console.log(postId);
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

    onSwiperTap: function(event) {
        var postId = event.target.dataset.postid;
        //target指的是当前点击的组件，currentTarget指事件捕获的组件;
        //target指的是image,currentTarget指的是swiper
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

})