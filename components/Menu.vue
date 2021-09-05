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
    "
  >

    <button class="px-3 py-2 border rounded float-right m-2 bg-red-100 hover:bg-red-300" @click="$emit('close')">
      ❌
    </button>

    <div class="p-2 ">
      <div v-if="showHistory">
        <h1 class="text-4xl mb-2">History</h1>
        <ul>
          <li>history</li>
          <li>history</li>
        </ul>
      </div>
      <div v-if="showHelp">
        <h1 class="text-4xl mb-2">Help</h1>
        <p>Help</p>
      </div>
      <div v-if="showSettings">
        <h1 class="text-4xl mb-2">Settings</h1>
        <p>Settings</p>
      </div>
      <div v-if="showAbout">
        <h1 class="text-4xl mb-2">About</h1>
        <h3 class="text-sm">
          Created by Christine Sun Kim, Harper Reed and Nick Ng
        </h3>
        <h3 class="text-3xl">😍😍😍</h3>
        p
      </div>
    </div>

    <!-- <button class="button">Clear History</button> -->

    <div
      class="
        absolute
        inset-x-0
        bottom-0
        bg-gray-300
        border
        flex
        justify-evenly
      "
    >
      <button class="footer-button" @click="toggleHistory">
        <p class="text-lg">📜</p>
        <p class="text-gray-400 text-sm">History</p>
      </button>
      <button class="footer-button" @click="toggleHelp">
        <p class="text-lg">🆘</p>
        <p class="text-gray-400 text-sm">Help</p>
      </button>
      <button class="footer-button" @click="toggleSettings">
        <p class="text-lg">⚙️</p>
        <p class="text-gray-400 text-sm">Settings</p>
      </button>
      <button class="footer-button" @click="toggleAbout">
        <p class="text-lg">ℹ️</p>
        <p class="text-gray-400 text-sm">About</p>
      </button>
    </div>
  </div>
</template>


<script>
export default {
  name: "Menu",
  components: {},
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
.footer-button {
  @apply border-t-2 px-4 py-2 text-center bg-gray-200;
  @apply hover:bg-gray-100;
}
</style>
