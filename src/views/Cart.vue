
<template>
    <div>
        <nav-header></nav-header>
        <nav-crumbs><span>Counter</span></nav-crumbs>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/checkout.css'
import './../assets/css/login.css'

import NavHeader from '../components/navheader'
import NavCrumbs from '../components/navcrumbs'
import NavFooter from '../components/navfooter'
import Modal from '../components/modal'
// import axios from 'axios'

export default {
  components: {
    NavHeader,
    NavCrumbs,
    NavFooter,
    Modal
  }
}
</script>
