<template>
 <div  contenteditable
    @input="onInput" class="editContent" v-touch:swipeHandler="touchHandler">
   {{ content }}

 </div>
</template>

<script>
export default {
  data() {
    return { content: 'hello world' };
  },
  methods: {
    onInput(e) {
      console.log(e.target.innerText);
    },
    touchHandler(e) {
      this.content = "fuuuuusss";
    },
  },
};
</script>

<style>

.editContent {
  @apply text-lg;

}

</style>
