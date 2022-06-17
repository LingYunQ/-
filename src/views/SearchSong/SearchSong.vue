<template>
  <div class="SearchSong">
    <div class="tip">找到 {{ songCount }} 首单曲</div>

    <div class="highqualityEntry" @click="singer">
      <!-- 背景图 -->
      <img
        :src="multiMatch.artist[0].img1v1Url"
        alt=""
        class="backgroundImg"
      />
      <!-- 歌手头像 -->
      <div class="cover">
        <img :src="multiMatch.artist[0].img1v1Url" alt="" />
      </div>
      <div class="EntryInfo">
        <div class="tag">最佳匹配</div>
        <div class="name">歌手:{{ multiMatch.artist[0].name }}</div>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="searchSongList"
      size="mini"
      style="width: 100%"
      @row-dblclick="clickRow"
      highlight-current-row
      stripe
    >
      <el-table-column label="" width="35" type="index" :index="handleIndex">
      </el-table-column>
      <el-table-column label="" width="23">
      </el-table-column>
      <el-table-column prop="name" label="音乐标题" min-width="200">
      </el-table-column>
      <el-table-column prop="ar[0].name" label="歌手" min-width="100">
      </el-table-column>
      <el-table-column prop="al.name" label="专辑" min-width="170">
      </el-table-column>
      <el-table-column prop="dt" label="时长" min-width="60"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page" v-if="searchSongList.length != 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="songCount"
        small
        :page-size="30"
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { handleMusicTime } from "plugins/utils";
export default {
  name: "SearchSong",
  data() {
    return {
      multiMatch: {}, // 最佳匹配
      searchSongList: [], // 搜索详情
      songCount: 0, // 歌曲总数
      currentPage: 1,// 分页数据
    };
  },
  methods: {
    // 请求
    // 获取最佳匹配
    async getMultMath() {
      let res = await this.$request("/search/multimatch", {
        keywords: this.$route.params.id,
      });
      this.multiMatch = res.data.result;
    },

    // 请求搜索单曲
    async getSearchSong() {
      let res = await this.$request("/cloudsearch", {
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
      });
      console.log(res);
      // 歌曲总数
      this.songCount = res.data.result.songCount;
      // 搜索详情
      this.searchSongList = res.data.result.songs;
      // 对数据的音乐时长进行处理
      this.searchSongList.forEach((item, index) => {
        this.searchSongList[index].dt = handleMusicTime(item.dt);
      });
    },

    // 事件响应
    // 处理索引
    handleIndex(index) {
      // console.log(index);
      index = index + 1 + 30 * (this.currentPage - 1);
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    // 双击table的row的回调
    async clickRow(row) {
      // 这里双击应该是要把当前双击的歌曲插入到当前的歌单中
      // 首先获取当前的歌单列表和歌曲索引
      let musicList = this.$store.state.musicList;
      let currentIndex = this.$store.state.currentIndex;
      // 先判断该歌曲是否已经在歌单中存在，避免重复点击导致歌单出现相同歌曲
      this.$store.commit("changePlayState", false);
      // 将请求到的歌曲详情插入到歌单对应位置并提交至vuex
      musicList.splice(currentIndex + 1, 0, row);
      this.$store.commit("updateMusicId", row.id);
    },
    // 评论点击翻页的回调
    pageChange(page) {
      this.currentPage = page;
      this.searchSongList = [];
      this.getSearchSong();
    },
    singer(){
    this.$router.push({ name: "singerDetail", params: { id:this.multiMatch.artist[0].id } })
    }
  },
  created() {
    this.getMultMath();
    this.getSearchSong();
  },
  watch: {},
};
</script>

<style scoped>
.SearchSong {
  padding: 0 15px;
  margin-top: 10px;
}

.tip {
  font-weight: bold;
  color: rgb(34, 34, 34);
  margin-bottom: 10px;
}

.matchTitle {
  font-size: 12px;
  color: rgb(34, 34, 34);
  margin: 5px 0;
}

.matchResult {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background-color: #f4f4f4;
  width: 270px;
  height: 65px;
  margin-bottom: 20px;
  cursor: pointer;
}

.matchCover {
  width: 65px;
  height: 65px;
}

.matchCover img {
  width: 100%;
  height: 100%;
}

.matchName {
  font-size: 13px;
  color: rgb(31, 31, 31);
  margin-left: 10px;
}

.multiMatch i {
  position: absolute;
  transform: translateY(-50%);
  right: 15px;
  top: 50%;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
  margin: 20px 0;
}
.highqualityEntry {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}
.backgroundImg {
  position: absolute;
  z-index: -1;
  width: 100%;
  /* 纵向放大； */
  transform: translateY(-80px); 
  /* 滤镜  blur：模糊 brightness：调整亮度*/
  filter: blur(30px) brightness(70%);
}

.cover {
  width: 120px;
  height: 120px;
  margin: 10px;
}

.cover img {
  border-radius: 10px;
  width: 100%;
}

.tag {
  text-align: center;
  color: #d59e54;
  border: 1px solid #d59e54;
  padding: 5px 10px;
  width: 88px;
  font-size: 12px;
  margin: 20px 10px 15px;
  border-radius: 15px;
}

.tag i {
  font-size: 14px;
}

.name {
  color: white;
  font-size: 14px;
  margin-left: 10px;
}

.desc {
  color: rgba(255, 255, 255, 0.5);
  /* 字体直接写小于12没有效果 */
  font-size: 12px;
  transform: scale(0.9, 0.9);
}

.musicListNavBar {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
</style>