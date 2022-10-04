<template>
  <div
    class="
      container
      m-auto
      text-white
      mt-6
      text-center
      leading-loose
      tracking-wide
    "
  >
    <h1 class="text-center text-4xl">Add a Care Taker</h1>
    <p class="text-xl mt-2">
      Allow an external wallet or contract to buy food and claim $CUDL on behalf
      of your pet without losing ownership of it, Your NFT never leaves your
      wallet.
    </p>
    <p class="mt-2 text-xl">
      You can remove a care taker at any moment as the owner of your pet.
    </p>
    <p class="p-2 text-xl">
      You'll still be able to mine and claim rewards for your Pet if you wanted,
      while having a care taker too.
    </p>

    <div class="flex flex-col px-6 md:px-0 w-full md:w-1/2 m-0 m-auto mt-6">
      <div class="w-full">
        <div class="text-left text-xl">Your Pet:</div>
        <input
          v-model="petId"
          type="text"
          placeholder="Your Pet #"
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
      <div class="w-full mt-6">
        <div class="text-left text-xl">Care Taker Address:</div>
        <input
          v-model="careTakerAddress"
          type="text"
          placeholder="Care Taker Address"
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
      <div class="flex md:flex-row flex-col -mx-3">
        <div class="px-3 w-full md:w-1/2">
          <button
            @click="addCareTaker()"
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
            Add care taker
          </button>
        </div>
        <div class="px-3 w-full md:w-1/2">
          <button
            @click="removeCareTaker()"
            type="button"
            class="
              focus:outline-none
              hover:bg-white
              hover:text-gray-900
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
            Remove care takers
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
      petId: "",
      careTakerAddress: "",
    };
  },
  mounted: function () {
    this.$store.commit(
      "setBackgroundVideoUrl",
      "https://player.vimeo.com/video/409572571?background=1"
    );
  },
  methods: {
    addCareTaker: async function () {
      if (this.petId == "" || this.careTakerAddress == "") {
        alert(`Input the Pet id and care taker address to add a care taker.`);
      } else {
        let addcaretaker = await this.$store.state.Moonpet.methods
          .setCareTaker(this.petId, this.careTakerAddress, false)
          .send({
            from: this.$store.state.account,
          });
      }
    },
    removeCareTaker: async function () {
      if (this.petId == "") {
        alert("Input the vNFT id to clear care takers from");
      } else {
        let removecaretaker = await this.$store.state.Moonpet.methods
          .setCareTaker(this.petId, this.careTakerAddress, true)
          .send({
            from: this.$store.state.account,
          });
      }
    },
  },
};
</script>
