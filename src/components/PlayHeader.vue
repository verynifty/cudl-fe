<template>
  <div class="flex justify-between mt-4">
    <div class="md:flex flex -mx-3 items-center">
      <div>
        <div
          class="
            flex
            text-sm
            items-center
            justify-center
            w-full
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
            <span>Milk: </span><span class="text-red-700">{{ milk }}</span>
          </div>
          <div class="uppercase font-bold pr-2">
            <span
              ><div class="token_balance">
                Game Balance:
                <span class="number">{{ pendingCudl }} CUDL</span>
              </div></span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="flex space-x-4">
      <button type="button" class="px-3 text-md btn" @click="deposit">
        Deposit Cudl
      </button>
      <button
        v-if="pendingCudl > 0"
        type="button"
        class="px-3 text-md btn"
        @click="withdraw"
        :class="{ 'animate-pulse': pendingCudl > 0 }"
      >
        Withdraw {{ pendingCudl }} Cudl
      </button>
      <button v-else class="cursor-not-allowed px-3 text-md btn" disabled>
        Withdraw Cudl
      </button>
    </div>
  </div>
</template>



<script>
import axios from "axios";
import BigNumber from "bignumber.js";

export default {
  name: "PlayHeader",
  components: {},
  data: function () {
    return {
      pendingCudl: 0,
      milk: 0,
    };
  },
  created: function () {},
  methods: {
    getPendingCudl: async function () {
      let ids = [];
      let pendingCudl;
      const pets = await axios(
        `https://api.nft20.io/cudl/owner/${this.$store.state.account}`
      );

      for (const pet of pets.data.petsOwned) {
        ids.push(pet.pet_id);
      }

      for (const pet of pets.data.careTaking) {
        ids.push(pet.pet_id);
      }

      pendingCudl = await this.$store.state.Moonpet.methods
        .getPendingBalance(ids, this.$store.state.account)
        .call();

      this.pendingCudl = new BigNumber(pendingCudl)
        .shiftedBy(-18)
        .toFixed(2, 1);
    },
    getMilk: async function () {
      const earned = await this.$store.state.Milk.methods
        .earned(this.$store.state.account)
        .call();

      this.milk = parseInt(earned / 1e12) / 1e6;
    },
    deposit: async function () {
      let toDeposit = prompt("How much $CUDL to deposit to the game Balance?");
      toDeposit = (toDeposit * 10 ** 18).toString();

      let tx = await this.$store.state.Moonpet.methods
        .depositCudl(toDeposit)
        .send({
          from: this.$store.state.account,
        });

      await this.getPendingCudl();
    },
    withdraw: async function () {
      let ids = [];
      const pets = await axios(
        `https://api.nft20.io/cudl/owner/${this.$store.state.account}`
      );

      if (pets.data.petsOwned.length > 0) {
        for (const pet of pets.data.petsOwned) {
          ids.push(pet.pet_id);
        }
      }

      if (pets.data.careTaking.length > 0) {
        for (const pet of pets.data.careTaking) {
          ids.push(pet.pet_id);
        }
      }
      console.log("ids ", ids);
      let pet = await this.$store.state.Moonpet.methods.claimRewards(ids).send({
        from: this.$store.state.account,
      });

      await this.getPendingCudl();
    },
  },
  mounted: async function () {
    this.getMilk();
    await this.getPendingCudl();
  },
  beforeMount: async function () {
    this.getPendingCudl();
    this.getMilk();
  },
  watch: {
    isConnected: async function () {
      this.getMilk();
      await this.getPendingCudl();
    },
  },
  created: function () {
    // setTimeout(() => this.pendingCudl(), 4000);
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
};
</script>
