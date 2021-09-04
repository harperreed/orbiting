<template>
<div>
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
    class="text-7xl h-5/6 w-full p-6 font-bold" 
    v-touch:swipe.right="swipeRightHandler"
    v-touch:swipe.left="swipeLeftHandler"
    v-touch:swipe.top="swipeTopHandler"
    v-touch:swipe.bottom="swipeBottomHandler"
    v-touch:longtap="longtapHandler"
    ref="editor"
    spellcheck=”false”
    /> 

    <div class="bg-blue-100 border rounded-lg">
      <b>{{ events }}</b>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { 
      content: "",
      events: [],
      messages: [],
     };
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
    clearScreen() {
      this.messages.append(this.content);
      this.events.append("clear")
      this.content = ""

    },
    swipeLeftHandler(e) {
      // this.content = "Left Swipe";
      this.events.append("left")
      this.clearScreen();
    },
    swipeRightHandler(e) {
      this.content = "Right Swipe";
      this.events.append("right")
    },
    swipeTopHandler(e) {
      this.content = "Top Swipe";
      this.events.append("top")
    },
    swipeBottomHandler(e) {
      this.content = "Bottom Swipe";
      this.events.append("bottom")
    },
    longtapHandler(e) {
      this.content = "Long Hold";
      this.events.append("long hold")
    },

    focusInput() {
      this.$refs.editor.focus();
      this.events.append("focus")
    }
  },
};
</script>
