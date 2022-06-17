import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    // 是否登录
    isLogin: false,
    // 音乐url
    musicId: '',
    // 当前播放的歌单
    musicList: [],
    // 当前播放音乐的索引
    currentIndex: -1,
    // 音乐详情卡片的显隐
    isMusicDetailCardShow: false,
    // 当前播放时长
    currentTime: 0,
    // 音乐的播放状态
    isPlay: false,
    // 音乐是否在加载中
    isMusicLoad: false,
};
// 创建Store对象
const store = new Vuex.Store({
    state,
    mutations: {
        // 更新音乐url
        updateMusicId(state, musicUrl) {
            state.musicId = musicUrl;
            // console.log(state.musicId);
        },
        //更新登录状态
        updataLoginState(state, flag = false) {
            state.isLogin = flag;
        },
        // 修改播放状态
        changePlayState(state, isPlay) {
            state.isPlay = isPlay;
            console.log(isPlay);
        },
        // 更新歌单列表和歌单id
        updateMusicList(state, payload) {
            // 当歌单id发生变化时,重置当前播放音乐索引
            if (payload.musicListId != state.musicListId) {
                state.musicListId = payload.musicListId;
                state.currentIndex = -1;
            }
            // console.log(state.currentIndex);
            // 歌单是固定的死数据，而vuex中的musicList是动态的
            let musicList = payload.musicList.slice(0)
            state.musicList = musicList;
            // console.log('updateMusicList');
        },
        // 当前播放时间
        updateCurrentTime(state, currentTime) {
            state.currentTime = currentTime;
        },
        // 当前播放音乐的索引
        updateCurrentIndex(state, index) {
            // console.log('updateCurrentIndex');
            state.currentIndex = index;
        },
        // 切换音乐详情卡片的显隐
        changeMusicDetailCardState(state) {
            state.isMusicDetailCardShow = !state.isMusicDetailCardShow;
            console.log(state.isMusicDetailCardShow);
        },
        // 更新音乐的加载状态
        updateMusicLoadState(state, isLoad) {
            state.isMusicLoad = isLoad;
        },
    },
})


// 挂载Vue实例
export default store;