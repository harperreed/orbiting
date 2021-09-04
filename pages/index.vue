<template>
  <section 
    class="min-w-screen min-h-screen w-screen h-screen max-w-screen max-h-screen"
    v-touch:swipe.top="swipeTopHandler"
    v-touch:swipe.bottom="swipeBottomHandler"
    v-touch:longtap="longtapHandler"
    v-touch:swipe.right="swipeRightHandler"
    >
    <Editor />
    <div class="absolute top-0 left-0">
      
      <Menu />  
        

    </div>
  </section>
  
</template>

<script>
import Editor from "~/components/Editor";
import Menu from "~/components/Menu";

export default {
  name: "HomePage",

  components: {
    Editor,
    Menu,
  },
  data() {
    return { 
      content: "",
      eventsLog: [],
      messages: [],
     };
  },
  methods: {
    swipeRightHandler(e) {
      this.content = "Right Swipe";
      this.eventsLog.push("right")
    },
    swipeTopHandler(e) {
      this.content = "Top Swipe";
      this.eventsLog.push("top")
    },
    swipeBottomHandler(e) {
      this.content = "Bottom Swipe";
      this.eventsLog.push("bottom")
    },
    longtapHandler(e) {
      this.content = "Long Hold";
      this.eventsLog.push("long hold")
    },
  }
};
</script>
