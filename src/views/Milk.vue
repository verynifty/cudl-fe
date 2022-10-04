<template>
  <div class="mint text-white">
    <div class="text-xl md:text-2xl text-center mt-16 px-4 md:px-0">
      <div class="text-3xl animate-pulse">🥛Stake to earn Milk points🥛</div>
      <div class="text-xl">
        Milk (not ERC20) is the superpower to buy features and upgrades from the
        Bazaar Bazaar
      </div>
      <div class="text-xl"></div>
      <div>
        <div>
          <div
            class="
              flex
              text-sm
              items-center
              justify-center
              md:w-1/3
              w-full
              m-auto
              border-4 border-black
              pl-3
              pt-3
              bg-yellow-400
              text-black
              boxShadow
              space-x-4
            "
          >
            <div class="uppercase font-bold">
              <span class="">Your Milk Balance: </span>
              <span class="text-red-700">
                <TokenBalance
                  :erc20="$store.state.contracts.Milk"
                  :account="$store.state.account"
                  symbol="Milk"
                  decimals="18"
              /></span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-red-500"></div>
    </div>
    <div
      class="
        flex flex-col
        md:flex-row
        -mx-10
        justify-center
        items-start
        mt-6
        text-center
        flex-wrap
      "
      style=""
    >
      <MilkStake
        title="CUDL-ETH LP"
        poolId="0"
        lpToken="0xeff704f96bc14185c51d78d200baa1f65121f67b"
        symbol="ULP"
        ratio="0.083"
        :liquidity="true"
      />

      <MilkStake
        title="CUDL Staking"
        poolId="1"
        lpToken="0x0f4676178b5c53ae0a655f1b19a96387e4b8b5f2"
        symbol="CUDL"
        ratio="0.083"
        :liquidity="true"
      />
      <!-- <MilkStake
        title="CUDL"
        poolId="0"
        lpToken="0xeCD20F0EBC3dA5E514b4454E3dc396E7dA18cA6A"
        symbol="CUDL"
        ratio="5"
        :liquidity="false"
      />
      <MilkStake
        title="sMUSE"
        poolId="1"
        lpToken="0x9cfc1d1a45f79246e8e074cfdfc3f4aacdde8d9a"
        symbol="sMUSE"
        ratio="20"
        :liquidity="false"
      /> -->
      <!-- <MilkStake
        title="CUDL-ETH"
        poolId="1"
        lpToken="0x94036f9a13cc4312ce29c6ca364774ea97191215"
        symbol="ULP"
        ratio="5"
      />
      <MilkStake
        title="MUSE-CUDL"
        poolId="1"
        lpToken="0x94036f9a13cc4312ce29c6ca364774ea97191215"
        symbol="ULP"
        ratio="5"
      /> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Number from "@/components/Number.vue";
import MilkStake from "@/components/MilkStake.vue";
import TokenBalance from "@/components/TokenBalance.vue";

export default {
  name: "Farm",
  components: {
    Number,
    MilkStake,
    TokenBalance,
  },
  data: function () {
    return {
      loading: false,
      total: 0,
    };
  },
  mounted: async function () {
    this.$store.commit("setNetworkCheck", true);

    await this.init();
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  created: function () {},
  methods: {
    init: async function () {
      if (this.loading || !this.isConnected) return;
    },
  },
  watch: {
    isConnected: function () {
      this.init();
    },
  },
};
</script>