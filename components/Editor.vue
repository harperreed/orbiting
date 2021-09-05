<template>
  <textarea  
    v-model="content" 
    placeholder="Type here"
    class="text-7xl h-full w-full p-6 font-bold focus:outline-none focus:ring focus:border-0 border-0" 
    v-touch:swipe.left="swipeLeftHandler"
    v-touch:swipe.right="swipeRightHandler"
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
    }
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    clearScreen() {
      this.content = ""
      this.focusInput();
    },
    swipeLeftHandler(e) {
      this.clearScreen();
    },
    swipeRightHandler(e) {
      
      $emit('rightSwipe');
      this.content = "right";
    },
    focusInput() {
      this.$refs.editor.focus();
    }
  },
};
</script>
