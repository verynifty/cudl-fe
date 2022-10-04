<template>
  <div class="flex justify-center">
    <div
      class="
        home
        card
        bg-white
        w-4/5
        mt-12
        px-8
        border-4 border-black
        boxShadow
        mb-10
        pb-32
      "
    >
      <div
        class="
          text-2xl
          md:text-4xl
          text-center
          mt-16
          px-4
          md:px-0
          font-bold
          uppercase
          txtShadow
        "
      >
        Your Pets
      </div>
      <NFTList class="cursor-pointer" :leaderboard="false" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NFTList from "@/components/NFTList.vue";
import PlayHeader from "@/components/PlayHeader.vue";

export default {
  name: "Home",
  components: {
    NFTList,
    PlayHeader,
  },
  data: function () {
    return {};
  },
  created: function () {},
  methods: {},
  mounted: async function () {
    this.$store.commit("setNetworkCheck", true);
  },
};
</script>
