<template>
  <!-- <div
    contenteditable
    @input="onInput"
    class="text-7xl h-full w-full p-6 font-bold"
  >
    {{ content }}
  </div> -->
  <textarea  
    v-model.lazy="content" 
    placeholder="Type here"
    class="text-7xl h-full w-full p-6 font-bold" 
    v-touch:swipe.right="swipeRightHandler"
    v-touch:swipe.left="swipeLeftHandler"
    v-touch:swipe.top="swipeTopHandler"
    v-touch:swipe.bottom="swipeBottomHandler"
    v-touch:longtap="longtapHandler"
    ref="editor"
    /> 

</template>

<script>
export default {
  data() {
    return { content: "" };
  },
  watch : {
    content : function(val){
      // this.$emit('input', val);
      console.log(val)
    }
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    swipeLeftHandler(e) {
      this.content = "Left Swipe";
    },
    swipeRightHandler(e) {
      this.content = "Right Swipe";
    },
    swipeTopHandler(e) {
      this.content = "Top Swipe";
    },
    swipeBottomHandler(e) {
      this.content = "Bottom Swipe";
    },
    longtapHandler(e) {
      this.content = "Long Hold";
    },

    focusInput() {
      this.$refs.editor.focus();
    }
  },
};
</script>
