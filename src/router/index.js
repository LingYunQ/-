import Vue from 'vue';
import VueRouter from 'vue-router'

const Index = () => import('components/Index.vue')
const Discover = () => import('../views/discover/Discover')
const Recommend = () => import('../views/discover/recommend')
const single = () => import('../views/discover/singlepage')
const ranking = () => import('../views/discover/ranking')
const singer = () => import('../views/discover/singer')
const MusicListDetail = () => import('views/musicListDetail/MusicListDetail.vue')
const SingerDetail = () => import('views/singerDetail/singerDetail.vue')
const SearchSong = () => import('../views/SearchSong/SearchSong.vue')
const userLogin = () => import('../components/login/Login.vue')
const Video = () => import('views/video/Video.vue')
const VideoList = () => import('views/video/videoChildren/VideoList.vue')
const MvList = () => import('views/video/videoChildren/MvList.vue')
const VideoDetail = () => import('views/videoDetail/VideoDetail.vue')
Vue.use(VueRouter)

const routes = [
    { path: '/Login', name: 'login', component: userLogin },
    { path: '/', redirect: '/index'},
     // 歌单详情
    {
        path: '/index',
        component: Index,
        redirect: '/discover',
        children: [
            {
                path: '/discover',
                component: Discover,
                // 发现音乐页
                redirect: '/discover/recommend',
                children: [
                    // 个性推荐
                    { path: '/discover/recommend', component: Recommend },
                    // 歌单
                    { path: '/discover/single', component: single },
                    // 排行榜
                    { path: '/discover/ranking', component: ranking },
                    // 歌手
                    { path: '/discover/singer', component: singer },
                ]
            },
            // 视频
            {
                path: '/video', component: Video,
                redirect: '/video/videolist',
                children: [
                    { path: '/video/videolist', component: VideoList },
                    { path: '/video/mvlist', component: MvList },
                ]
            },
              // 歌单详情页面
        { path: '/musiclistdetail/:id', name: 'musicListDetail', component: MusicListDetail },
            // 歌手详情页面
        { path: '/singerDetail/:id', name: 'singerDetail', component: SingerDetail },
        { path: '/search/searchsong/:id', name: 'search', component: SearchSong },
        { path: '/videodetail/:id/:type', name: 'videoDetail', component: VideoDetail }
        
        ],
        },
      
]

const router = new VueRouter({
    routes,
    mode: 'history',
})

export default router
