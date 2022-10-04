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
    v-observe-visibility="visibilityChanged"
  >
    <!-- <div v-if="!isOwner" class="absolute left-0 top-0 p-4 text-1xl">
        Onwed by
        <Address :address="owner" />
      </div>
      <div v-if="isOwner" class="absolute left-0 top-0  p-4 text-3xl">3rd</div>
        -->
    <div class="flex w-full justify-between items-center mt-2">
      <div class="font-bold text-gray-900 hidden">Mines: 0.6 $CUDL</div>

      <div
        v-if="isStarving"
        class="text-3xl cursor-pointer"
        @click.stop="fatality"
      >
        <img src="@/assets/img/icons/grumpy1.png" class="h-10" alt="" />
      </div>
      <div v-else class="">
        <img :src="statusImg" class="h-16" alt="" />
      </div>
    </div>
    <img
      src="@/assets/img/pets-anim.gif"
      alt="NFT"
      class="object-contain mb-6 mt-8"
      style="height: 250px"
    />

    <p class="mb-4 text-xl flex flex-col text-center">
      <span class="text-xl font-bold">ID #{{ id }} </span>
      <!-- <span>{{ name }}</span> -->
    </p>

    <div
      class="
        flex
        justify-between
        text-xl
        w-full
        pt-4
        border-t-8 border-black
        text-gray-900
      "
    >
      <div class="flex flex-col">
        <span class="uppercase text-xs font-bold">Mines</span>
        <span class="leading-normal"> 0.6 $CUDL</span>
      </div>
      <div class="flex flex-col text-right">
        <span class="uppercase text-xs font-bold">Level</span>
        <span class="leading-normal">{{ "0" }}</span>
      </div>
    </div>
    <div class="mt-10" @click="buy">
      <button class="btn"><span>Buy 0.1 ETH </span></button>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Address from "@/components/Address.vue";

export default {
  name: "NftListing",
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
    };
  },
  methods: {
    buy: async function () {
      await this.$store.state.DistributePets.methods.mint(1).send({
        from: this.$store.state.account,
        value: "100000000000000000",
      });

      alert("Thank you, your NFT is in your account");

      location.reload();
    },
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
          .getPetInfo(0) //TOOD this.nft.pet_id
          .call();
        this.nft = Object.assign(this.nft, pet);
      }
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
        this.addressOrigin.toLowerCase() ==
          "0xc3f733ca98e0dad0386979eb96fb1722a1a05e69" ||
        this.addressOrigin.toLowerCase() ==
          "0xae596021d3841d1650a509b7666945823383d4d3"
      ) {
        //Mooncat and rinkeby
        const { data } = await axios(
          `https://api.mooncat.community/traits/${this.idOrigin}`
        );
        this.image = data.image;
        console.log("setimage");
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
