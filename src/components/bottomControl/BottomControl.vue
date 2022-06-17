<template>
  <div class="bottomControl">
    <audio
      :src="musicUrl"
      ref="audioPlayer"
      autoplay
      @play="changeState(true)"
      @pause="changeState(false)"
      @timeupdate="timeupdate"
    ></audio>
    <!-- 左边 -->
    <div class="left">
      <div class="avatar" @click="$store.commit('changeMusicDetailCardState')">
        <img
          :src="musicDetail.al.picUrl"
          v-if="musicDetail.al"
          :draggable="false"
        />
        <img src="~assets/img/test.jpg" alt="" v-else :draggable="false" />
      </div>
      <div class="musicInfo">
        <div class="musicName" v-if="musicDetail && musicDetail.name">
          {{ musicDetail.name }}
        </div>
        <div
          class="singer"
          v-if="musicDetail && musicDetail.name"
        >
          {{ musicDetail.ar[0].name }}
        </div>
      </div>
      <div class="downloadContainer" v-if="musicDetail.name">
        <i class="iconfont icon-download"></i>
      </div>
    </div>
    <!-- 中间 -->
    <div class="center">
      <div class="buttons">
        <span
          ><i class="iconfont icon-shangyishou"></i
        ></span>
        <span @click="musicList.length != 0 ? changePlayState() : ''">
          <i
            class="iconfont icon-icon_play"
            v-if="!this.$store.state.isPlay"
          ></i>
          <i class="iconfont icon-zantingtingzhi" v-else></i>
        </span>
        <span
          ><i class="iconfont icon-xiayishou"></i
        ></span>
      </div>
      <!-- 进度条 -->
      <div class="progressBar">
        <span class="currentTime">{{ currentTime | handleMusicTime }}</span>
        <el-slider
          class="progressSlider"
          v-model="timeProgress"
          :show-tooltip="false"
          @change="changeProgress"
          :disabled="musicList.length == 0"
        ></el-slider>
        <span class="totalTime">{{ duration }}</span>
      </div>
    </div>
    <!-- 右边 -->
    <div class="right">
      <div class="volumeControl">
        <i class="iconfont icon-yinliang" @click="changeMutedState"></i>
        <el-slider
          class="volumeSlider"
          v-model="volume"
          @input="changeVolume"
          :show-tooltip="false"
        ></el-slider>
      </div>
      <div class="playList" @click="openDrawer">
        <i class="iconfont icon-bofangliebiao"></i>
      </div>
    </div>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :with-header="false" width="300">
      <div class="drawerHeader">总{{ musicList.length }}首</div>
      <el-table
        :data="musicList"
        stripe
        style="width: 100%"
        :show-header="false"
        @row-dblclick="clickRow"
        highlight-current-row
        lazy
      >
        <el-table-column prop="name" width="150px"> </el-table-column>
        <el-table-column prop="ar[0].name" width="80px"> </el-table-column>
        <el-table-column prop="dt" width="70px"> </el-table-column>
      </el-table>
    </el-drawer>
    <music-card></music-card>
  </div>
</template>

<script>
import { handleMusicTime, returnSecond } from "plugins/utils";
import musicCard from '../../views/musicCard/musciCard.vue'
let lastSecond = 0;
// 总时长的秒数
let durationNum = 0;
// 保存当前音量
let volumeSave = 0;

