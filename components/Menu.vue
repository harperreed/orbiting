<template>
  <div class="border-b-2 border-r-2 rounded-br-lg max-w-xs p-2 bg-white shadow-xl">
    <h1 class="text-4xl mb-2">History</h1>

    <button class="button">Clear History</button>

    <h1 class="text-4xl mt-4 mb-2">Menu</h1>

    <button class="button" v-on:click="toggleHelpModal()" type="button">Help</button>
    <button class="button">Settings</button>
    <button class="button" v-on:click="toggleAboutModal()" type="button">About</button>

    <h1 class="text-4xl mt-4 mb-2">Orbiting</h1>
    <h3 class="text-sm">
      Created by Christine Sun Kim, Harper Reed and Nick Ng
    </h3>
    <h3 class="text-3xl">😍😍😍</h3>
     <div>
    <!-- <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
      Open large modal
    </button> -->

    <HelpModal v-if="showHelpModal" v-on:close="showHelpModal = false" />
    <AboutModal v-if="showAboutModal" v-on:close="showAboutModal = false" />

    
  </div>
  </div>
</template>


<script>

import HelpModal from "~/components/HelpModal";
import AboutModal from "~/components/AboutModal";

export default {
  name: "large-modal",
  components: {
    HelpModal,
    AboutModal
  },
  data() {
    return {
      showHelpModal: false,
      showAboutModal: false,
      showSettingsModal: false,
    }
  },
  methods: {
    toggleHelpModal: function(){
      this.showHelpModal = !this.showHelpModal;
    },
    toggleAboutModal: function(){
      this.showAboutModal = !this.showAboutModal;
    }
  }
}
</script>

<style>
.button {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  @apply hover:shadow-lg;
}
</style>
