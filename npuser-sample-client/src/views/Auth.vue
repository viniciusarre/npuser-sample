<template lang="pug">
div
  div(v-if="isPendingUserEmail")
    login-form-input-email(v-on:email-from-user="authUser($event)")
  div(v-if="isPendingVerificationCode")
    div(class="columns")
      div Email sent to: {{ state.email }} Message: {{ state.msg }}
    div(class="columns")
      login-form-input-v-code(v-on:vcode-from-user="verifyUser($event)", v-on:cancel="cancelLogin()")
    div(class="columns")
      input(type="checkbox", v-model="state.consent", id="consent", name="consent", required)
      label(for="consent") Consent text here
</template>

<script lang="ts">
import { reactive, computed } from 'vue'
import LoginFormInputEmail from '@/components/LoginFormEmail.vue'
import LoginFormInputVCode from '@/components/LoginFormVCode.vue'

export default {
  components: {
    LoginFormInputEmail, LoginFormInputVCode
  },
  setup () {
    const state: any = reactive({
      isPendingUserEmail: true,
      isPendingVerificationCode: true,
      email: '',
      vcode: '',
      consent: false,
      msg: computed(() => 'Email: ' + state.email + '. Code: ' + state.vcode)
    })

    const cancelLogin = () => {
      state.email = ''
      state.vcode = ''
      state.consent = false
      state.isPendingUserEmaile = true
      state.isPendingVerificationCode = false
    }

    const authUser = async (email: string) => {
      console.log('authUser with email', email)
      // await StoreHelper.submitDemoUserEmail(email)
      state.email = email
      state.isPendingUserEmail = false
      state.isPendingVerificationCode = true
    }

    const verifyUser = async (vcode: string) => {
      console.log('user provided vcode and consented too', vcode)
      state.vcode = vcode
      state.isPendingVerificationCode = false
      // this.createDemo()
    }

    /* ---------------------------------------------------- */
    return {
      state,
      cancelLogin,
      authUser,
      verifyUser
    }
  }
}
</script>
