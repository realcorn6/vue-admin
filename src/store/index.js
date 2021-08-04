import Vue from 'vue'
import Vuex from 'vuex'
import { Login } from "@/api/login";
import { setToken, setUsername } from "../utils/app";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    username: ''
  },
  mutations: {
    SET_TOKEN(state, value) {
      state.token = value
    },
    SET_USERNAME(state, value) {
      state.username = value
    }
  },
  actions: {
    login(content, requestData) {
      return new Promise((resolve, reject) =>{
        Login(requestData).then((response) =>{
          let data = response.data.data
          content.commit("SET_TOKEN", data.token)
          content.commit("SET_USERNAME", data.username)
          setToken(data.token)
          setUsername(data.username)
          resolve(response)
        }).catch(error =>{
          reject(error)
        })
      })
    }
  },
  modules: {
  }
})
