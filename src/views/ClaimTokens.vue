<template>
  <div
    class="
      container
      m-auto
      text-gray-900
      mt-6
      text-center
      leading-loose
      tracking-wide
    "
  >
    <h1 class="text-center text-4xl">Claim your Gov okens</h1>
    <p class="text-xl mt-2">
      Put in your pet ID to get the tokens you deserve for our upcoming NFT DEX.
    </p>

    <div class="flex flex-col px-6 md:px-0 w-full md:w-1/2 m-0 m-auto mt-6">
      <div class="w-full">
        <div class="text-left text-xl">Your vNFT:</div>
        <input
          v-model="vnftId"
          type="text"
          placeholder="Your vNFT #"
          class="
            w-full
            border-2 border-gray-900
            bg-white bg-opacity-100
            text-gray-900
            py-2
            px-3
            mt-2
            text-md
          "
        />
      </div>

      <div class="flex md:flex-row justify-center flex-col -mx-3">
        <div class="px-3 w-full md:w-1/2">
          <button
            @click="getTokens"
            type="button"
            class="
              hover:bg-white
              hover:text-gray-900
              focus:outline-none
              w-full
              border-2 border-gray-900
              bg-gray-900 bg-opacity-100
              text-white
              py-2
              px-3
              mt-6
              text-md
            "
          >
            Get Tokens
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
      vnftId: "",
    };
  },
  mounted: function () {},
  methods: {
    getTokens: async function () {
      if (this.vnftId == "") {
        alert("Input the vNFT id you want to claim tokens for");
        this.$notify({
          group: "foo",
          title: "Input right parameters",
          text: `Input the vNFT id you want to claim tokens for.`,
          type: "error",
        });
      } else {
        let addcaretaker = await this.$store.state.VnftDistribution.methods
          .getTokens(this.vnftId)
          .send({
            from: this.$store.state.account,
          });
      }
    },
  },
};
</script>
