
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
      <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)">All</a></dd>
          <dd>
            <a href="javascript:void(0)">0 - 100</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item, index) in goods" v-bind:key="index">
              <div class="pic">
                <a href="#"><img v-bind:src="'/static/img/'+item.image" alt=""></a>
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
            goods: []
        }
    },
    methods: {
        getGoods() {
            axios.get('/api').then((res) => {
                this.goods = res.data.data;
         
                console.log("This goods loaded...")
                for(item of this.goods) {
                  console.log(item.name)
                }
            }).catch(err => {
                console.log("Something wrong when asking goods data")
            })
        }
    },
    mounted() {
        this.getGoods()
    }
}
</script>
