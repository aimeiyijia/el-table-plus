class PagStore {
  static instance: PagStore;
  currentPage: number
  pageSize: number
  [key: string]: any
  constructor() {
    this.currentPage = 1
    this.pageSize = 10
  }

  static getInstance() {
    if (!PagStore.instance) {
      PagStore.instance = new PagStore();
    }
    return PagStore.instance;
  }

  setCurrentPage(page: number){
    this.currentPage = page
  }

  setPageSize(size: number){
    this.pageSize = size
  }
}

export default PagStore.getInstance()
