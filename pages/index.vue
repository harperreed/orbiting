<template>
  <section 
    class="bg-green-100 min-w-screen min-h-screen w-screen h-screen"
    v-touch:swipe.top="swipeTopHandler"
    v-touch:swipe.bottom="swipeBottomHandler"
    v-touch:longtap="longtapHandler"
    v-touch:swipe.right="swipeRightHandler"
    >
    <Editor />
  </section>
</template>

<script>
import Editor from "~/components/Editor";

export default {
  name: "HomePage",

  components: {
    Editor,
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
