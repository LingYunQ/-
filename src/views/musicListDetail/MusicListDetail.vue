<template>
  <!-- 歌单详情组件-和歌单评论 -->
  <div class="musicListDetail">
    <!-- 歌单信息 -->
    <div class="listInfo">
      <!-- 歌单封面 -->
      <div class="listAvatar">
        <img :src="musicListDetail.coverImgUrl" alt="" />
      </div>
      <div class="right">
        <!-- 标题 -->
        <div class="title">
          <div class="titleTag">歌单</div>
          <div class="titleContent">{{ musicListDetail.name }}</div>
        </div>
        <!-- 用户信息 -->
        <div class="user">
          <div class="userAvatar">
            <img :src="musicListDetail.creator.avatarUrl" alt="" />
          </div>
          <div class="userName">
            {{ musicListDetail.creator.nickname }}
          </div>
          <div class="createTime">
            {{ musicListDetail.createTime | showDate }}创建
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="buttons">
          <div class="buttonItem playAll">
            <i class="iconfont icon-bofang playAll"></i>
            <span>播放全部</span>
          </div>
          <div class="buttonItem" @click="collectList">
            <i class="iconfont icon-xihuan" :class="isSub ? 'red' : ''"></i>
            <span>{{ isSub ? "已收藏" : "收藏" }}</span>
          </div>
          <div class="buttonItem">
            <i class="iconfont icon-zhuanfa"></i>
            <span>分享</span>
          </div>
        </div>
        <!-- 标签 -->
        <div class="tags" v-if="musicListDetail.tags!=''">
          标签：
          <div
            class="tagItem"
            v-for="(item, index) in musicListDetail.tags"
            :key="index"
          >
            {{ item }}
          </div>
          <div v-if="musicListDetail.tags == null">暂无标签</div>
        </div>
        <!-- 歌曲列表的歌曲数量和播放量 -->
        <div class="otherInfo">
          <div class="musicNum">
            歌曲 : {{ musicListDetail.trackCount | handleNum }}
          </div>
          <div class="playCount">
            播放 : {{ musicListDetail.playCount | handleNum }}
          </div>
        </div>
        <div class="desc" v-if="musicListDetail.description">
          简介 :
          {{ musicListDetail.description }}
        </div>
      </div>
    </div>
    <!-- 歌曲列表 -->
    <div class="musicList">
      <el-tabs value="first">
        <el-tab-pane label="歌曲列表" name="first">
          <!-- 表格 -->
          <el-table
            @row-dblclick="clickRow"
            :data="musicListDetail.tracks"
            stripe
            size="mini"
          >
            <el-table-column label="" width="40" type="index">
            </el-table-column>
            <el-table-column label="" width="23">
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" min-width="350">
            </el-table-column>
            <el-table-column prop="ar[0].name" label="歌手" min-width="120">
            </el-table-column>
            <el-table-column prop="al.name" label="专辑" min-width="170">
            </el-table-column>
            <el-table-column prop="dt" label="时长" min-width="100">
            </el-table-column>
          </el-table>
          <div class="placeholder"></div>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <div
            class="commentList"
            v-if="comments.comments"
          >
            <!-- 精彩评论 -->
            <comment
              :commentType="'musicList'"
              :comments="comments.hotComments"
              v-if="comments.hotComments!=''"
              ref="hotComments"
              ><div slot="title">精彩评论</div></comment
            >
            <!-- 最新评论 -->
            <comment
              v-if="comments.comments!=''"
              :comments="comments.comments"
              :commentType="'musicList'"
              :commentId="musicListDetail.id + ''"
              :isHotComment="comments.hotComments ? false : true"
              ><div slot="title">最新评论</div></comment
            >
            <div class="dadasa" v-if="comments.comments==''">暂无评论</div>
          </div>
          <!-- 分页 -->
          <div
            class="page"
            v-show="comments.comments && comments.comments.length != 0"
          >
            <el-pagination
              background
              layout="prev, pager, next"
              :total="comments.total"
              small
              :page-size="50"
              :current-page="currentCommentPage"
              @current-change="commentPageChange"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane style="width: 100%" label="收藏者" name="third">
          <div
            class="note_imaj"
            v-for="(item, index) in collector"
            :key="index"
          >
            <el-avatar
              class="img"
              :size="100"
              :src="item.avatarUrl"
            ></el-avatar>
            <p>{{ item.nickname }}</p>
          </div>
          <div class="dadasa" v-if="collector.length == 0">暂无收藏者</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 返回顶部组件 -->
    <go-top scrollObj=".musicListDetail"></go-top>
  </div>
