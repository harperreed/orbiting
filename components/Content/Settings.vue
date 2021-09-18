<template>
  <div>
    <p class="text-3xl">Settings</p>

    <label class="flex justify-start items-start">
      <div
        class="
          bg-white
          border-2
          rounded
          border-gray-400
          w-6
          h-6
          flex flex-shrink-0
          justify-center
          items-center
          mr-2
          focus-within:border-blue-500
        "
      >
        <input
          type="checkbox"
          class="opacity-0 absolute"
          v-model="settings.rainbow"
          
        />
        <svg
          class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none"
          viewBox="0 0 20 20"
        >
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
      </div>
      <div class="select-none">Use Rainbow Text</div>
    </label>

    <button @click="enableDarkMode">Enable Dark Mode</button>
    <button @click="enableLightMode">Enable Light Mode</button>
    <button @click="enableOSmode">Enable OS Mode</button>
      


    
    <pre>
    {{ settings }}
    </pre>
  </div>
</template>


<script>
export default {
  name: "Settings",
  computed: {
    settings() {
      const settings = this.$store.state.settings.settings;
      return settings;
    },
  },
  methods: {
    updateRainbow(e) {
      this.$store.commit("settings/toggleRainbow");
    },
    enableDarkMode(){
      this.$store.commit("settings/setTheme", 'dark');
    },
    enableLightMode(){
      this.$store.commit("settings/setTheme", 'light');
    },
    enableOSmode() {
      this.$store.commit("settings/setTheme", 'auto');
    }
  },
};
</script>
<style scoped>
input:checked + svg {
  display: block;
}
</style>