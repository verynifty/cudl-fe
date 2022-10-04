<template>
  <span class="address"
    ><a target="_blank" :href="link" class="hover:text-blue-400">{{
      display
    }}</a></span
  >
</template>

<script>
export default {
  name: "Address",
  components: {},
  props: {
    address: String,
  },
  data: function () {
    return {};
  },
  methods: {},
  beforeMount: function () {},
  watch: {},
  computed: {
    display: function () {
      if (this.address == null) {
        return "";
      }
      return this.address.substring(0, 8) + "...";
    },
    link: function () {
      if (this.address == null) {
        return "";
      }
      return "https://arbiscan.io/address/" + this.address;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
