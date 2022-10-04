<template >
  <div class="home bg-white text-gray-900" >
    <ConnectWallet />

    <div :v-if="isConnected" class>
      <div class="text-xl md:text-4xl text-center mt-16 px-4 py-4 md:px-0">
        The Nifty Animals Experiment!
        <p class="md:text-xl text-lg">
         Every time the pet is fed it resets the clock to 2 hours
          <ul class="leading-loose tracking-wide mt-4">
            <li>
             <span class="text-primary"> Last one who feeds the pet gets the pet and all the $CUDL it mined.</span>
            </li>
            
          </ul>
        </p>
      </div>

      <div
        v-if="isLoaded && isRunning"
        class="flex flex-col flex-wrap md:flex-row md:-mx-3 md:justify-center items-center mt-6 text-center"
      >
        <div class="md:w-1/2 w-4/5 p-3 md:px-3">
          <div
            class="rounded flex justify-center items-center border-2 p-4 border-gray-900 flex-col shadow-xl bg-white bg-opacity-25"
          >
            <img
              src="https://cudl.finance/img/alien.31bad01b.png"
              alt="NFT"
              class="object-contain mb-6"
              style="height: 320px; width: 320px;"
            />
            <p class="mb-6 text-xl">Prize: vNFT #{{ nftID }}</p>
            <div class="flex -mx-3">
              <div class="px-3">Current Level: {{ currentLevel }}</div>

              <div class="px-3">
                $CUDL total Rewards:
                <Number decimals="18" :number="museSizeReward" />
              </div>
            </div>

            <div class="flex -mx-3">
              <!-- <div class="px-3">
          
              // </div>-->
              <div class="px-3">
                Current Winner: <a :href="`https://arbiscan.io/address/${winner}`">{{winner}}</a>
              </div>
            </div>
            <div class="flex -mx-3">
              <!-- <div class="px-3">
          
              // </div>-->
              <div class="px-3" v-if="hasLoadedTimer">
                End in:
                <vac :end-time="endTime">
                  <span slot="process" slot-scope="{ timeObj }">
                    {{
                      `${timeObj.d} days and ${timeObj.h}:${timeObj.m}:${timeObj.s}`
                    }}
                  </span>
                  <span slot="finish">Finished!</span>
                </vac>
               
              </div>
            </div>

            <div
              class="flex md:flex-row flex-col md:items-start items-center md:-mx-2 -my-2 py-4 mt-4 mb-8 text-sm"
            >
              <div class="md:px-2 md:py-0 py-2">
                <button
                  class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-3 mt-6 text-md"
                >
                  <span class v-if="!hasTokenApproval"  @mouseover="startConfetti()" @click="feedPet()" >
                    Approve & feed for
                    <Number decimals="18" :number="gemPrice" />$cudl
                  </span>
                  <span class v-if="hasTokenApproval" @mouseover="startConfetti()" @click="feedPet()"
                    >Feed pet for
                    <Number decimals="18" :number="gemPrice" /> $cudl</span
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isLoaded && !isRunning"
        class="flex flex-col flex-wrap md:flex-row md:-mx-3 md:justify-center items-center mt-6 text-center"
      >
        <div class="md:w-1/2 w-4/5 p-3 md:px-3">
          <div
            class="rounded flex justify-center items-center border-2 p-4 border-gray-900 flex-col shadow-xl bg-white bg-opacity-25"
          >
            The lottery has ended, check the announcement channel for winners.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.body {
  background-color: red;
}
</style>

<script>
import ConnectWallet from "@/components/ConnectWallet.vue";
import TokenBalance from "@/components/TokenBalance.vue";
import Number from "@/components/Number.vue";
require("canvas-confetti");
export default {
  name: "Claim",
  components: { ConnectWallet, TokenBalance, Number },
  data: function () {
    return {
      isRunning: true,
      isApproved: false,
      endTime: 0,
      museSizeReward: "0",
      nftID: 0,
      isLoaded: true,
      loader: false,
      image: "",
      currentLevel: 0,
      winner: "",
      hasLoadedTimer: false,
      hasTokenApproval: false,
      gemPrice: "0",
    };
  },
  created: async function () {
    this.initialize();
  },
  methods: {
    initialize: async function (id, key) {
      if (this.$store.state.web3 == null) {
        return false;
      }
      this.winner = await this.$store.state.NiftyAnimalsContract.methods
        .winner()
        .call();
      console.log(this.$store.state.account);
      let state = await this.$store.state.NiftyAnimalsContract.methods
        .getInfos()
        .call();
      this.endTime = parseInt(state._endTime) * 1000;
      console.log(this.endTime);
      this.nftID = parseInt(state._currentVNFT);
      this.museSizeReward = state._museSize;
      this.gemPrice = state._gemPrice;
      this.hasLoadedTimer = true;
      const data = await axios.get(
        `https://gallery.verynifty.io/api/${this.nftID}`
      );
      this.image = data.data.image_data;
      // this.image = `https://gallery.verynifty.io/api/image/0.svg`;
      let infos = await this.$store.state.vNFTContract.methods
        .getVnftInfo(this.nftID)
        .call();
      this.currentLevel = infos._level;
      this.hasTokenApproval =
        (
          await this.$store.state.MuseTokenContract.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Lottery
            )
            .call()
        ).length >= 18;
      this.isLoaded = true;
    },
    feedPet: async function () {
      try {
        this.loader = this.$loading.show({
          container: this.fullPage ? null : this.$refs.formContainer,
          canCancel: false,
        });
        this.hasTokenApproval =
          (
            await this.$store.state.MuseTokenContract.methods
              .allowance(
                this.$store.state.account,
                this.$store.state.contracts.NiftyAnimals
              )
              .call()
          ).length >= 18;
        if (!this.hasTokenApproval) {
          await this.approve();
        }
        let minetx = await this.$store.state.NiftyAnimalsContract.methods
          .feedPet()
          .send({
            from: this.$store.state.account,
          });
        console.log(minetx);
        await this.initialize();
        this.loader.hide();
        this.$notify({
          group: "foo",
          title: "Success",
          text: `TX Hash: ${minetx.blockHash}`,
          type: "success",
        });
      } catch (e) {
        console.log(e);
        this.loader.hide();
        this.$notify({
          group: "foo",
          title: "Error",
          text: `There was an error with the tx`,
          type: "error",
        });
      }
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let approve = await this.$store.state.MuseTokenContract.methods
        .approve(this.$store.state.contracts.NiftyAnimals, max)
        .send({
          from: this.$store.state.account,
        });
    },
    startConfetti: async function () {
      // this.$confetti.start();
      this.$confetti.start({
        particles: [
          {
            type: "rect",
            colors: [
              "DodgerBlue",
              "OliveDrab",
              "Gold",
              "pink",
              "SlateBlue",
              "lightblue",
              "Violet",
              "PaleGreen",
              "SteelBlue",
              "SandyBrown",
              "Chocolate",
              "Crimson",
            ],
          },
          {
            type: "circle",
            colors: ["#ba0000"],
          },
          {
            type: "image",
            url: require("@/assets/img/icons/cudl-token.png"),
          },
        ],
      });
    },
  },
  beforeCreate: function () {
    document.body.style.backgroundColor = "#3d3d3d";
  },
  beforeDestroy: function () {
    this.$confetti.stop();
    document.body.style.backgroundColor = "#ffffff";
  },
  mounted: function () {},
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  watch: {
    isConnected: async function () {
      await this.initialize();
    },
  },
};
</script>