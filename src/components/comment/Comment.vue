<template>
<!-- 歌曲---抽屉播放内的评论 -->
  <div class="hotComments">
    <!-- 音乐单曲评论 -->
    <div
      class="musicComment"
    
    >
      <el-dialog
        :visible="isCommentDialogShow"
        width="400px"
        append-to-body
        class="commentDialog"
      >
        <div class="musicTitle">歌曲：{{ musicTitle }}</div>
      </el-dialog>
    </div>
    <div class="commentHeader"><slot name="title"></slot></div>
    <div class="commentItem" v-for="(item, index) in comments" :key="index">
      <div class="commentCreatorAvatar">
        <img
          :src="item.user.avatarUrl + '?param=100y100'"
          alt=""
          @click="goToPersonal(item.user.userId)"
        />
      </div>
      <div class="commentMain">
        <div class="commentContent">
          <span
            class="commentUserNickName"
            @click="goToPersonal(item.user.userId)"
            >{{ item.user.nickname }}:&nbsp;</span
          >
          <span>{{ item.content }}</span>
        </div>
        <div class="replied">
          <div
            class="repliedItem"
            v-for="(item1, index1) in item.beReplied"
            :key="index1"
          >
            <span class="repliedUser" @click="goToPersonal(item.user.userId)"
              >@{{ item1.user.nickname }}:&nbsp;</span
            >
            <span class="repliedContent">{{ item1.content }}</span>
          </div>
        </div>
        <div class="commentBottom">
          <div class="commentCreatedTime">
            {{ item.time | showDate }}
          </div>
          <div class="commentButtons">
            <div
              @click="likeCurrentComment(item.liked, item.commentId)"
              :class="item.liked ? 'likeCurrentComment' : ''"
            >
              <i class="iconfont icon-good"></i> {{ item.likedCount }}
            </div>
            <div><i class="iconfont icon-zhuanfa"></i></div>
            <div>
              <i
                class="iconfont icon-pinglun"
                @click="floorComment(item.commentId, item.user.nickname)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "plugins/utils";

export default {
  name: "Comment",
  props: {
    // 评论数据
    comments: {
      type: Array,
      default() {
        return [];
      },
    },
    // 评论的类型
    commentType: {
      type: String,
      default() {
        return "";
      },
    },
    // 评论对象的id
    commentId: {
      type: String,
      default() {
        return "";
      },
    },
    // 歌曲评论需要歌曲名称
    musicTitle: {
      type: String,
      default() {
        return "";
      },
    },
    // 是否是热门评论
    isHotComment: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      commentInput: "",
      // 是否显示评论dialog
      isCommentDialogShow: false,
      // 评论模式   true是常规评论   false是楼层评论
      commentMode: true,
      // 楼层回复前面几个字的长度
      floorCommentInputLength: 0,
      // 用于暂存楼层评论id
      floorCommentId: "",
    };
  },
  methods: {
       floorComment(commentId, nickName) {
        // 让父元素滚动到评论框
        this.$emit("scrollToComment");
       
    },
  },
  filters: {
    showDate(value) {
      // 1、先将时间戳转成Date对象
      const date = new Date(value);

      // 2、将date进行格式化
      return formatDate(date, "yyyy-MM-dd");
    },
  },
  watch: {
    // 评论数据发生变化时 重置所有发表评论的数据
    comments(current) {
      this.commentInpt = "";
      this.isCommentDialogShow = false;
      this.commentMode = true;
      this.floorCommentInputLength = 0;
      this.floorCommentId = "";
    },
  },
  created() {},
};
</script>

<style scoped>
.hotComments {
  margin-bottom: 20px;
  width: 100%;
}

.commentHeader {
  font-size: 14px;
  color: rgb(26, 26, 26);
  font-weight: 600;
  padding: 10px 0;
}
.commentItem {
  display: flex;
  margin: 5px 0;
  padding: 10px 0 20px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.commentCreatorAvatar {
  width: 35px;
  height: 35px;
  margin: 0px 10px 0 0;
}

.commentCreatorAvatar img {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

.commentMain {
  width: calc(100% - 50px);
}

.commentUserNickName {
  color: #5a8ab9;
  cursor: pointer;
}

.commentBottom {
  margin-top: 2px;
  color: rgb(172, 172, 172);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commentButtons {
  display: flex;
  align-items: center;
}
.commentButtons div {
  margin-top: -3px;
  padding: 0 8px;
  transform: scale(0.85);
}

.commentButtons div:nth-child(1) {
  font-size: 14px;
}

.replied {
  background-color: #f4f4f4;
  margin: 7px 0;
  border-radius: 5px;
}

.repliedItem {
  padding: 7px 10px;
  line-height: 20px;
}

.repliedUser {
  color: #5a8ab9;
  cursor: pointer;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.commentContent > span {
  line-height: 20px;
}

.el-textarea /deep/ .el-textarea__inner {
  height: 65px !important;
  font-size: 12px;
  resize: none;
}

.el-textarea /deep/ .el-textarea__inner:focus {
  border-color: #aaa;
}

.el-textarea /deep/ .el-input__count {
  transform: scale(0.9);
}

.submitCommentButton {
  width: 100%;
  text-align: right;
  margin: 10px 0;
}

.el-button:hover {
  background-color: #f2f2f2;
}

.el-button {
  transform: scale(0.9) translateX(5%);
}

.submitComment:focus {
  background-color: #fff;
}

.commentCardSwitch {
  position: fixed;
  left: 50%;
  top: calc(80vh - 105px);
  transform: translateX(-50%) scale(0.9);
  border: none;
  background-color: #f1f1f1;
  line-height: 15px;
  padding: 10px 10px 10px 30px;
}

.commentCardSwitch:hover {
  background-color: #e1e1e1;
}

.commentCardSwitch i {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.musicTitle {
  width: 100%;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 10px;
}

.musicCommentArea /deep/ .el-textarea__inner {
  height: 110px !important;
}

.musicSubmitComment {
  padding: 8px 20px;
  font-size: 13px;
  background-color: #ec4141;
  color: white;
  border: none;
}

.musicSubmitComment:hover {
  background-color: #eb2e2e;
  color: white;
}

.musicSubmitComment:focus {
  color: white;
  background-color: #ec4141;
}

.commentDialog /deep/ .el-dialog__body {
  padding-bottom: 5px !important;
}

.likeCurrentComment,
.likeCurrentComment i {
  color: #ec4141 !important;
}
</style>