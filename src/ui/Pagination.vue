<template>
  <div class="flex items-center space-x-2">
    <button 
      class="px-3 py-1 border rounded hover:bg-gray-50" 
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)">
      上一页
    </button>
    <button 
      v-for="page in displayedPages" 
      :key="page"
      class="px-3 py-1 border rounded" 
      :class="currentPage === page ? 'bg-green-50 text-green-700 border-green-200' : 'hover:bg-gray-50'"
      @click="changePage(page)">
      {{ page }}
    </button>
    <button 
      class="px-3 py-1 border rounded hover:bg-gray-50" 
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)">
      下一页
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    displayedPages() {
      const maxPages = 3;
      if (this.totalPages <= maxPages) {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
      }

      let start = Math.max(1, this.currentPage - 1);
      let end = Math.min(this.totalPages, start + maxPages - 1);
      
      if (end - start + 1 < maxPages) {
        start = Math.max(1, end - maxPages + 1);
      }
      
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  },
  methods: {
    changePage(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    }
  }
};
</script>