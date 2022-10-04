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
      :src="image"
      alt="NFT"
      class="object-contain mb-6 mt-8"
      style="height: 220px"
    />

    <p class="mb-4 text-xl flex flex-col text-center">
      <span class="text-xl font-bold"
        >NFT ID #{{ nft.id }} - PET ID {{ nft.petId }}</span
      >
    </p>

    <div
      class="flex justify-center text-xl w-full pt-4 border-t-8 border-black"
    >
      <button class="btn" @click="transfer">
        <span class="">Transfer this NFT</span>
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
      image: "",
    };
  },
  methods: {
    getImage: async function () {
      console.log("GET IMAGE");
      let a = await this.$store.state.Render.methods.render(this.nft.id).call();

      let getObject = a.substring(27);
      console.log(getObject);
      let { image, attributes } = JSON.parse(`${getObject}`);
      console.log(attributes);

      this.image = image;
    },
    transfer: async function () {
      let ctx = this;

      let to = prompt("paste the destination address");
      let register = await this.$store.state.Mooncat.methods
        .safeTransferFrom(this.$store.state.account, to, this.nft.id)
        .send({
          from: this.$store.state.account,
        });
    },
  },
  beforeMount: function () {},
  mounted: async function () {
    this.getImage();
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
