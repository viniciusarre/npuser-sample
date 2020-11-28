<template lang="pug">
div
  div(class="container")
    label(for="email") Emailasdasd
    input(type="email", v-model="email", id="email", name="email", required, :class="{ invalid: !isValid }")
  div(class="columns")
    button(v-on:buttonClicked="authUser", title="Submit", :disabled="!isValid") Submit
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      email: ''
    }
  },
  computed: {
    isValid () {
      /* The goal is to just do a  cursory test to prevent obvious errors. Don't get fancy here... */
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(String(this.email).toLowerCase())
    }
  },
  methods: {
    authUser () {
      console.log('authUser', this.email)
      this.$emit('email-submit', this.email)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../scss/definitions';
  .columns {
    margin-bottom: 1rem;
  }
</style>
