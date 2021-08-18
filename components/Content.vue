<template>
 <div  contenteditable
    @input="onInput" class="editContent">
   fuck yea

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
  },
};
</script>

<style>

.editContent {
  @apply text-lg;

}

</style>
