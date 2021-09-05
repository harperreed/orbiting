<template>
  <section 
    class="min-w-full min-h-full w-full h-screen  "
    v-touch:swipe.top="swipeTopHandler"
    v-touch:swipe.bottom="swipeBottomHandler"
    v-touch:longtap="longtapHandler"
    v-touch:swipe.right="swipeRightHandler"
    >
    <Menu  v-if="showMenu" v-on:close="showMenu = false"/>  
    <button v-if="!showMenu" @click="toggleMenu" class="rounded px-2 py-4 border sm:block hidden bg-gray-200 hover:bg-gray-300 absolute bottom-1.5  left-0">🎉</button>
    <Editor  />

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
      showMenu: false,
     };
  },
  methods: {
    swipeRightHandler(e) {
      // this.content = "Right Swipe";
      // this.toggleMenu();
      this.showMenu = true;
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
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};
</script>
