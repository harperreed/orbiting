<template>
  <div>
    <p class="text-3xl">History</p>

    <!-- {{ history }} -->
    <!-- <div class="border rounded px-4 py-2"> {{history}}</div> -->
    <div v-for="message in history" :key="message.text" class="bg-white  hover:bg-gray-200 py-2">
      <span class=" ">{{ message.text }}</span>
    </div>

  </div>
  
  
</template>


<script>
export default {
  name: "History",
  components: {


  },
  data() {
    return {
      routerState: "history",
    };
  },
  computed: {
    history() {
      const history = this.$store.state.history.list;

      return history;
    },
  },
  

}

</script>