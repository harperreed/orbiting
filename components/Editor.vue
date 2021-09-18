<template>
  <textarea  
    v-model.lazy="content" 
    placeholder="Type here"
    :class="editorClass" 
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
  computed: {
    settings() {
      const settings = this.$store.state.settings.settings;
      return settings;
    },
    editorClass() {
      let editorClass = ['editor', 'focus:outline-none focus:ring focus:border-0'];
      if (this.settings.rainbow) {
        editorClass.push('rainbow-text');
      }
      return editorClass.join(' ');
    }
      
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

<style scoped>

.editor{
  @apply text-7xl h-full w-full p-6 font-bold border-0 dark:bg-black bg-white dark:text-white;
}
.rainbow-text {
   background-image: repeating-linear-gradient(45deg, violet, indigo,  green, orange, red, violet);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 16s ease infinite;
}

@keyframes rainbow { 
    0%{background-position:0% 50%}
    50%{background-position:100% 25%}
    100%{background-position:0% 50%}
}
</style>
