<template>
  <div class="home">
    <img alt="NPUser logo" src="../assets/npauth-icon.png">
    <HelloWorld msg="Welcome to the sample NPUser client application"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld
  }
})
</script>
