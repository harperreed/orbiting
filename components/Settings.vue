<template>
  <div
    class="
      overflow-x-hidden overflow-y-auto
      fixed
      inset-0
      z-50
      outline-none
      focus:outline-none
      justify-center
      items-center
      flex
    "
  >
    <div class="relative w-auto my-6 mx-auto max-w-6xl">
      <!--content-->
      <div
        class="
          border-0
          rounded-lg
          shadow-lg
          relative
          flex flex-col
          w-full
          bg-white
          outline-none
          focus:outline-none
        "
      >
        <!--header-->
        <div
          class="
            flex
            items-start
            justify-between
            p-5
            border-b border-solid border-blueGray-200
            rounded-t
          "
        >
          <h3 class="text-3xl font-semibold">Settings</h3>
          <button
            class="
              p-1
              ml-auto
              bg-transparent
              border-0
              text-black
              opacity-5
              float-right
              text-3xl
              leading-none
              font-semibold
              outline-none
              focus:outline-none
            "
            v-on:click="toggleModal()"
          >
            <span
              class="
                bg-transparent
                text-black
                opacity-5
                h-6
                w-6
                text-2xl
                block
                outline-none
                focus:outline-none
              "
            >
              ×
            </span>
          </button>
        </div>
        <!--body-->
        <div class="relative p-6 flex-auto">
          <p class="my-4 text-blueGray-500 text-lg leading-relaxed">
            Settings
          </p>
        </div>
        <!--footer-->
        <div
          class="
            flex
            items-center
            justify-end
            p-6
            border-t border-solid border-blueGray-200
            rounded-b
          "
        >
          <button
            class="
              text-red-500
              bg-transparent
              border border-solid border-red-500
              hover:bg-red-500
              hover:text-white
              active:bg-red-600
              font-bold
              uppercase
              text-sm
              px-6
              py-3
              rounded
              outline-none
              focus:outline-none
              mr-1
              mb-1
              ease-linear
              transition-all
              duration-150
            "
            type="button"
            v-on:click="toggleModal()"
          >
            Close
          </button>
          <button
            class="
              text-red-500
              background-transparent
              font-bold
              uppercase
              px-6
              py-2
              text-sm
              outline-none
              focus:outline-none
              mr-1
              mb-1
              ease-linear
              transition-all
              duration-150
            "
            type="button"
            v-on:click="toggleModal()"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "large-modal",
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    toggleModal: function () {
      this.showModal = !this.showModal;
    },
  },
};
</script>

<style>
.button {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  @apply hover:shadow-lg;
}
</style>
