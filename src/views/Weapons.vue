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
        Your Weapons
      </div>
      <div v-if="!isLoading">
        <div v-if="isConnected" class="px-2 md:px-0">
          <div id="join">
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
              <!-- Join The Game With Your NFTS -->
            </div>
            <div
              class="flex items-center md:-mx-3 flex-wrap"
              v-if="userNfts.length > 0"
            >
              <div
                class="md:w-1/2 w-4/5 p-3 md:px-3"
                v-for="nft in userNfts"
                :key="nft.id"
              >
                <!-- TODO Add here the weapons -->
                <WeaponsRender :nft="nft" />
              </div>
            </div>
            <div class="text-center text-2xl" v-else>
              <div>You don't own any Weapons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WeaponsRender from "@/components/WeaponsRender";
export default {
  name: "Weapons",
  components: { WeaponsRender },
  data: function () {
    return {
      listSize: 0,
      userNfts: [],
      isLoading: false,
      isLoaded: false,
    };
  },
  methods: {
    fetchWeapons: async function () {
      console.log(
        this.$store.state.web3 == null,
        this.isLoading,
        this.isLoaded
      );
      if (this.$store.state.web3 == null || this.isLoading || this.isLoaded) {
        return;
      }
      this.isLoading = true;
      console.log(this.$store.state.account);
      this.listSize = parseInt(
        await this.$store.state.Weapons.methods
          .balanceOf(this.$store.state.account)
          .call()
      );
      if (this.listSize > 0) {
        for (let index = 0; index < this.listSize; index++) {
          console.log(index);
          let id = await this.$store.state.Weapons.methods
            .tokenOfOwnerByIndex(this.$store.state.account, index)
            .call();
          this.userNfts.push({
            id: id,
            image: "https://via.placeholder.com/350x150",
            contract: this.$store.state.contracts.Weapons,
          });
        }

        this.isLoading = false;
        this.isLoaded = true;
      }
    },
  },
  mounted: async function () {},
  watch: {
    isConnected: function () {
      this.fetchWeapons();
    },
  },
  created: function () {},
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
};
</script>
