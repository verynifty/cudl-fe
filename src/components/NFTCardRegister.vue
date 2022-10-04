<template>
  <div
    class="
      rounded-none
      flex
      justify-center
      items-center
      border-4
      px-6
      py-4
      border-gray-900
      flex-col
      boxShadow
      bg-white bg-opacity-100
      hover:border-pink-500
      cursor-pointer
    "
  >
    <div class="flex w-full justify-between items-start"></div>
    <img
      :src="
        nft.contract != $store.state.contracts.Mooncats
          ? nft.image
          : `@/assets/img/pets-anim.gif`
      "
      alt="NFT"
      class="object-contain mb-6 mt-8"
      style="height: 220px"
    />
    <p class="mb-4 text-xl flex flex-col text-center">
      <span
        class="text-xl font-bold"
        v-if="nft.contract == $store.state.contracts.Mooncats"
      >
        {{ nft.name }}
      </span>
      <span class="text-xl font-bold" v-else>
        {{ nft.name }} ID #{{ nft.id }}</span
      >
      <!-- <span>{{ name }}</span> -->
    </p>

    <div
      class="flex justify-between text-xl w-full pt-4 border-t-8 border-black"
    >
      <button class="btn" @click="register">
        <span
          class=""
          v-if="
            $store.state.account == '0x1ba8d2bbce4c2fd4885f032e298c80ab728504b7'
          "
          >Give Life To Your NFT</span
        >
        <span class="" v-else
          >Give Life To Your Pet (2txs)
          <span v-if="nft.contract != $store.state.contracts.Mooncats"
            >with 300 CUDL</span
          >
        </span>
      </button>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Address from "@/components/Address.vue";

export default {
  name: "NFT",
  components: { Address },
  props: {
    nft: Object,
  },
  data: function () {
    return {
      name: "",
      image: "",
      addressOrigin: "",
      idOrigin: "",
      isVnftAlive: false,
      timeUntilStarving: 0,
      hasTokenApproval: false,

      timeVnftBorn: 0,
      expectedReward: 0,
      fatalityReward: 0,
      score: 0,
      level: 0,
      isOwner: false,
      owner: "",
      isForSale: false,
    };
  },
  methods: {
    register: async function () {
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Moonpet
            )
            .call()
        ).length >= 18;
      if (!this.hasTokenApproval) {
        await this.approve();
      }

      let ctx = this;
      let register = await this.$store.state.Moonpet.methods
        .giveLife(this.nft.contract, this.nft.id)
        .send({
          from: this.$store.state.account,
        })

        .on("receipt", (receipt) => {
          console.log("registered");
        });

      alert(
        "Welcome to CUDL! It usually takes a few minutes for your new pet to show in the UI!"
      );
      //   await this.$store.state.Moonpet.methods
      //     .giveLife(this.contract, this.id)
      //     .send({
      //       from: this.$store.state.account,
      //     });
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let ctx = this;
      let minetx = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.Moonpet, max)
        .send({
          from: this.$store.state.account,
        })

        .on("receipt", (receipt) => {
          console.log(receipt);
        });
    },
  },
  beforeMount: function () {},
  mounted: async function () {
    this.hasTokenApproval =
      (
        await this.$store.state.CUDL.methods
          .allowance(
            this.$store.state.account,
            this.$store.state.contracts.Moonpet
          )
          .call()
      ).length >= 18;
  },
  watch: {
    isConnected: function () {},
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
      <style scoped></style>
