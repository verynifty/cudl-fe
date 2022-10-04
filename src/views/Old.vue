<template>
  <div class="mint text-white">
    <div class="text-xl md:text-2xl text-center mt-16 px-4 md:px-0">
      <div class="text-3xl animate-pulse">
        🥛 Claim stuck balances from Mainnet game 🥛
      </div>
      <div class="text-xl btn" @click="exitCudlGame">
        Claim Game Deposited Balance
      </div>
      <div class="text-xl btn" @click="exitMilk">
        Claim Staked for Milk Balances
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Number from "@/components/Number.vue";
import MilkStake from "@/components/MilkStake.vue";
export default {
  name: "Old",
  components: {
    Number,
    MilkStake,
  },
  data: function () {
    return {};
  },
  mounted: async function () {
    this.$store.commit("setNetworkCheck", false);

    await this.init();
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  created: function () {},
  methods: {
    exitCudlGame: async function () {
      let minetx = await this.$store.state.OldCudl.methods
        .claimCudlDeposited()
        .send({
          from: this.$store.state.account,
        });
    },
    exitMilk: async function () {
      let minetx = await this.$store.state.OldMilk.methods.exit().send({
        from: this.$store.state.account,
      });

      console.log(minetx);
    },
  },
  watch: {
    isConnected: function () {
      this.init();
    },
  },
};
</script>