export default {
  components:{musicCard},
  name: "BottomControl",
  data() {
    return {
      musicDetail: {},// 歌曲详情
      musicUrl: "",// 歌曲URL
      musicList: [], // 歌单列表
      currentMusicIndex: 0, // 当前音乐在歌单的下标
      drawer: false,
      // 音乐总时长
      duration: "00:00",
      // 当前播放时间位置
      currentTime: 0,
      // 进度条的位置
      timeProgress: 0,
      // 音量
      volume: 30,
      // 是否静音
      isMuted: false,
      // 抽屉是否被打开过（如果没打开过，里面的数据是不会渲染的）
      hasDrawerOpend: false,
      // 用户的喜欢音乐列表
      likeMuiscList: [],
      // 用户是否喜欢当前音乐
      isUserLikeCurrentMusic: false
    };
  },
  methods: {
    // 请求
    // 请求歌曲的url
    async getMusicDetail(id) {
      let result = await this.$request("/song/url", { id });
      // console.log(musicDetail);
      // console.log(result);
      // 获取歌曲URL
      this.musicUrl = result.data.data[0].url;
    },
    // 点击播放键的回调
    changePlayState() {
      // isPlay为 false 时为暂停 true 时播放
      !this.$store.state.isPlay ? this.playMusic() : this.pauseMusic();
    },
    // 播放音乐的函数
    playMusic() {
      this.$refs.audioPlayer.play();
    },
    // 暂停音乐的函数
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },
    // audio开始或暂停播放的回调  在vuex中改变状态
    changeState(state) {
      this.$store.commit("changePlayState", state);
    },
    // 根据id找到 musicList中对应的 musicDetail
    getMusicDetailFromMusicList() {
      // 获取歌曲url
      let index = this.musicList.findIndex(
        (item) => item.id == this.$store.state.musicId
      );
      // console.log(index);
      if (index != -1) {
        // 记录当前音乐的index
        this.currentMusicIndex = index;
        // 将索引传至vuex
        this.$store.commit("updateCurrentIndex", index);
        // 获取歌曲详情
        this.musicDetail = this.musicList[index];
        console.log(this.musicDetail);
        // 歌曲时长
        this.duration = this.musicList[index].dt;
      }
    },
    // 切歌函数
    changeMusic(type, id) {
      if (type == "click") {
        // 点击抽屉row进行切歌
        this.$store.commit("updateMusicId", id);
      }
    },
    // 双击抽屉列表中的row的回调
    clickRow(row) {
      // console.log(row.id);
      this.changeMusic("click", row.id);
    },
    // 当前播放时间位置
    timeupdate() {
      // console.log(e);
      // console.log(this.$refs.audioPlayer.currentTime);
      let time = this.$refs.audioPlayer.currentTime;
      // 将当前播放时间保存到vuex
      this.$store.commit("updateCurrentTime", time);
      // 返回最大整数
      time = Math.floor(time);
      if (time !== lastSecond) {
        // console.log(time);
        lastSecond = time;
        this.currentTime = time;
        // 计算进度条的位置 当前播放时间位置除总时长
        this.timeProgress = Math.floor((time / durationNum) * 100);
        // console.log(this.timeProgress);
      }
    },
    // 拖动进度条的回调
    changeProgress(e) {
      // console.log(e);
      // 修改当前播放时间
      this.currentTime = Math.floor((e / 100) * durationNum);
      // 改变audio的实际当前播放时间
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    // 拖动音量条的回调
    changeVolume(e) {
      // 改变audio的音量
      // input事件 实时触发
      this.$refs.audioPlayer.volume = e / 100;
      if (this.isMuted && e > 0) {
        this.isMuted = false;
      } else if (e == 0 && this.isMuted == false) {
        this.isMuted = true;
      }
    },
    // 点击小喇叭的回调 （切换静音状态）
    changeMutedState() {
      if (this.isMuted) {
        this.volume = volumeSave;
      } else {
        volumeSave = this.volume;
        this.volume = 0;
      }
      console.log(volumeSave, this.isMuted);
      this.isMuted = !this.isMuted;
    },
    // 点击打开抽屉的回调
    openDrawer() {
      // 关闭也是这个回调，所以直接取反
      this.drawer = !this.drawer;
      this.hasDrawerOpend = true;
    },
  },
  watch: {
    // 监听vuex中musicId的变化
    "$store.state.musicId"(id) {
      console.log("vuex中的id发生了变化");
      // 先暂停当前播放的音乐
      this.pauseMusic();
      // 获取播放的音乐的歌单
      this.musicList = this.$store.state.musicList;
      // 获取音乐详情
      this.getMusicDetailFromMusicList();
      // 获取歌曲URL
      this.getMusicDetail(id);
      // 重置时长
      durationNum = returnSecond(this.duration);
      // console.log(this.$refs.audioPlayer);
    },
    // 监听播放状态
    "$store.state.isPlay"(isPlay) {
      if (isPlay) {
        this.playMusic();
      } else {
        this.pauseMusic();
      }
    }
  },
  filters: {
    handleMusicTime,
  },
};
</script>

<style scoped>
.bottomControl {
  /* background-color: pink; */
  border-top: 1px solid #ddd;
  width: 100%;
  height: 55px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  z-index: 10000;
  background-color: #fff;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;
  cursor: pointer;
}

.avatar img {
  width: 100%;
}

.left {
  display: flex;
  align-items: center;
  width: 123px;
}

.musicInfo {
  color: rgb(37, 37, 37);
  font-size: 12px;
  width: 70px;
}

.musicName {
  margin-bottom: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.singer {
  transform: scale(0.9);
  margin-left: -3px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.center {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 60px;
}

.buttons {
  display: flex;
  align-items: center;
  height: 13px;
}

.buttons i {
  font-size: 20px;
  color: #313131;
}

.buttons span:nth-child(3) i {
  font-size: 25px;
}

.center .icon-xunhuan {
  font-size: 17px;
}
.center .icon-xihuan {
  font-size: 15px;
}

.right {
  display: flex;
  align-items: center;
  position: relative;
}

.volumeControl {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.icon-yinliang {
  font-size: 18px;
  margin-right: 7px;
}

.volumeSlider {
  width: 55px;
}

.icon-bofangliebiao {
  font-size: 18px;
  margin-right: 10px;
}

.progressSlider {
  width: 300px;
}

.buttons span {
  display: inline-block;
  width: 50px;
  box-sizing: border-box;
  text-align: center;
}

.icon-zantingtingzhi {
  font-size: 35px !important;
}

.drawerHeader {
  font-size: 12px;
  transform: scale(0.9);
  color: #aaa;
  padding: 15px 0;
}

.progressBar {
  display: flex;
  align-items: center;
}

.currentTime,
.totalTime {
  font-size: 12px;
  transform: scale(0.85);
  color: #aaa;
  margin: 0 5px;
  width: 30px;
  text-align: center;
}

.progressBar {
  height: 10px;
  margin-top: 12px;
  overflow: hidden;
}

.like {
  color: #ec4141 !important;
}

.downloadContainer {
  height: 100%;
  position: relative;
}

.downloadContainer i {
  position: absolute;
  bottom: 5px;
}

.recondInfo {
  position: absolute;
  font-size: 12px;
  transform: scale(0.8);
  width: 140px;
  right: -5px;
  bottom: -5px;
}

.center .icon-suiji1 {
  font-size: 15px;
}
</style>