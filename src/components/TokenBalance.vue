<template>
  <div class="token_balance"><Number decimals="18" :number="balance" /> {{ symbol }}</div>
</template>

<script>
import ERC20ABI from "@/assets/ABIS/ERC20";
import BigNumber from "bignumber.js";
import Number from "@/components/Number.vue";

export default {
  name: "TokenBalance",
  components: {Number},
  props: {
    erc20: String,
    account: String,
    decimals: String,
    symbol: String
  },
  data: function() {
    return {
      balance: "",
      contract: null
    };
  },
  methods: {
    fetchBalance: async function() {
      if (this.$store.state.web3 == null) {
        return;
      }
      this.contract = new this.$store.state.web3.eth.Contract(
        ERC20ABI,
        this.erc20
      );
      let balance = await this.contract.methods.balanceOf(this.account).call();
      this.balance = balance
      setTimeout(this.fetchBalance, 10000);
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
