<template lang="pug">
div(class="form-container")
  div(class="form-group")
    label(for="vcode") Verification Code
    input(type="text", v-model="vcode", id="vcode", name="vcode", :class="{ invalid: !isValid }")
  div(class="form-group")
    label(for="vcode") Verifi
    input(type="text", v-model="vcode", id="vcode2", name="vcode", :class="{ invalid: !isValid }")
  div(class="button-group")
    button(v-on:buttonClicked="verifyUser", title="Submit", :disabled="!canSubmit") Submit
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
  .formGroup {
    display: flex;
    flex-direction: row;
    columns: 2;
    column-width: auto;
    margin-bottom: 1rem;
  }
</style>
