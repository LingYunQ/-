<template>
  <!-- 发现音乐 ---  歌单页 -->
  <div class="musicListDetail">
    <!-- 精选歌单入口展示 -->
    <div class="highqualityEntry">
      <!-- 精选歌单背景图 -->
      <img
        :src="theFirstOfHighquality.coverImgUrl"
        alt=""
        class="backgroundImg"
      />
      <div class="cover">
        <!-- 精选歌单小图 -->
        <img :src="theFirstOfHighquality.coverImgUrl" alt="" />
      </div>
      <div class="EntryInfo">
        <div class="tag"><i class="iconfont icon-good"></i> 精品歌单</div>
        <div class="name">{{ theFirstOfHighquality.name }}</div>
        <div class="desc">{{ theFirstOfHighquality.copywriter }}</div>
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="musicListNavBar">
      <!-- 分类导航 -->
      <div class="left"></div>
      <div class="right">
        <!--  
          @clickSecondBarItem="clickSecondBarItem" --- 点击切换歌单分类
           :SecondNavBarData="hotTags" --- 标签名
        -->
        <!-- 标签栏组件 -->
        <second-nav-bar
          :SecondNavBarData="hotTags"
          :itemWidth="0"
          :currentTag="currentTag"
          @clickSecondBarItem="clickSecondBarItem"
        ></second-nav-bar>
      </div>
    </div>
    <!-- 
      展示歌单列表 --- :listCardData="musicList.playlists"
      @clickListCardItem="clickListCardItem" --- 跳转到歌单详情页
    -->
    <list-card
      :listCardData="musicList.playlists"
      @clickListCardItem="clickListCardItem"
    ></list-card>
    <!-- 分页 -->
    <div class="page" v-if="musicList.playlists">
      <!-- 分页器 ---  一页50个 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="musicList.total"
        :page-size="50"
        small
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
    <!-- 返回顶部组件 -->
    <go-top scrollObj=".musicListDetail"></go-top>
  </div>
</template>

<script>
import SecondNavBar from "components/secondNavBar/SecondNavBar.vue";
import ListCard from "components/listCard/ListCard.vue";
import { Notification } from 'element-ui';
import GoTop from "components/goTop/GoTop.vue";
export default {
  components: {
    SecondNavBar,
    ListCard,
    GoTop
  },
  name: "musicListIndex",
  data() {
    return {
      theFirstOfHighquality: {}, // 精品歌单信息
      hotTags: [], // 分类导航数据
      musicList: {}, // 根据歌单分类请求歌单列表
      currentTag: {}, // 默认展示的数据
      currentPage: 1,// 分类数据
      index:20
    };
  },
  methods: {
    // 处理请求事件
    // 获取精品歌单的数据
    async getTheFirstOfHighquality() {
      let result = await this.$request("/top/playlist/highquality", {
      });
      console.log(result);
      // 精品歌单信息
      // 精品歌单有50个对象,index是下标
      // 当到了最后一个时回到第一个展示
      if(this.index===51){
        this.index = 1
      }else{
        // 更换展示数据
        this.index++
      }
      // 获取精品歌单信息
      this.theFirstOfHighquality = result.data.playlists[this.index];
      // console.log(this.theFirstOfHighquality);
    },
    // 获取热门歌单tag数据
    async getHotTag() {
      let result = await this.$request("/playlist/hot");
      // console.log(result);
      // 默认展示的数据
      this.currentTag = result.data.tags[0];
      // 歌单分类导航数据
      this.hotTags = result.data.tags;
    },
    // 根据歌名请求歌单列表
    async getMusicList() {
      // 先清空musicList再重新渲染页面
      this.musicList = {};
      let result = await this.$request("/top/playlist", {
        cat: this.currentTag.name, // 歌曲类型
        offset: 50 * (this.currentPage - 1),
      });
      // console.log(result);
      // 里面的total可以用于分页，所以把整个对象都保存下来
      // 获取歌单列表
      this.musicList = result.data;
    },
    // 处理点击事件
    // 接收点击二级navbar的回调
    clickSecondBarItem(index) {
      // 接收到点击不同的标签,重新进行渲染和赋值,再次发送请求渲染数据
      // console.log(this.hotTags[index].name);
      this.currentTag = this.hotTags[index];
      this.currentPage = 1;
      // 先清空musicList再重新渲染页面
      this.getMusicList();
      this.getTheFirstOfHighquality();
    },
    //当页数发生改变时
    pageChange(page) {
      // page是当前页数
      // 请求下一页数据
      this.currentPage = page;
      // 重新进行渲染
      this.getMusicList();
    },
    // 点击歌单的回调
    clickListCardItem(id) {
      // 验证是否登录
      if (this.$store.state.isLogin == false) {
       const h = this.$createElement;
       Notification.warning({
          title: '通知',
          message: h('i', { style: 'color: teal'}, '登录后才能查看此内容'),
       })
        return
      } else {
        // id---传入歌单id
        this.$router.push({ name: "musicListDetail", params: { id } });
      }
    }
  },
  async created() {
    // 获取精品歌单信息
   await this.getTheFirstOfHighquality();
   // 获取tag数据
    await this.getHotTag();
    // 获取歌单列表
   await this.getMusicList();
  },
};
</script>

<style scoped>
.musicListDetail{
  overflow-y: scroll;
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
  margin: 10px 0;
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