import axios from 'axios'
import qs from 'qs'

export default class DemoStoreHelper {
  private readonly apiUrl: String
  constructor (apiUrl: String) {
    this.apiUrl = apiUrl
  }

  demoLogout (token: String) {
    const apiUrl = this.apiUrl
    const url = `${apiUrl}/demo/logout`
    return axios.post(url)
    .catch((err: Error) => {
      console.log('demoHelper error', err)
    })
  }

  /**
   *
   * @param email address
   * @return {AxiosPromise<any>}
   */
  submitDemoUserEmail (email: String) {
    const apiUrl = this.apiUrl
    const url = `${apiUrl}/demo/submitEmail`
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        // Authorization: `Bearer ${token}`
      },
      data: qs.stringify({email}),
      url,
    }
    return axios(options)
  }

}
