<template>
  <div v-if="!isConnected" class="connect_wallet flex justify-center flex-col items-center text-center mt-32 text-4xl">
      <h3 class="title text-center">No wallet connected</h3>
      <button v-on:click="connectWallet()" class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-3 mt-6 text-2xl">Connect my wallet</button>
  </div>
</template>

<script>
export default {
  name: "ConnectWallet",
  data: function() {
    return {
    };
  },
  computed: {
      isConnected: function() {
        return this.$store.state.web3 != null
      }
  },
  methods: {
      connectWallet: function() {
          this.$store.dispatch('connectWallet', this)
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
