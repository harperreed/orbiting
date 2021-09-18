<template>
  <div
    class="
      absolute
      top-0
      bottom-0
      left-0
      w-8/12
      border
      max-w-xs
      shadow-xl
      bg-white
      mb-8
      dark:bg-gray-700
      dark:border-black
      dark:text-white
      text-black
    "
  >

    <button class="px-3 py-2 border dark:border-black rounded float-right m-2 bg-red-100 hover:bg-red-300 dark:bg-red-300 dark:hover:bg-red-100" @click="$emit('close')">
      ❌
    </button>

    <div class="p-2 ">
      <History v-if="showHistory" />
       
      <Help v-if="showHelp" />
       
      <Settings v-if="showSettings" />
      <About v-if="showAbout" />
    </div>

    <!-- <button class="button">Clear History</button> -->

    <div
      class="
        absolute
        inset-x-0
        bottom-0
        w-full
        flex
        justify-evenly
        dark:bg-gray-500
        dark:text-white
        text-black
        bg-gray-500
        border-t-2 
        dark:border-gray-500
        bg-gray-300

      "
    >
      <button class="footer-button group" @click="toggleHistory">
        <p class="text-lg">📜</p>
        <p class="footer-link-text">History</p>
      </button>
      <button class="footer-button group" @click="toggleHelp">
        <p class="text-lg">🆘</p>
        <p class="footer-link-text">Help</p>
      </button>
      <button class="footer-button group" @click="toggleSettings">
        <p class="text-lg">⚙️</p>
        <p class="footer-link-text">Settings</p>
      </button>
      <button class="footer-button group" @click="toggleAbout">
        <p class="text-lg">ℹ️</p>
        <p class="footer-link-text">About</p>
      </button>
    </div>
  </div>
</template>


<script>
import About from "~/components/Content/About";
import Help from "~/components/Content/Help";
import Settings from "~/components/Content/Settings";
import History from "~/components/Content/History";

export default {
  name: "Menu",
  components: {
    About,
    Settings,
    Help,
    History

  },
  data() {
    return {
      routerState: "history",
    };
  },
  computed: {
    showHistory() {
      return this.routerState === "history";
    },
    showHelp() {
      return this.routerState === "help";
    },
    showSettings() {
      return this.routerState === "settings";
    },
    showAbout() {
      return this.routerState === "about";
    },
  },
  methods: {
    toggleHistory() {
      this.routerState = "history";
    },
    toggleHelp() {
      this.routerState = "help";
    },
    toggleSettings() {
      this.routerState = "settings";
    },
    toggleAbout() {
      this.routerState = "about";
    },
  },
};
</script>

<style>

.menu{}
.footer-button {
  @apply rounded-lg px-3 py-2 my-1  text-center bg-gray-200 ;
  @apply dark:text-white dark:bg-gray-700 dark:border-gray-500;
  @apply hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-gray-900;
}

.footer-link-text{
  @apply text-gray-600 dark:text-gray-100 text-sm;
  @apply group-hover:bg-gray-100 group-hover:text-gray-800  dark:group-hover:bg-gray-300 dark:group-hover:text-gray-900;
}
</style>
