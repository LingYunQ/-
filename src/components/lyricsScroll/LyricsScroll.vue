<template>
  <!-- 歌词-歌词滚动 -->
  <div class="lyrics">
    <!-- 占位 -->
    <div class="placeholder"></div>
    <!-- 因为歌词快了一句,所以减1 -->
    <!-- 歌词item -->
    <div
    @click="item(index)"
      class="lyricsItem"
      :class="lyricsIndex - 1 == index ? 'currentLyric' : ''"
      v-for="(item, index) in lyric"
      :key="index"
    >
      {{ item[1] }}
    </div>
    <!-- 占位 -->
    <div class="placeholder"></div>
  </div>
</template>

<script>
export default {
  name: "LyricsScroll",
  props: {
    lyric: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      // 当前歌词索引
      lyricsIndex: 0,
    };
  },
  methods: {
    // 实现歌词滚动
    lyricScroll(currentLyric) {
      // 获取歌词item
      let lyricsArr = document.querySelectorAll(".lyricsItem");
      // 获取歌词框
      let lyrics = document.querySelector(".lyrics");
      // console.log(currentLyric);
      // currentLyric 当前歌词的索引
      // 歌词所在的位置 = 第几句歌词的offsetTop - 歌词框的offsetTop
      let distance = lyricsArr[currentLyric].offsetTop - lyrics.offsetTop;
      // 平滑滚动到当前歌词所在位置
      lyrics.scrollTo({
        behavior: "smooth",
        top: distance - 150,
      });
    },
    //获取当前歌词索引
    getCurrentLyricsIndex(currentTime) {
      // 当前播放时间位置
      // console.log(currentTime);
      let lyricsIndex = 0;
      this.lyric.forEach((item) => {
        // console.log(item);
        // item[0] --- 所有的歌词时间
        // 当前歌词时间大于了所有歌词时间里的某一个,lyricsIndex歌词所在的索引就加 1, 就找到当前播放时间的歌词索引
        if (currentTime > item[0]) {
          lyricsIndex += 1;
        }
      });
      // console.log(lyricsIndex);
      // 获取当前是第几句歌词
      this.lyricsIndex = lyricsIndex;
    },
  },
  mounted() {
    this.lyricScroll(this.lyricsIndex)
  },
  watch: {
    // 监听当前播放时间
    "$store.state.currentTime"(currentTime, priorTime) {
      // currentTime--现在的时间  priorTime--之前的时间
      // console.log(currentTime,priorTime);
      // 如果两个时间的间隔有1秒,则进度条被拖动 需要重新校准歌词所处位置
      // 返回两个数的绝对值再相减
      if (Math.abs(currentTime - priorTime) >= 1) {
        // 处理播放时间跳转时歌词位置的校准
        // 传入当前播放时间进入 getCurrentLyricsIndex 方法进行调用 获取歌词索引
        this.getCurrentLyricsIndex(currentTime);
        // 滑动到当前歌词 --- 传入歌词索引
        this.lyricScroll(this.lyricsIndex);
      }
      // 根据实时播放时间实现歌词滚动
      // 当前歌词时间大于了 现在歌词时间,lyricsIndex歌词所在的索引就加 1 就找到当前播放时间的歌词索引 
        if (currentTime > this.lyric[this.lyricsIndex][0]) {
          // console.log(currentTime);
          // console.log(this.lyric[this.lyricsIndex]);
          this.lyricsIndex += 1;
          // 传入找到的歌词索引调用 lyricScroll 方法
          this.lyricScroll(this.lyricsIndex);
        }
    },
  }
};
</script>

<style scoped>
.lyrics {
  width: 100%;
  height: 275px;
  font-size: 12px;
  text-align: center;
  overflow-y: scroll;
}

.lyrics::-webkit-scrollbar {
  display: none;
}

.lyricsItem {
  font-size: 12px;
  /* height: 20px; */
  margin: 25px 20px;
  transition: all 0.5s;
  line-height: 20px;
}

.currentLyric {
  font-weight: 600;
  font-size: 14px;
  color: black;
}

.placeholder {
  width: 100%;
  height: 40%;
}
</style>