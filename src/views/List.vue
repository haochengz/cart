
<template>
<div>
<nav-header></nav-header>
<nav-crumbs><span>Goods List</span></nav-crumbs>

<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default" v-bind:class="sortingField == 'default' ? 'cur' : ''" @click="sortByDefault">Default</a>
      <a href="javascript:void(0)" class="price" v-bind:class="sortingField == 'price' ? 'cur' : ''" @click="sortByPrice">Price <svg class="icon icon-arrow-short" v-bind:class='{"sort-up":sortingFlag}' v-if='sortingField === "price"'><use xlmns:xlink:href="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="popFilter">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" v-bind:class="{'filterby-show':filterPop}" id="filter">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" v-bind:class="{'cur': priceChecked == 'all'}" @click="priceFilterReset">All</a></dd>
          <dd v-for="(price, index) in priceFilter" v-bind:key="index">
            <a href="javascript:void(0)" v-bind:class="{'cur': priceChecked == index}" @click="priceFilterClick(index)">{{price.start}} - {{price.end}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item, index) in goods" v-bind:key="index">
              <div class="pic">
                <a href="#"><img v-lazy="'/static/img/'+item.image" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.name}}</div>
                <div class="price">{{item.price}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.id)">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
          <div class="loadMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <img src="/static/loading/loading-spinning-bubbles.svg" v-show="loadingImg">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<modal v-bind:mdShow='unlogin' v-on:close='closeModal()'>
  <p slot='message'>Please login</p>
  <div slot='btn'>
    <button class='btn btn--m' @click='unlogin=false'>CLOSE</button>
  </div>
</modal>
<modal v-bind:mdShow='addSuccess' v-on:close='closeModal()'>
  <p slot='message'>Add new item to cart success</p>
  <div slot='btn'>
    <button class='btn btn--m' @click='closeModal'>Keep Shopping</button>
    <router-link class='btn btn--m' to='/cart'>Goto register</router-link>
  </div>
</modal>
<div class="md-overlay" v-show="overLayFlag" @click="closeFilter"></div>
<nav-footer></nav-footer>
</div>
</template>

<script>
/* eslint-disable */

import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/checkout.css'
import './../assets/css/login.css'

import NavHeader from '../components/navheader'
import NavCrumbs from '../components/navcrumbs'
import NavFooter from '../components/navfooter'
import Modal from '../components/modal'
import axios from 'axios'

export default {
  components: {
      NavHeader,
      NavCrumbs,
      NavFooter,
      Modal
  },
  data() {
      return {
        goods: [],
        priceFilter: [
          {
          start: '0.00',
          end: '500.00'
        },
        {
        start: '500.00',
        end: '1000.00'
        },
        {
        start: '1000.00',
        end: '2000.00'
        },
      ],
      priceChecked: "all",
      unlogin: false,
      filterPop: false,
      overLayFlag: false,
      sortingField: 'default',
      sortingFlag: false,
      addSuccess: false,
      page: 1,
      pageSize: 8,
      busy: true,
      filter: {
        field: 'all',
          starts: 0,
        ends: 0
      },
      loadingImg: false
    }
  },
  methods: {
    getGoods(append=false) {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sorting: (this.sortingFlag ? 1 : -1),
        sortingField: this.sortingField,
        filterField: this.filter.field,
        filterStarts: this.filter.starts,
        filterEnds: this.filter.ends
      }
      this.loadingImg = true
      axios.get('/list', {
        params: params
      }).then((res) => {
        this.loadingImg = false
        if(append){
          this.goods = this.goods.concat(res.data.result.list)
          if(res.data.result.count < this.pageSize){
            this.busy = true
          }
          else {
            this.busy = false
          }
        }
        else{
          this.goods = res.data.result.list
          this.busy = false
        }
      }).catch(err => {
        this.loadingImg = false
        console.log("Something wrong when asking goods data")
        console.log(err)
      })
    },
    sortByPrice() {
      if(this.sortingField === 'default'){
        this.sortingField = 'price'
      }
      else{
        this.sortingFlag = !this.sortingFlag
      }
      this.page = 1
      this.getGoods()
    },
    sortByDefault() {
      if(this.sortingField === 'price'){
        this.sortingField = 'default'
        this.page = 1
        this.getGoods()
      }
    },
    loadMore() {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoods(true)
      }, 1000)
    },
    priceFilterClick(index) {
      if(this.priceChecked != index){
        this.page = 1
        this.filter.field = 'price'
        this.filter.starts = this.priceFilter[index].start
        this.filter.ends = this.priceFilter[index].end
        this.getGoods()
      }
      this.priceChecked = index
      this.closeFilter()
    },
    priceFilterReset() {
      if(this.priceChecked != 'all'){
        this.page = 1
        this.filter.field = 'all'
        this.filter.starts = 0
        this.filter.ends = 0
        this.getGoods()
      }
      this.priceChecked = 'all'
      this.closeFilter()
    },
    popFilter() {
      this.filterPop = true
      this.overLayFlag = true
    },
    closeFilter() {
      this.filterPop = false
      this.overLayFlag = false
    },
    addCart(productId){
      axios.put("/list/cart", {
        productId: productId
      }).then(res => {
        console.log('Response from server: ')
        console.log(res.data.status)
        if(res.data.status === "0"){
          console.log("Going to error branch")
          this.unlogin = true
          this.addSuccess = false
        }
        else{
          this.unlogin = false
          this.addSuccess = true
        }
      }).catch(err => {
        alert("Exception cause by framework " + err.message)
      })
    },
    closeModal() {
      this.unlogin = false
      this.addSuccess = false
    }
  },
  mounted() {
    this.getGoods()
  }
}
</script>

<style scoped>
.loadMore {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.sort-up {
  transform: rotate(180deg);
  transition: all .3s ease-out;
}
</style>
