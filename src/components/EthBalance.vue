<template>
  <div class="eth_balance"><Number decimals="18" :number="balance" /> ETH</div>
</template>

<script>
import BigNumber from "bignumber.js";
import Number from "@/components/Number.vue";

export default {
  name: "EthBalance",
  components: {Number},
  props: {
    account: String,
  },
  data: function() {
    return {
      balance: "",
    };
  },
  methods: {
    fetchBalance: async function() {
      if (this.$store.state.web3 == null) {
        return;
      }
      let balance = await this.$store.state.web3.eth.getBalance(this.account);
      this.balance = balance
      setTimeout(this.fetchBalance, 10000)
    }
  },
  beforeMount: function() {
    this.fetchBalance();
  },
  watch: {
    isConnected: function() {
      this.fetchBalance();
    }
  },
  computed: {
    isConnected: function() {
      return this.$store.state.web3 != null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