</template>
<script>
// 处理时间
import { formatDate, handleNum, handleMusicTime } from "plugins/utils";
// 评论
import Comment from "components/comment/Comment";
// 返回顶部
import GoTop from "components/goTop/GoTop.vue";
export default {
  components: {
    Comment,
    GoTop,
  },
  data() {
    return {
      collector: [], // 收藏者
      currentCommentPage: 1, // 当前评论页数
      comments: {},// 评论
      musicListDetail: [], // 歌曲列表
      isSub: false, // 用户是否收藏了当前歌单
    };
  },
  async created() {
    // 请求歌单详情和全部歌曲
    this.getMusicListDetail();
    // 请求歌单评论
    this.getSongsinglecomment();
    // 请求歌单收藏者
    this.getPlaylistCollection();
  },
  methods: {
    // 获取歌单收藏者
    async getPlaylistCollection() {
      let result = await this.$request("/playlist/subscribers", {
        id: this.$route.params.id,
        limit: 50,
      });
      // 赋值
      this.collector = result.data.subscribers;
      // console.log(this.collector);
    },
    // 评论点击翻页的回调
    async commentPageChange(page) {
      // console.log(page);
      this.currentCommentPage = page;
      // console.log(this.currentCommentPage);
      await this.getSongsinglecomment();
      this.scrollToComment();
    },
    // 请求歌单评论
    async getSongsinglecomment() {
      let result = await this.$request("/comment/playlist", {
        id: this.$route.params.id,
        limit: 50,
        offset: (this.currentCommentPage - 1) * 50,
      });
      // 获取歌单评论
      this.comments = result.data;
      // console.log(this.musicComment);
    },
    // 点击收藏按钮的回调
    collectList() {
      if (!this.$store.state.isLogin) {
        return;
      }
      this.isSub = !this.isSub;
    },
    // 请求
    // 根据传来的 id 查询歌单详情
    async getMusicListDetail() {
      var timestamp = Date.parse(new Date());
      // console.log(this.$route.params.id);
      let result = await this.$request("/playlist/detail", {
        // 请求歌单数据的id是路由传参里的id方便复用
        id: this.$route.params.id,
        timestamp,
      });
      // 赋值
      this.musicListDetail = result.data.playlist;
      // console.log(result);
      // 处理播放时间
      this.musicListDetail.tracks.forEach((item, index) => {
        this.musicListDetail.tracks[index].dt = handleMusicTime(item.dt);
      });
      //请求歌单全部歌曲
      let arr = this.musicListDetail.trackIds.slice(
        this.musicListDetail.tracks.length
      );
      if (arr.length > 100) {
        arr = arr.slice(0, 100);
      }
      // 筛选
      let ids = "";
      arr.forEach((item) => {
        ids += item.id + ",";
      });
      ids = ids.substr(0, ids.length - 1);
      // 获取歌曲详情
      let res = await this.$request("/song/detail", { ids });
      res.data.songs.forEach((item, index) => {
        res.data.songs[index].dt = handleMusicTime(item.dt);
      });
      // 将获取到的剩余的歌曲添加进去
      this.musicListDetail.tracks.push(...res.data.songs);
    },
    // 返回顶部
    scrollToComment() {
      let musicListDetail = document.querySelector(".musicListDetail");
      let listInfo = document.querySelector(".listInfo");
      // console.log("执行了这里 滚动到精彩评论", [listInfo]);
      musicListDetail.scrollTo({
        behavior: "smooth",
        top: listInfo.clientHeight - 20,
      });
    },
    // 获取歌曲id
    clickRow(row) {
      this.$store.commit("updateMusicId", row.id);
      // 如果歌单发生变化,则提交歌单到vuex
      if (this.musicListDetail.id != this.$store.state.musicListId) {
        // 将歌单传到vuex
        this.$store.commit("updateMusicList", {
          musicList: this.musicListDetail.tracks,
          musicListId: this.musicListDetail.id,
        });
      }
    },
  },
  filters: {
    showDate(value) {
      // 1、先将时间戳转成Date对象
      const date = new Date(value);
      // 2、将date进行格式化
      return formatDate(date, "yyyy-MM-dd");
    },
    handleNum,
  },
};
</script>
<style scoped>
.dadasa{
  text-align: center;
  margin-top: 100px;
}
.note_imaj {
  display: inline;
  float: left;
  height: auto;
  width: 400px;
  margin-left: 100px;
  margin-top: 20px;
  font-size: 15px;
}
.img {
  display: inline-block;
  height: 100px;
  vertical-align: middle;
}
.note_imaj p {
  display: inline-block;
  margin-left: 5px;
}
.musicListDetail {
  overflow-y: scroll;
}

.listInfo {
  display: flex;
  padding: 25px 15px;
  align-items: center;
}

.listAvatar {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 15px;
  position: relative;
}

.listAvatar::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: url("~assets/img/imgLoading.png") no-repeat;
  background-size: contain;
  z-index: -1;
}

.listAvatar img {
  width: 100%;
}

.right {
  width: calc(100% - 200px);
}

.title {
  display: flex;
  align-items: center;
}

.titleTag {
  font-size: 12px;
  color: #ec4141;
  border: 1px solid #ec4141;
  padding: 1px 2px;
  border-radius: 2px;
  margin-right: 5px;
  transform: scale(0.8);
}

.titleContent {
  font-size: 20px;
  font-weight: 600;
  color: #373737;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.userAvatar {
  height: 25px;
  width: 25px;
  margin-right: 8px;
}

.userAvatar img {
  width: 100%;
  border-radius: 50%;
}

.userName {
  color: #6191c2;
  margin-right: 8px;
  cursor: pointer;
}

.createTime {
  transform: scale(0.9);
}

.buttons {
  margin: 8px 0 0 -5px;
  display: flex;
}

.buttonItem {
  font-size: 12px;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transform: scale(0.9);
}

.buttonItem i {
  font-size: 12px;
  margin-right: 3px;
  transform: scale(0.9);
}

.playAll {
  background-color: #ec4141;
  color: white;
}

.tags {
  margin: 8px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.tagItem {
  color: #6191c2;
  margin-right: 5px;
}

.otherInfo {
  margin: 5px 0 0 -30px;
  display: flex;
  font-size: 12px;
  transform: scale(0.9);
}

.musicNum {
  margin-right: 13px;
}

.desc {
  margin: 5px 0 0 -30px;
  font-size: 12px;
  transform: scale(0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.musicList {
  margin: -15px 15px 0;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.placeholder {
  width: 100%;
  height: 50px;
}

.loadMore {
  width: 100%;
  height: 50px;
  font-size: 12px;
  color: #aaa;
  text-align: center;
  line-height: 50px;
  transform: scale(0.9);
}

.red {
  color: #ec4141;
}

.commentList /deep/ .el-loading-spinner {
  top: 40px;
}

.tips {
  font-size: 14px;
  margin: 30px 0;
  text-align: center;
}
</style>