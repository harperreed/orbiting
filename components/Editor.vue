<template>
  <!-- <div
    contenteditable
    @input="onInput"
    class="text-7xl h-full w-full p-6 font-bold"
  >
    {{ content }}
  </div> -->
  <textarea  
    v-model="content" 
    class="text-7xl h-full w-full p-6 font-bold" 
    @input="onInput" 
    v-touch:swipe="swipeHandler"/> 

</template>

<script>
export default {
  data() {
    return { content: "type here" };
  },
  methods: {
    onInput(e) {
      console.log(e.target.innerText);
    },
    swipeHandler(e) {
      this.content = "fuuuuusss";
    },
  },
};
</script>
