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
    <h1 class="text-center text-4xl">Was your pet already in the game?</h1>
    <p class="text-xl mt-2">
      Check if your pet would be valid to join the game
    </p>

    <div class="flex flex-col px-6 md:px-0 w-full md:w-1/2 m-0 m-auto mt-6">
      <div class="w-full">
        <div class="text-left text-xl">Your Pet:</div>
        <input
          v-model="petId"
          type="text"
          placeholder="Your Mooncat id #"
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
      <!-- <div class="w-full mt-6">
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
      </div> -->
      <div class="flex md:flex-row flex-col -mx-3">
        <div class="px-3 w-full md:w-full">
          <button
            @click="check"
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
            CHECK
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
      moonCat: "0xc3f733ca98e0dad0386979eb96fb1722a1a05e69",
    };
  },
  mounted: function () {
    this.$store.commit(
      "setBackgroundVideoUrl",
      "https://player.vimeo.com/video/409572571?background=1"
    );
  },
  methods: {
    check: async function () {
      if (this.petId == "") {
        alert("Input the Mooncat id to check");
      } else {
        let check = await this.$store.state.Moonpet.methods
          .isNftInTheGame(this.moonCat, this.petId)
          .call();

        if (check) {
          alert("Can't re join the game");
        } else {
          alert("Your Mooncat can join the game.");
        }
      }
    },
  },
};
</script>
