<template>
<!-- 首页 -->
  <el-container>
    <el-header>
      <header-bar></header-bar>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="160px">
        <el-menu
          active-text-color="black"
          router
          :default-active="defaultActive"
        >
      
          <el-menu-item index="/discover">
            <i class="iconfont icon-yinle"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/video">
            <i class="iconfont icon-shipin"></i>
            <span slot="title">视频</span>
          </el-menu-item>
          <el-menu-item-group v-if="createdMusicList.length != 0">
            <template slot="title" class="groupTitle">创建的歌单</template>
            <el-menu-item
              v-for="(item, index) in createdMusicList"
              :key="index"
              :index="'/musiclistdetail/' + item.id"
            >
              <i class="iconfont icon-gedan"></i>{{ item.name }}</el-menu-item
            >
          </el-menu-item-group>
            <el-menu-item-group v-if="createdMusicList.length != 0">
            <template slot="title" class="groupTitle">收藏的歌单</template>
            <el-menu-item
              v-for="(item, index) in Playlistcreated"
              :key="index"
              :index="'/musiclistdetail/' + item.id"
            >
              <i class="iconfont icon-gedan"></i>{{ item.name }}</el-menu-item
            >
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view class="routerView" :key="$route.fullPath"></router-view>
     
      </el-main>
    </el-container>
     <bottom-control></bottom-control>
  </el-container>
</template>

<script>
import BottomControl from "components/bottomControl/BottomControl";
import HeaderBar from "components/headerBar/HeaderBar.vue";
export default {
  components: {
    HeaderBar,
    BottomControl
  },
  data() {
    return {
      defaultActive: "",
      // 创建的歌单数据
      createdMusicList: [],
      Playlistcreated:[]
    };
  },
  methods: {
    // 请求
    // 请求用户歌单
    async getUserMusicList() {
      if (!this.$store.state.isLogin) {
        // 说明已经退出登录
        this.$message.error("请先进行登录操作");
        return;
      }
      let timestamp = Date.parse(new Date());
      // 先从localStorage里面读取用户信息  如果登录成功是有存的
      let res = await this.$request("/user/playlist", {
        uid: window.localStorage.getItem("userId"),
        timestamp,
      });
      console.log(res);
      // 对数据进行处理分类
      res = res.data.playlist;
      // 创建的歌单
      this.createdMusicList = res.slice(0,2)
      // 收藏的歌单
      this.Playlistcreated = res.slice(2)
      this.createdMusicList[0].name = "我喜欢的音乐";
     
    },
  },
  created(){
    if(this.$store.state.isLogin)this.getUserMusicList()
    
  },
  watch: {
    // 监听vuex中的登录状态
    "$store.state.isLogin"(current) {
      console.log(current);
      // 登录了就发送请求
      if (current) {
        this.getUserMusicList();
      } else {
        // 未登录清空收藏歌单
        this.createdMusicList = [];
      }
    },
  },
};
</script>

<style scoped>
.is-active {
  background-color: #f6f6f7;
  font-size: 14px;
  font-weight: 600;
}

.iconfont {
  font-size: 14px;
  margin: 5px !important;
}

.routerView {
  padding: 0 15px;
  margin: 0;
  width: 100%;
  height: calc(80vh - 105px);
}

.el-header {
  background-color: #ec4141;
  height: 50px !important;
  padding: 0;
  margin: 0;
  z-index: 100;
}

.el-aside {
  border-right: 1px solid #ccc;
  height: calc(80vh - 105px);
}

.el-menu {
  border: none;
}

.el-menu-item:hover {
  background-color: #f5f5f6 !important;
}

.el-menu-item {
  font-size: 12px;
  padding: 0 0 0 10px !important;
  margin: 5px 0 !important;
  height: 30px;
  line-height: 30px;
}

.el-menu-item-group {
  margin-top: 10px;
}

.el-main {
  padding: 0;
}
</style>