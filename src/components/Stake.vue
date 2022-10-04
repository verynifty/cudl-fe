<template>
  <div class="md:w-1/3 w-4/5 p-4 md:text-xl">
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
      <img
        src="https://image.flaticon.com/icons/png/512/112/112431.png"
        alt="Person"
        class="object-contain mb-6"
        style="height: 180px"
      />
      <p class="mb-1 text-2xl">{{ title }}</p>
      <a
        class="text-xs mb-6 underline"
        :href="`https://analytics-arbitrum.sushi.com/pairs/${lpToken}`"
        target="_blank"
        >Add liquidity on Sushiswap</a
      >
      <p class="mb-6">
        Your LP Tokens:
        <TokenBalance
          :erc20="lpToken"
          :account="account"
          symbol="$ULP"
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
        <div class="md:px-2 md:py-0 py-2">
          <button class="btn">
            <span class v-if="!hasTokenApproval" @click="stake()"
              >Approve & Stake</span
            >
            <span class v-if="hasTokenApproval" @click="stake()">Stake</span>
          </button>
        </div>
        <div class="md:px-2 md:py-0 py-2">
          <button @click="harvest()" class="btn">Harvest</button>
        </div>
        <div class="md:px-2 md:py-0 py-2">
          <button @click="unstake()" class="btn">
            Unstake & Harvest rewards
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NFTList from "@/components/NFTList.vue";
import TokenBalance from "@/components/TokenBalance.vue";
import Number from "@/components/Number.vue";
export default {
  name: "StakeComponent",
  components: {
    NFTList,
    TokenBalance,
    Number,
  },
  props: {
    title: String,
    lpToken: String,
    poolId: Number,
    // token: String,
  },
  data: function () {
    return {
      hasTokenApproval: false,
      staked: "0",
      pendingCudl: "0",
      userLpBalance: "0",
      lpContract: null,
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

      console.log("kp contract ", this.lpContract);

      this.hasTokenApproval =
        (
          await this.lpContract.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.MiniChefCudl
            )
            .call()
        ).length >= 18;

      const staked = await this.$store.state.MiniChefCudl.methods
        .userInfo(this.poolId, this.$store.state.account)
        .call();
      this.staked = staked.amount;
      //console.log(staked);
      this.pendingCudl = await this.$store.state.MiniChefCudl.methods
        .pendingMilk(this.poolId, this.$store.state.account)
        .call();

      const userLpBalance = await this.lpContract.methods
        .balanceOf(this.$store.state.account)
        .call();
      this.userLpBalance = userLpBalance;
      console.log(userLpBalance);
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
        let minetx = await this.$store.state.MiniChefCudl.methods
          .deposit(this.poolId, this.userLpBalance, this.$store.state.account)
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
        let minetx = await this.$store.state.MiniChefCudl.methods
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
        let minetx = await this.$store.state.MiniChefCudl.methods
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
        .approve(this.$store.state.contracts.MiniChefCudl, max)
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
  },
  watch: {
    isConnected: function () {
      this.init();
    },
  },
};
</script>