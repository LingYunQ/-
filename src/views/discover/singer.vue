<template>
  <!-- 发现音乐-歌手页 -->
  <div class="singerContainer">
    <div class="singer">
      <!-- 歌手分类选择 -->
      <div class="selectors">
        <div class="selectorItem">
          <div class="title">语种：</div>
          <second-nav-bar
            :SecondNavBarData="languageSort"
            @clickSecondBarItem="areaItem"
            class="secondNavBar"
          ></second-nav-bar>
        </div>
      </div>
      <div class="selectorItem">
        <div class="title">分类：</div>
        <second-nav-bar
          :SecondNavBarData="typeSort"
          @clickSecondBarItem="typeItem"
          class="secondNavBar"
        ></second-nav-bar>
      </div>
      <div class="listCardContainer">
        <!-- 歌手列表 -->
        <list-card
          class="listCard"
          :listCardData="singerList"
          isLoad
          @bottomLoad="bottomLoad"
          @clickListCardItem='clickListCardItem'
        ></list-card>
      </div>
    </div>
    <!-- 回到顶部 -->
    <go-top scrollObj=".singerContainer"></go-top>
  </div>
</template>

<script>
import { Notification } from 'element-ui';
import ListCard from "components/listCard/ListCard.vue";
import SecondNavBar from "components/secondNavBar/SecondNavBar.vue";
import GoTop from "components/goTop/GoTop.vue";
export default {
  components: { SecondNavBar, ListCard, GoTop },
  name: "singer",
  data() {
    return {
      languageSort: [
        { area: -1, name: "全部" },
        { area: 7, name: "华语" },
        { area: 96, name: "欧美" },
        { area: 8, name: "日本" },
        { area: 16, name: "韩国" },
        { area: 0, name: "其它" },
      ],
      typeSort: [
        { type: -1, name: "全部" },
        { type: 1, name: "男歌手" },
        { type: 2, name: "女歌手" },
        { type: 3, name: "乐队" },
      ],
      // 基础数据
      area: -1,// 地区类型
      type: -1,// 歌手类型
      currentPage: 1,// 当前所在页数
      singerList: [],// 歌手数据
      isMore: false,// 是否还有更多数据
    };
  },
  methods: {
    // 请求
    // 请求歌手列表
    async getSingerList() {
      let res = await this.$request("/artist/list", {
        type: this.type, //-1:全部 1:男歌手 2:女歌手 3:乐队
        area: this.area, //-1:全部 7华语 96欧美 8:日本 16:韩国 0:其他
        offset: (this.currentPage - 1) * 30,
      });
      // console.log(res);
      // 对是否还有更多数据进行赋值,方便判断
      this.isMore = res.data.more
      // 将请求的新数组和老数组组合为一个新的数组
      this.singerList.push(...res.data.artists);
    },
    // 事件处理
    // 地区
    async areaItem(index) {
      // 将点击的地区类型的下标的(area)值赋值给请求数据的(area)值
      this.area = this.languageSort[index].area;
      // 然后清空歌手数据列表
      this.singerList = [];
      // 用请求到的新数据重新渲染页面
      await this.getSingerList();
    },
    // 分类
   async typeItem(index) {
      // 将点击的歌手类型的下标的(type)值赋值给请求数据的(type)值
      this.type = this.typeSort[index].type;
      // 然后清空歌手数据列表
      this.singerList = [];
       // 用请求到的新数据重新渲染页面
      await this.getSingerList();
    },
    // 点击歌手item的回调
    clickListCardItem(id) {
      // console.log(id);
      if (this.$store.state.isLogin == false) {
       const h = this.$createElement;
       Notification.warning({
          title: '通知',
          message: h('i', { style: 'color: teal'}, '登录后才能查看此内容'),
       })
        return
      } else {
        // id---传入歌单id
        this.$router.push({ name: "singerDetail", params: { id } });
      }
    },
    // 触底事件
   async bottomLoad() {
      // console.log(this.isMore);
      // 判断是否还有更多数据
      if( this.isMore === true ){
        // 如果有，就让请求的页数触底一次就加 1
      this.currentPage++
      // 然后再请求数据，合并数组，渲染数据
     await  this.getSingerList()
      }else{
        // 没有了就直接返回
        return
      }
    },
  },
  created() {
    this.getSingerList();
  },
  mounted() {},
};
</script>

<style scoped>
.singerContainer {
  display: flex;
  justify-content: center;
}

.singer {
  max-width: 1000px;
  padding: 0 10px;
}

.selectorItem {
  display: flex;
}

.title {
  font-size: 12px;
  width: 40px;
  line-height: 33px;
}

.secondNavBar {
  width: calc(100% - 60px);
}

.page {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.listCardContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>