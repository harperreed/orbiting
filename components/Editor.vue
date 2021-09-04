<template>
  <textarea  
    v-model="content" 
    placeholder="Type here"
    class="text-7xl h-full w-full p-6 font-bold" 

    v-touch:swipe.left="swipeLeftHandler"

    ref="editor"
    spellcheck=”false”
    /> 
</template>

<script>
export default {
  data() {
    return { 
      content: "",
     };
  },
  watch : {
    content : function(val){
      this.$emit('input', val);
    }
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    clearScreen() {
      this.content = ""
    },
    swipeLeftHandler(e) {
      this.clearScreen();
    },
    focusInput() {
      this.$refs.editor.focus();
    }
  },
};
</script>
