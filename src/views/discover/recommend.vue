<template>
<!-- 发现音乐---个性推荐页 -->
  <div class="recommendContainer">
    <!-- 轮播图 -->
    <div class="recommend">
      <div class="carousel">
        <el-carousel  :interval="4000" type="card" height="170px">
          <el-carousel-item  v-for="(item, index) in bannerData" :key="index">
            <img @click="clica(index)" :src="item.imageUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 推荐歌单 -->
      <div class="recommendMusicList">
        <h3>推荐歌单<i class="iconfont icon-arrow-right-bold" style="color: #b2bec3;"></i></h3>
        <list-card
          :listCardData="musicList"
          @clickListCardItem="clickListCardItem"
        ></list-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Notification } from 'element-ui';
import ListCard from "components/listCard/ListCard.vue";
import {  handleMusicTime } from "plugins/utils";
export default {
  components: { ListCard },
  name: "Recommend",
  data() {
    return {
      // 轮播图数据
      bannerData: [],
      // recommend页面显示的musicList
      musicList: [], // 推荐歌单数据
    };
  },
  methods: {
    // 请求轮播图数据
    async getBannerData() {
      let result = await this.$request("/banner");
      this.bannerData = result.data.banners;
      // console.log(result.data.banners);
    },

    // 请求推荐歌单数据
  async  getMusicList() {
     await this.$request("/personalized", { limit: 20 }).then((res) => {
        // console.log(res);
        this.musicList = res.data.result;
      });
    },
    // 点击歌单封面的回调
    clickListCardItem(id) {
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
    },
  async clica(){
   
    }
  },
  created() {
    this.getBannerData();
    this.getMusicList();
  },
};
</script>

<style scoped>
.recommendContainer {
  display: flex;
  justify-content: center;
}

.recommend {
  max-width: 1000px;
}

.carousel {
  width: 100%;
}

.el-carousel {
  margin: auto;
  width: 880px;
}

.el-carousel__item {
  border-radius: 7px;
}

.el-carousel__item img {
  height: 100%;
  width: 100%
}

.recommendMusicList {
  margin: 20px 10px;
  font-size: 15px;
}

.recommendMusicList h3 {
  color: #373737;
}
</style>