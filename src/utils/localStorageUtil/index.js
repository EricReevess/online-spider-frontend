import store from 'store'
export default {
  saveData(key, obj){
    store.set(key,obj)
  },

  getData (key) {
    return store.get(key)
  },

  removeData(key){
    return store.remove(key)
  }
}
