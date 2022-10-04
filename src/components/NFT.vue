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
    v-if="!table"
    v-observe-visibility="visibilityChanged"
  >
    <!-- <div v-if="!isOwner" class="absolute left-0 top-0 p-4 text-1xl">
        Onwed by
        <Address :address="owner" />
      </div>
      <div v-if="isOwner" class="absolute left-0 top-0  p-4 text-3xl">3rd</div>
        -->
    <div class="flex w-full justify-between items-center mt-2">
      <div class="text-3xl font-bold txtShadow" v-if="leaderboard">
        {{ addPositionSuffix(position) }}
      </div>

      <div
        v-if="isStarving"
        class="text-3xl cursor-pointer"
        @click.stop="fatality"
      >
        <img src="@/assets/img/icons/grumpy1.png" class="h-10" alt="" />
      </div>
      <div v-else class="text-3xl">
        <img :src="statusImg" class="h-16" alt="" />
      </div>
    </div>
    <img
      v-if="leaderboard"
      :src="image"
      alt="NFT"
      class="object-contain mb-6 mt-8"
      style="height: 220px"
    />
    <img
      v-if="!leaderboard"
      v-bind:src="image"
      alt="NFT"
      class="object-contain mb-6 mt-8"
      style="height: 220px"
    />

    <p class="mb-4 text-xl flex flex-col text-center">
      <span class="text-xl font-bold">ID #{{ id }} </span>
      <span>{{ name }}</span>
    </p>

    <div
      class="flex justify-between text-xl w-full pt-4 border-t-8 border-black"
    >
      <div class="flex flex-col">
        <span class="uppercase text-xs font-bold">Score</span>
        <span class="leading-normal">{{ score }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="uppercase text-xs font-bold">Level</span>
        <span class="leading-normal">{{ level }}</span>
      </div>
    </div>
  </div>
  <tr v-else class="cursor-pointer">
    <td class="px-4 py-2 border border-gray-900" v-if="leaderboard">
      {{ addPositionSuffix(position) }}
    </td>

    <td class="border border-gray-900 px-4 py-2">
      <img
        v-bind:src="image"
        alt="NFT"
        class="object-contain h-24 m-0 m-auto"
        style=""
      />
    </td>
    <td class="border border-gray-900 px-4 py-2">{{ name }} ( #{{ id }})</td>
    <td class="border border-gray-900 px-4 py-2">{{ score }}</td>
    <td class="border border-gray-900 px-4 py-2">{{ level }}</td>
  </tr>
</template>

<script>
const axios = require("axios").default;
import Address from "@/components/Address.vue";

export default {
  name: "NFT",
  components: { Address },
  props: {
    nft: Object,
    position: Number,
    leaderboard: Boolean,
    table: Boolean,
  },
  data: function () {
    return {
      name: "",
      image: "",
      addressOrigin: "",
      idOrigin: "",
      isVnftAlive: false,
      isStarving: false,
      timeUntilStarving: 0,
      timeVnftBorn: 0,
      expectedReward: 0,
      fatalityReward: 0,
      score: 0,
      level: 0,
      isOwner: false,
      owner: "",
      statusImg: "",
      isVisible: false,
      isForSale: false,
      id: 0,
      name: " ",
    };
  },
  methods: {
    visibilityChanged: async function (isVisible) {
      if (!this.isVisible && isVisible) {
        this.isVisible = true;
        this.fetchInfos();
      }
    },
    fetchInfos: async function () {
      if (this.nft._score == null) {
        console.log("CALL INFO");
        let pet = await this.$store.state.Moonpet.methods
          .getPetInfo(this.nft.pet_id)
          .call();
        this.nft = Object.assign(this.nft, pet);
      }
      this.name = await this.$store.state.Bazaar.methods
        .name(this.nft.pet_id)
        .call();
      this.id = parseInt(this.nft._pet);
      this.expectedReward = parseInt(this.nft._expectedReward);
      this.timeUntilStarving = parseInt(this.nft._timeUntilStarving);
      this.timeVnftBorn = parseInt(this.nft._timeBorn);
      this.score = parseInt(this.nft._score);
      this.level = parseInt(this.nft._level);
      this.owner = this.nft._owner;
      this.isVnftAlive = this.nft._isAlive;
      this.isStarving = this.nft._isStarving;
      this.isOwner =
        this.nft._owner.toLowerCase() ==
        this.$store.state.account.toLowerCase();
      this.addressOrigin = this.nft._token;
      this.idOrigin = this.nft._tokenId;

      if (
        this.addressOrigin.toLowerCase() == this.$store.state.contracts.Mooncats
      ) {
        // //Mooncats and rinkeby
        // const { data } = await axios(
        //   `https://api.mooncat.community/traits/${this.idOrigin}`
        // );

        console.log("GET IMAGE");

        let a = await this.$store.state.Render.methods
          .render(this.idOrigin)
          .call();

        let getObject = a.substring(27);
        console.log(getObject);
        let { image, attributes } = JSON.parse(`${getObject}`);
        console.log(attributes);

        this.image = image;
        console.log("setimage");
      } else if (
        this.addressOrigin.toLowerCase() ==
        this.$store.state.contracts.SmolBrain
      ) {
        this.image = `https://gateway.pinata.cloud/ipfs/QmY71ban6QoWg9nbNwikk6wVWknj8NFBG8nMGHEuzwfAwf/${this.idOrigin}/5.png`;
      }

      const timeLeft = this.timeUntilStarving - Math.floor(Date.now() / 1000);
      if (timeLeft > 86400) {
        this.statusImg = require("@/assets/img/icons/1-statusbar.png");
      } else if (timeLeft < 846000 && timeLeft > 72000) {
        this.statusImg = require("@/assets/img/icons/2-statusbar.png");
      } else if (timeLeft < 846000 && timeLeft < 72000 && !this.isStarving) {
        this.statusImg = require("@/assets/img/icons/3-statusbar.png");
      } else if (this.isStarving) {
        this.statusImg = require("@/assets/img/icons/4-statusbar.png");
      }
    },
    fatality: async function (e) {
      const tokenId = prompt(
        `You'll get ${"20% of this pet"} points by killing this Pet #. To which Pet ID would you like to give these points to?`
      );
      let fatality = await this.$store.state.Moonpet.methods
        .fatality(this.id, tokenId)
        .send({
          from: this.$store.state.account,
        });
    },
    addPositionSuffix: function (number) {
      // creates 1st 2nd 3rd suffixes
      var j = number % 10,
        k = number % 100;
      if (j == 1 && k != 11) {
        return number + "st";
      }
      if (j == 2 && k != 12) {
        return number + "nd";
      }
      if (j == 3 && k != 13) {
        return number + "rd";
      }
      return number + "th";
    },
  },
  beforeMount: function () {
    // this.fetchInfos();
  },
  mounted: function () {},
  watch: {
    isConnected: function () {
      // this.fetchInfos();
    },
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
