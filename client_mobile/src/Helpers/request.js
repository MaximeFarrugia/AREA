import Axios from 'axios'

const request = async ({
  endpoint,
  data = null,
  headers,
  method = 'get',
  doAlert = false,
}) => {
  try {
    const res = await Axios({
      method,
      url: `${global.backendUrl}${endpoint}`,
      data,
      headers,
    })
    return res
  } catch (err) {
    if (err?.response?.status === 401) {
      window.location.pathname = '/login'
    } else if (doAlert) {
      alert(err?.response?.data?.msg || 'Unknown error ocurred.')
    } else {
      console.log(err?.response?.data?.msg || 'Unknown error ocurred.')
    }
    return null
  }
}

export default request
