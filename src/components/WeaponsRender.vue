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
    <img :src="image" alt="NFT" class="object-contain mb-6 mt-2" />
    <p class="mb-4 text-xl flex flex-col text-center">
      <span class="text-xl font-bold">WEAPON #{{ nft.id }}</span>
    </p>

    <!-- <div
      class="flex justify-between text-xl w-full pt-4 border-t-8 border-black"
    >
      <button class="btn">
        <span class="">Give Life To Your Cudl Pet (2txs)</span>
      </button>
    </div> -->
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

      isOwner: false,
      owner: "",
    };
  },
  methods: {
    render: async function () {
      let URI = await this.$store.state.Weapons.methods
        .tokenURI(this.nft.id)
        .call();

      let text = Buffer.from(
        URI.slice(URI.split(",")[0].length + 1),
        "base64"
      ).toString("utf-8");
      const item = JSON.parse(text);

      this.image = item.image;
    },
  },
  beforeMount: function () {},
  mounted: async function () {
    this.render();
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

      <style scoped></style>
