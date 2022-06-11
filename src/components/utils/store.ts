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
