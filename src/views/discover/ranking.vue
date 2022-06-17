<template>
<!-- 排行榜页面 -->
  <div class="rankingContainer">
    <div class="ranking">
      <div class="offical">
        <div class="title" v-if="this.$store.isLogin">官方榜</div>
        <!-- 把循环过后的对象发送到 table 组件-->
        <list-table :officialList="item"
        v-for="item in officialListDetail" :key="item"
        @handleMusicList='handleMusicList'
        @clickCheckAll='clickCheckAll'
        @handleRowDbClick='handleRowDbClick'
         ></list-table>
      </div>
      <div class="global">
        <div class="title">全球榜</div>
        <!-- 展示歌单列表 -->
        <list-card
          class="listCard"
          :listCardData="globalList"
          @clickListCardItem="clickListCardItem"
        ></list-card>
      </div>
    </div>
  </div>
</template>

<script>
import { handleMusicTime } from "plugins/utils";
import { Notification } from 'element-ui';
import ListTable from "components/listTable/ListTable.vue";
import ListCard from "components/listCard/ListCard.vue";
export default {
  components: { ListTable, ListCard },
  name: "Ranking",
  data() {
    return {
      officialListDetail: [], // 四大榜单详情
      officialList: [], // 四大榜单
      globalList: [], // 剩余的全部榜单
    };
  },
   async created() {
    await this.getRankingList();// 请求所有榜单
    this.officialList.forEach((item) => {
      this.getMusicListDetail(item.id); // 请求四大榜单详情数据传入歌单id
    });
  },
  methods: {
    // 获取全部榜单
    async getRankingList() {
      const result = await this.$request("/toplist");
      // 用slice分类榜单
      this.officialList = result.data.list.slice(0, 4);
      this.globalList = result.data.list.slice(4);
    },
    // 其他榜单点击事件 --- 获取到歌单id进行跳转
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
    async getMusicListDetail(id) {
      let result = await this.$request("/playlist/detail", { id });
      result = result.data.playlist
      // console.log(result);
       // 对时间进行处理
      result.tracks.forEach((item, index) => {
        result.tracks[index].dt = handleMusicTime(item.dt);
      });
      // 将榜单详情添加进 officialListDetail数组
      this.officialListDetail.push(result)
    },
    // 点击四大榜单图片的回调
    handleMusicList({id}) {
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
    // 点击查看全部的回调
    clickCheckAll({id}) {
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
    // 双击table的回调
    handleRowDbClick({id,index}) {
      // console.log(id,index);
        let musicListIndex = this.officialListDetail.findIndex(
        (item) => item.id == id
      );
      // console.log(musicListIndex);
      this.$store.commit(
        "updateMusicId",
        id
      );
      // 如果歌单发生变化,则提交歌单到vuex
      if (id != this.$store.state.musicListId) {
        // 将歌单传到vuex
        this.$store.commit("updateMusicList", {
          musicList: this.officialListDetail[index].tracks,
          musicListId: id,
        });
      }
    }
  },
};
</script>

<style scoped>
.rankingContainer {
  display: flex;
  justify-content: center;
  width: 100%;
}

.ranking {
  max-width: 1000px;
  padding: 0 10px;
}

.listCard {
  margin-top: 15px;
}
</style>