// class PagStore {
//   static instance: PagStore;
//   currentPage: number
//   pageSize: number
//   [key: string]: any
//   constructor() {
//     this.currentPage = 1
//     this.pageSize = 10
//   }

//   static getInstance() {
//     if (!PagStore.instance) {
//       PagStore.instance = new PagStore();
//     }
//     return PagStore.instance;
//   }

//   setCurrentPage(page: number){
//     this.currentPage = page
//   }

//   setPageSize(size: number){
//     this.pageSize = size
//   }
// }

// export default PagStore.getInstance()

import { reactive } from 'vue'

function usePag() {
  let PagStore = reactive({
    currentPage: 1,
    pageSize: 10
  })

  function setCurrentPage(page: number) {
    PagStore.currentPage = page
  }

  function setPageSize(size: number) {
    PagStore.pageSize = size
  }
  return { PagStore, setCurrentPage, setPageSize }
}

export default usePag
