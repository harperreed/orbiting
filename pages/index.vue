<template>
  <section 
    class="min-w-full min-h-full w-full h-full "
    v-touch:swipe.top="swipeTopHandler"
    v-touch:swipe.bottom="swipeBottomHandler"
    v-touch:longtap="longtapHandler"
    v-touch:swipe.right="swipeRightHandler"
    >
    <!-- {{ showMenu}} -->
    <!-- <button :onclick="showMenu = true">showMenu</button> -->
    <!-- <Editor /> -->

    <Menu  v-if="showMenu" v-on:close="showMenu = false"/>  

    <!-- <div class=" absolute top-0 bottom-0 left-0 w-8/12 " v-if="showMenu" v-on:close="showMenu = false">
      
      <Menu  />  
        

    </div> -->
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
      showMenu: true,
     };
  },
  methods: {
    swipeRightHandler(e) {
      // this.content = "Right Swipe";
      this.toggleMenu()
      // this.eventsLog.push("right")
      
      // alert("Right Swipe");
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
