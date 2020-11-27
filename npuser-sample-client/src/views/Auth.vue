<template lang="pug">
div
    label(for="email")
    input(id="email", type="email", v-model="email", required, autofocus)
<!--    button(type="submit", @click="handleSubmit")-->
  div(class="counter")
  p email isValid {{ isValid }}
  p NewVal (count + 2): {{ countDouble }}
  button(@click="inc") Increment
  button(@click="dec") Decrement
  p Message: {{ msg }} {{ email }}
  button(:disabled="readyAuth", @click="changeMessage()") Change Message
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue'
export default {
  setup () {
    /* ---------------------------------------------------- */
    const count = ref(0)
    const email = ref('')
    const countDouble = computed(() => count.value * 2)
    const readyAuth = computed(() => count.value === 0)
    watch(count, newVal => {
      console.log('count changed', newVal)
    })

    const isValid = computed(() => {
      /* The goal is to just do a  cursory test to prevent obvious errors. Don't get fancy here... */
      const re = /^([^\s@]+)@([^\s.@]+)(\.[^\s.@]+)+$/
      return re.test(String(email.value).toLowerCase())
    })

    const inc = () => {
      count.value += 1
    }
    const dec = () => {
      if (count.value !== 0) {
        count.value -= 1
      }
    }
    /* ---------------------------------------------------- */
    const msg = ref('some text')
    watch(msg, newVal => {
      console.log('msg changed', newVal)
    })
    const changeMessage = () => {
      msg.value = 'new Message ' + count.value
    }
    /* ---------------------------------------------------- */
    return {
      email,
      count,
      isValid,
      inc,
      dec,
      countDouble,
      readyAuth,
      msg,
      changeMessage
    }
  }
}
</script>
