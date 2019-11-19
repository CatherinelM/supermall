<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
<!--    <tab-control class="tab-control"-->
<!--                 :titles="['流行','新款','精选']"-->
<!--                 @tabClick="tabClick"-->
<!--                 ref="tabControl" ></tab-control>-->

<!--    <div class="wrapper">-->
<!--      <div class="content">-->
<!--        <home-swiper :banners="banners"></home-swiper>-->
<!--        <home-recommend-view :recommends="recommends"></home-recommend-view>-->
<!--        <feature-view></feature-view>-->
<!--        <tab-control class="tab-control" :titles="['流行','新款','精选']"-->
<!--                     @tabClick="tabClick"></tab-control>-->
<!--        <goods-list :goods="showGoods"></goods-list>-->
<!--      </div>-->
<!--    </div>-->

        <scroll class="content"
                ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="loadMore"

        >
          <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
          <home-recommend-view :recommends="recommends"></home-recommend-view>
          <feature-view></feature-view>
          <tab-control class="tab-control"
                       :titles="['流行','新款','精选']"
                       @tabClick="tabClick"
                       ref="tabControl" ></tab-control>
          <goods-list :goods="showGoods"></goods-list>
        </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommendView from './childComps/HomeRecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from '../../components/content/tabControl/TabControl'
  import GoodsList from '../../components/content/goods/GoodsList'
  import Scroll from '../../components/common/scroll/Scroll'
  import BackTop from '../../components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from "network/home"

  // import BScroll from 'better-scroll'

  export default {
    name: "Home",
    components:{
      NavBar,
      TabControl,
      HomeSwiper,
      HomeRecommendView,
      GoodsList,
      Scroll,
      BackTop,
      FeatureView
      // Swiper,
      // SwiperItem,
    },
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType:'pop',
        isShowBackTop:true,
        tabOffsetTop:0,
        isTabFixed:false
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    distroyed(){},
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据  goods接口失效了
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted(){
      // 1.图片加载完成的事件监听
      // 3.监听item中图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
        // console.log('-------');
        this.$refs.scroll.refresh()
      })
      // 2.获取tabControl的offsetTop
      // this.tabOffsetTop=this.$refs.tabControl
    },
    methods:{
      /**
       * 事件监听相关的方法
       * */

      // 防抖动
      // debounce(func,delay){
      //   let timer=null
      //
      //   return function (...args) {
      //     if(timer)clearTimeout(timer)
      //     timer =setTimeout(()=>{
      //       func.apply(this,args)
      //     },delay)
      //   }
      // },
      tabClick(index){
        // console.log(index)
        switch (index) {
          case 0:
            this.currentType='pop'
            break
          case 1:
            this.currentType='new'
            break
          case 2:
            this.currentType='sell'
        }
      },
      backClick(){
        this.$refs.scroll.scroll.scrollTo(0,0,500)
      },
      contentScroll(position){
        // console.log(position);
        //1.判断BackTop是否显示
        this.isShowBackTop=(-position.y)>1000

        //2.决定tabControl是否吸顶（position:fiexd）
        this.isTabFixed =(-position.y)>this.tabOffsetTop
      },
      loadMore(){
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        this.tabOffsetTop=this.$refs.tabControl.$el.offsetTop;
      },

      /***
       * 网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          // console.log(res);
          // this.result=res;
          this.banners=res.data.banner.list;
          this.recommends=res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page=this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成下拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  /*头部息顶*/
  .tab-control{
    position: sticky;
    top: 44px;
    background-color: #fff;
    z-index: 9;
  }

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow:hidden;*/
  /*  !*background-color: red;*!*/
  /*  margin-top: 51px;*/
  /*}*/

  .content {
    /*height: 300px;*/
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.fixed {*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  top: 44px;*/
  /*}*/

</style>
