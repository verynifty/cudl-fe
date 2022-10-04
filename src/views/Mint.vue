<template>
  <div class="mint">
<div class="text-xl md:text-2xl text-center mt-16 px-4 md:px-0">
                      <div class="text-red-500">WARNING: This is the old Minting contract and you have until Nov 6 to move your funds to the new one. Access the new contract <router-link class="underline" to="/mint"
        >Here</router-link
      >.</div>
                <div> Stake minimum 5 muse and get ~1 point a day, every 400 points you can redeem a fresh new vNFT. </div>
                <div class="text-red-500">Warning: Unstaking will reset your points to 0</div>
            </div>
            <div class="flex flex-col md:flex-row md:-mx-3 md:justify-center items-center mt-6 text-center">

                <div class="md:w-1/3  w-4/5 p-3 md:px-3">
                    <div
                        class="rounded flex justify-center items-center border-2 p-4 border-gray-900 flex-col shadow-xl bg-white bg-opacity-25		">
                        <span class="text-lg">Total $CUDL in the pool: <Number decimals="18" :number="totalInPool" /></span>
                        <img src="@/assets/img/nft/4.svg" alt="MonaMonaMona" class="object-contain mb-6" style="height: 250px;">
                        <p class="mb-6 text-xl md:text-2xl">Mint vNFT</p>
                        <div class="flex -mx-3 text-xl md:text-xl">
                            <div class="px-3">
                                Your Stake: <span><Number decimals="18" :number="stakedAmount" /></span>
                            </div>
                            <div class="px-3">
                                Points Earned: <Number decimals="18" :number="pointsEarned" />
                            </div>

                

                        </div>

                        <div
                            class="flex md:flex-row flex-col md:items-start items-center md:-mx-2 -my-2  py-4  mt-4 mb-8 text-sm">
                            <div class="md:px-2 md:py-0 py-2">
                                <button
                                    class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-3 mt-6 text-md" 
                                    v-on:click="approveAndStake()"
                                    >
                                    <span v-if="!hasTokenApproval">Approve & Stake</span>
                                    <span v-else>Stake</span>
                                    </button>
                            </div>
                        
                            <div class="md:px-2 md:py-0 py-2" v-if="stakedAmount > 0">
                                <button
                                    class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-2 mt-6 text-md" @click="unstake()">Unstake</button>
                            </div>
                                <div class="md:px-2 md:py-0 py-2">
                                <button
                                    class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-3 mt-6 text-md" @click="redeem()">Redeem vNFT</button>
                            </div>
                        </div>
                    </div>
                </div>
              
               
                </div>
            </div>

  </div> 
</template>

<script>
// @ is an alias to /src
import Number from "@/components/Number.vue";

export default {
  name: "Mint",
  components: {
    Number,
  },
  data: function () {
    return {
      hasTokenApproval: false,
      stakedAmount: "0",
      pointsEarned: "0",
      totalInPool: "0",
    };
  },
  mounted: function () {
    this.checkHasStake();
    this.checkIfTokenApproval();
    this.checkPointsEearned();
    this.checkTotalStaked();
  },
  created: function () {},
  methods: {
    checkIfTokenApproval: async function () {
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.StakeForVnfts
            )
            .call()
        ).length >= 18;
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let minetx = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.StakeForVnfts, max)
        .send({
          from: this.$store.state.account,
        });
    },
    approveAndStake: async function () {
      let amount = prompt("How much would you like to stake? (min is 5 muse)");
      //  amount = amount * 10 ** 18;
      amount = BigInt(amount * 10 ** 18);
      if (!this.hasTokenApproval) {
        await this.approve();
      }
      let approveAndStake =
        await this.$store.state.StakeForVnftsContract.methods
          .stake(amount.toString())
          .send({
            from: this.$store.state.account,
          });

      this.checkHasStake();
    },
    checkTotalStaked: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      let totalStaked = await this.$store.state.StakeForVnftsContract.methods
        .totalStaked()
        .call();

      this.totalInPool = totalStaked;
    },
    checkHasStake: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      let stakeAmount = await this.$store.state.StakeForVnftsContract.methods
        .balance(this.$store.state.account)
        .call();

      this.stakedAmount = stakeAmount;
    },
    checkPointsEearned: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      let pointsEarned = await this.$store.state.StakeForVnftsContract.methods
        .earned(this.$store.state.account)
        .call();

      this.pointsEarned = pointsEarned;
    },
    unstake: async function () {
      alert("You are going to unstake all your muse.");
      let unstake = await this.$store.state.StakeForVnftsContract.methods
        .exit()
        .send({
          from: this.$store.state.account,
        });

      this.checkHasStake();
    },
    redeem: async function () {
      let redeem = await this.$store.state.StakeForVnftsContract.methods
        .redeem()
        .send({
          from: this.$store.state.account,
        });

      alert("Awesome! you just got a brand new vNFT");
    },
  },
};
</script>
