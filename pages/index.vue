<template>
  <section class="bg-green-100 min-w-screen min-h-screen w-screen h-screen">
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
};
</script>
