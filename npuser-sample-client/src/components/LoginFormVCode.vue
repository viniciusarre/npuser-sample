<template lang="pug">
div
  div(class="columns")
    div(class="column is-4")
      label(for="vcode") Verification Code
    div(class="column is-4")
      input(type="text", v-model="vcode", id="vcode", name="vcode", required, :class="{ invalid: !isValid }")
  div(class="columns")
    button(v-on:buttonClicked="verifyUser", :title="Submit", :disabled="!canSubmit") Submit
    button(v-on:buttonClicked="$emit('cancel')", title="Cancel") Cancel
</template>

<script>

export default {
  data () {
    return {
      vcode: ''
    }
  },
  computed: {
    isValid () {
      /* 5 digits */
      const re = /^\d{5,}$/
      return re.test(String(this.vcode))
    },
    canSubmit () {
      return this.isValid
    }
  },
  methods: {
    verifyUser () {
      console.log('verifyUser', this.vcode)
      this.$emit('vcode-from-user', this.vcode)
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../scss/definitions';

  .invalid {
    background-color: $invalid-background;
    border-color: $invalid-border;
    border-width: 1px;
  }

  .columns {
    margin-bottom: 1rem;
  }
</style>
