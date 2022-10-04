<template>
  <div class="md:w-1/3 w-4/5 p-4 px-10 md:text-xl">
    <div
      class="
        rounded
        flex
        justify-center
        items-center
        border-2
        p-4
        border-gray-900
        flex-col
        shadow-xl
        bg-white bg-opacity-25
      "
    >
      <div class="text-lg mt-10" v-if="poolId == 0">
        ~90 MILK day per shared between the pool
      </div>
      <div class="text-lg mt-10" v-if="poolId == 1">
        ~10 MILK day per shared between the pool
      </div>
      <span class="text-6xl mb-3"> 🥛 </span>

      <!-- <img
        src="https://cudl.finance/img/alien.31bad01b.png"
        alt="Person"
        class="object-contain mb-6"
        style="height: 180px"
      /> -->
      <p class="mb-1 text-2xl">{{ title }}</p>
      <a
        v-if="liquidity && poolId != 1"
        class="text-xs mb-6 underline"
        :href="`https://analytics-arbitrum.sushi.com/pairs/${lpToken}`"
        target="_blank"
        >Add liquidity on Sushiswap</a
      >
      <p class="mb-6">
        Your balance:
        <TokenBalance
          :erc20="lpToken"
          :account="account"
          :symbol="symbol"
          decimals="18"
        />
      </p>
      <div class="flex -mx-3">
        <!-- <div class="px-3">
          
            // </div>-->
        <div class="px-3">
          Staked:
          <Number decimals="18" :number="staked" />
        </div>

        <div class="px-3">
          Rewards:
          <Number decimals="18" :number="pendingCudl" />
        </div>
      </div>

      <div
        class="
          w-full
          items-center
          flex
          border-gray-900
          bg-white bg-opacity-100
          text-gray-900 text-md
        "
      >
        <input
          v-model="toStake"
          type="number"
          placeholder="Amount"
          class="w-3/4 outline-none pt-2 text-center"
        />
        <button
          class="
            border
            bg-gray-900
            text-white
            w-1/4
            outline-none
            focus:outline-none
            pt-2
            hover:bg-gray-700
          "
          @click="maxBal"
        >
          max
        </button>
      </div>
      <div
        class="
          flex
          md:flex-col
          flex-col
          md:items-center
          items-center
          md:-mx-2
          space-y-4
          -my-2
          py-4
          mt-4
          mb-8
          text-sm
        "
      >
        <div class="md:px-2 md:py-0 py-2" @click="stake()">
          <button class="btn">
            <span class v-if="!hasTokenApproval">Approve & Stake</span>
            <span class v-if="hasTokenApproval">Stake</span>
          </button>
        </div>
        <div class="md:px-2 md:py-0 py-2">
          <button @click="harvest" class="btn">Harvest</button>
        </div>
        <div class="md:px-2 md:py-0 py-2">
          <button @click="unstake" class="btn">Unstake & Harvest</button>
        </div>

        <!-- <div class="md:px-2 md:py-0 py-2">
              <button
                class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-2 mt-6 text-md"
              >
                Unstake
            </button>-->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NFTList from "@/components/NFTList.vue";
import TokenBalance from "@/components/TokenBalance.vue";
import Number from "@/components/Number.vue";
import BigNumber from "bignumber.js";

export default {
  name: "MilkStake",
  components: {
    NFTList,
    TokenBalance,
    Number,
  },
  props: {
    title: String,
    lpToken: String,
    poolId: Number,
    symbol: String,
    ratio: Number,
    liquidity: Boolean,
    // token: String,
  },
  data: function () {
    return {
      hasTokenApproval: false,
      staked: "0",
      pendingCudl: "0",
      userLpBalance: "0",
      lpContract: null,
      toStake: 0,
    };
  },
  created: function () {},
  mounted: async function () {
    this.init();
  },
  methods: {
    init: async function () {
      // console.log(infos);
      if (this.$store.state.web3 == null) {
        return;
      }

      this.lpContract = await this.$store.state.ERC20(this.lpToken);

      this.hasTokenApproval =
        (
          await this.lpContract.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.MiniChef
            )
            .call()
        ).length >= 18;

      const staked = await this.$store.state.MiniChef.methods
        .userInfo(this.poolId, this.$store.state.account)
        .call();

      this.staked = staked.amount;

      this.pendingCudl = await this.$store.state.MiniChef.methods
        .pendingMilk(this.poolId, this.$store.state.account)
        .call();

      const userLpBalance = await this.lpContract.methods
        .balanceOf(this.$store.state.account)
        .call();
      this.userLpBalance = userLpBalance;

      this.toStake = new BigNumber(this.userLpBalance)
        .shiftedBy(-18)
        .toFixed(2, 1);

      console.log(userLpBalance);
    },
    maxBal: async function () {
      const userLpBalance = await this.lpContract.methods
        .balanceOf(this.$store.state.account)
        .call();
      this.userLpBalance = userLpBalance;

      this.toStake = new BigNumber(this.userLpBalance)
        .shiftedBy(-18)
        .toFixed(2, 1);
    },
    stake: async function () {
      try {
        if (!this.hasTokenApproval) {
          await this.approve();
        }
        const userLpBalance = await this.lpContract.methods
          .balanceOf(this.$store.state.account)
          .call();

        this.userLpBalance = userLpBalance;

        let toStake = (this.toStake * 10 ** 18).toString();

        // alert(toStake);
        let minetx = await this.$store.state.MiniChef.methods
          .deposit(
            this.poolId,
            this.$store.state.web3.utils.toWei(
              this.toStake.toString(),
              "ether"
            ),
            this.$store.state.account
          )
          .send({
            from: this.$store.state.account,
          });
      } catch (e) {
        console.log(e);
      }
    },
    unstake: async function () {
      try {
        if (!this.hasTokenApproval) {
          await this.approve();
        }
        let minetx = await this.$store.state.MiniChef.methods
          .withdrawAndHarvest(
            this.poolId,
            this.staked,
            this.$store.state.account
          )
          .send({
            from: this.$store.state.account,
          });

        console.log(minetx);
      } catch (e) {
        console.log(e);
      }
    },
    harvest: async function () {
      try {
        if (!this.hasTokenApproval) {
          await this.approve();
        }
        let minetx = await this.$store.state.MiniChef.methods
          .harvest(this.poolId, this.$store.state.account)
          .send({
            from: this.$store.state.account,
          });

        console.log(minetx);
      } catch (e) {
        console.log(e);
      }
    },

    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let approve = await this.lpContract.methods
        .approve(this.$store.state.contracts.MiniChef, max)
        .send({
          from: this.$store.state.account,
        });
    },
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
    UniCudlEthToken: function () {
      return this.$store.state.contracts.UniCudlEth;
    },
    account: function () {
      return this.$store.state.account;
    },
    display: function () {
      return new BigNumber(this.toStake).shiftedBy(-18).toFixed(2, 1);
    },
  },
  watch: {
    isConnected: function () {
      this.init();
    },
  },
};
</script>
<style scoped>
.milk-bottle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 25%;
  height: 25%;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>