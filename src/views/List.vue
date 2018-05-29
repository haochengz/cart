
<template>
<div>
<nav-header></nav-header>
<nav-crumbs><span>Goods List</span></nav-crumbs>

<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

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
import axios from 'axios'

export default {
    components: {
        NavHeader,
        NavCrumbs,
        NavFooter
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
            filterPop: false,
            overLayFlag: false
        }
    },
    methods: {
        getGoods() {
            axios.get('/list').then((res) => {
                this.goods = res.data.result.list;
            }).catch(err => {
                console.log("Something wrong when asking goods data")
                console.log(err)
            })
        },
        priceFilterClick(index) {
          this.priceChecked = index
          this.closeFilter()
        },
        priceFilterReset() {
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
        }
    },
    mounted() {
        this.getGoods()
    }
}
</script>
