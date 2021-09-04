<template>
  <div >
    <!-- <Menu /> -->
    <nuxt />
  </div>
</template>

<script>
import Menu from "~/components/Menu";

export default {
  components: {
    Menu,
  },
  data() {
    return {
      items: [],
    };
  },
};
</script>
