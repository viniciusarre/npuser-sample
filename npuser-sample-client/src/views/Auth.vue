<template lang="pug">
div
  div(v-if="state.isPendingUserEmail")
    login-form-input-email(v-on:email="authUser($event)")
    p.
      NP user and this sample application consider your personal information to be yours and yours alone.
    p.
      By clicking the button above, you agree to allow this sample client application to share your email address with the NP User Authentication service (see <a href="npuser.org">npuser.org</a>).  The NP User Authentication service will now send you one email message with a verification code and then that service will immediately forget everything about you.
    p.
      To help keep our system safe and running, this application will store your IP address for up to one day. This is only used to prevent malicious users from over loading the system and denying you access.
    p Please write to us if you have any questions or concerns at <a href="mailto:info@npuser.org">info@npuser.org</a>
    hr
  div(v-if="state.isPendingVerificationCode")
    login-form-input-v-code(v-on:vcode="verifyUser($event)", v-on:cancel="cancelLogin()")
    p.
      NP user and this sample application consider your personal information to be yours and yours alone.
    p.
      The NP User Authentication service (see <a href="npuser.org">npuser.org</a>) has sent you an email and it no longer knows anything about you.
    p.
      Now, by entering the verification code and clicking the button above you will be given access to the user only area of this sample application. This sample application will allow you to enter one personal note that only you can see or access. This sample application does not retain your email address. Your privacy is secure.
    p.
      This application will store a token in your browser's local storage (we do not use browser cookies).  As long as you come back to this browser you can access whatever data you place into this sample client application. The server behind this sample client application server only knows you by a unique id created using the what is called a "one way hash". This id protects your private data without storing your email address in the system.


</template>

<script lang="ts">
import { reactive } from 'vue'
import LoginFormInputEmail from '@/components/LoginFormEmail.vue'
import LoginFormInputVCode from '@/components/LoginFormVCode.vue'

export default {
  components: {
    LoginFormInputEmail, LoginFormInputVCode
  },
  setup () {
    const state: any = reactive({
      isPendingUserEmail: true,
      isPendingVerificationCode: false,
      email: '',
      token: '',
      vcode: ''
    })

    const cancelLogin = () => {
      state.email = ''
      state.vcode = ''
      state.token = ''
      state.isPendingUserEmail = true
      state.isPendingVerificationCode = false
    }

    const authUser = async (email: string) => {
      console.log('authUser with email', email)
      // await StoreHelper.submitDemoUserEmail(email)
      state.email = email
      state.isPendingUserEmail = false
      state.isPendingVerificationCode = true

      const authResponse = await np.sendAuth(state.email)
      console.log('Auth response:', authResponse)
      state.token = authResponse.token
    }

    const verifyUser = async (vcode: string) => {
      console.log('user provided vcode and consented too', vcode)
      state.vcode = vcode
      state.isPendingVerificationCode = false

      const validationResponse = await np.sendValidation(state.email, state.token, state.vcode)
      console.log('Validation response:', validationResponse)
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
