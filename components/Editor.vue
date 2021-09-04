<template>
  <div
    contenteditable
    @input="onInput"
    class="text-7xl h-full w-full p-6 font-bold"
  >
    {{ content }}
  </div>
</template>

<script>
export default {
  data() {
    return { content: "type here" };
  },
  methods: {
    onInput(e) {
      console.log(e.target.innerText);
    },
    touchHandler(e) {
      this.content = "fuuuuusss";
    },
  },
};
</script>
