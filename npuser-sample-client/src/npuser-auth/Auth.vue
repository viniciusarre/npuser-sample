<template lang="pug">
div
  div(v-if="state.isPendingUserEmail")
    login-form-input-email(v-on:email="authUser($event)")
    p(v-if="state.errMsg", class="error-text") {{state.errMsg}}
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
import LoginFormInputEmail from './LoginFormEmail.vue'
import LoginFormInputVCode from './LoginFormVCode.vue'
import axios from 'axios'
import State from '../state'

interface AuthState {
  isPendingUserEmail: boolean;
  isPendingVerificationCode: boolean;
  email: string;
  token: string;
  errMsg?: string;
}

const URL = 'http://localhost:3000/'

async function postIt (apiUrl: string, payload: object) {
  const url = URL + apiUrl
  console.log('PostIt', url)
  return axios
    .post(url, payload)
    .then(response => { return response.data })
    .catch(error => {
      console.log('postIt Rye', error)
      throw error
    })
}
export default {
  components: {
    LoginFormInputEmail, LoginFormInputVCode
  },
  setup () {
    const state: AuthState = reactive({
      isPendingUserEmail: true,
      isPendingVerificationCode: false,
      email: '',
      token: '',
      errMsg: undefined
    })

    const cancelLogin = () => {
      state.email = ''
      state.token = ''
      state.isPendingUserEmail = true
      state.isPendingVerificationCode = false
      state.errMsg = undefined
    }

    const authUser = async (email: string) => {
      State.setLoading(true)
      try {
        console.log('authUser with email', email)
        state.email = email
        // TODO restore email address
        const authResponse = await postIt('user/auth', {email: undefined})// state.email})
        console.log('Auth response:', authResponse)
        state.token = authResponse.token
        if (state.token) {
          state.isPendingUserEmail = false
          state.isPendingVerificationCode = true
        }
      } catch (error) {
        console.log('authUser Rye', error)
        state.errMsg = error.message
      } finally {
        State.setLoading(false)
      }
    }

    const verifyUser = async (vcode: string) => {
      State.setLoading(true)
      try {
        if (vcode) {
          console.log('user provided vcode', vcode)
          const payload = {
            email: state.email,
            authToken: state.token,
            code: vcode
          }
          const validationResponse = await postIt('user/validate', payload)
          console.log('Validation response:', validationResponse)
          if (validationResponse.token) {
            state.isPendingVerificationCode = false
            localStorage.setItem('authToken', validationResponse.token)
          } else {
            console.log('Validation did not succeed')
          }
        } else {
          console.log('verify user error. vcode not provided')
        }
      } finally {
        State.setLoading(false)
      }
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
