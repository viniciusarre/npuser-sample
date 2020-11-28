<template lang="pug">
div
  div(id="app-banner")
    div(id="nav")
      router-link(to="/") Home
      div(class="nav-spacer")
      router-link(to="/about") About
      div(class="nav-spacer")
      router-link(to="/auth") Sign in
      div(class="nav-spacer")
      router-link(to="/dashboard") User Dash
  div(class="page-content")
    router-view
</template>

<style scoped lang="scss">
  @import './scss/definitions';
</style>
