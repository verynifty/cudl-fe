<template>
  <div id="app" class="container m-auto text-dark">
    <notifications group="foo" position="top right" />

    <Header />
    <div
      v-if="!correctNetwork"
      class="
        text-2xl text-white
        font-light
        text-left
        md:text-center
        w-full
        leading-tight
        mt-10
        mb-10
      "
    >
      Please switch your wallet to the
      {{ !checkNetwork ? "Ethereum" : "Arbitrum" }} Network and reload the page.
      <br />
      <button
        v-if="checkNetwork"
        class="
          bg-white
          hover:bg-gray-100
          text-gray-800
          font-semibold
          py-2
          px-4
          border border-gray-400
          rounded
          shadow
          mt-10
        "
        @click="connectToArbitrum()"
      >
        Switch network to Arbitrum
      </button>
    </div>
    <div v-if="correctNetwork">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";

export default {
  name: "App",
  components: { Footer, Header },
  data: function () {
    return {
      menuActive: false,
      milk: 0,
    };
  },
  props: {},
  mounted: async function () {
    // await this.getMilk();
  },
  beforeMount: function () {
    if (this.$web3Modal.providerController.cachedProvider != null) {
      console.log(
        "Connecting back to: ",
        this.$web3Modal.providerController.cachedProvider
      );
      this.$store.dispatch("connectWallet", this);
    }
  },
  computed: {
    correctNetwork: function () {
      console.log(
        this.$store.state.checkNetwork,
        this.$store.state.correctNetwork
      );
      return (
        (this.$store.state.checkNetwork &&
          this.$store.state.correctNetwork != "WRONG") ||
        (!this.$store.state.checkNetwork &&
          this.$store.state.correctNetwork == "WRONG")
      );
    },
    checkNetwork: function () {
      return this.$store.state.checkNetwork;
    },
  },
  methods: {
    connectToArbitrum: async function () {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xA4B1",
            chainName: "Arbitrum One",
            nativeCurrency: {
              name: "AETH",
              symbol: "AETH",
              decimals: 18,
            },
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            blockExplorerUrls: ["https://arbiscan.io"],
          },
        ],
      });
      location.reload();
    },
  },
  watch: {
    isConnected: function () {
      // this.getMilk();
    },
  },
};
</script>

<style></style>


