<template>
  <span class="number">{{ display }}</span>
</template>

<script>
import BigNumber from "bignumber.js";

export default {
  name: "Number",
  components: {},
  props: {
    number: String,
    decimals: String
  },
  data: function() {
    return {
    };
  },
  methods: {

  },
  beforeMount: function() {
  },
  watch: {

  },
  computed: {
      display: function() {
          return (new BigNumber(this.number).shiftedBy(- parseInt(this.decimals)).toFixed(4, 1))
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
