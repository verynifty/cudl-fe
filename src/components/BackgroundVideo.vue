<template>
  <div class="vimeo-wrapper">
    <iframe
      class=" hidden md:block"
      :src="backgroundVideoUrl"
      width="100vh"
      height="100vh"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "BackgroundVideo",
  data: function() {
    return {};
  },
  computed: {
    backgroundVideoUrl: function() {
      console.log("CHANGED");
      return this.$store.state.backgroundVideoUrl;
    },
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
