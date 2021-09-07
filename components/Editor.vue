<template>
  <textarea  
    v-model.lazy="content" 
    placeholder="Type here"
    class="text-7xl h-full w-full p-6 font-bold focus:outline-none focus:ring focus:border-0 border-0" 
    v-touch:swipe.left="swipeLeftHandler"
    ref="editor"
    spellcheck=”false”
    autocomplete="off" 
    autocorrect="off" 
    autocapitalize="off"
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
      this.addHistory(val);
    }
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    clearScreen() {
      this.addHistory(this.content);
      this.content = ""
      this.focusInput();
    },
    swipeLeftHandler(e) {
      this.clearScreen();
    },
    focusInput() {
      this.$refs.editor.focus();
    },
    addHistory (message) {
      this.$store.commit('history/add', message)
    },
  },
};
</script>
