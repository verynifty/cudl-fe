<template>
  <div class="home text-white ">
    <ConnectWallet />

    <div :v-if="isConnected">
      <div class="text-xl md:text-4xl text-center mt-16 px-4 md:px-0">
        The Cudl Lottery!
        <p class="md:text-xl text-lg">
          Feed the community's Mooncat to get 1 ticket, the more tickets you have the higher your chances to win. The contract will randomly select 4 winners when the lottery ends.
          <ul class="leading-loose tracking-wide mt-4">
            <li>
             <span class="text-primary">1st place:</span> Get's the Pet!
            </li>
            <li>
              <span class="text-primary">2nd place:</span> gets 35% of the $CUDL mined.
            </li>
            <li>
               <span class="text-primary">3rd place:</span> gets 19% of the $CUDL mined
            </li>
            <li>
               <span class="text-primary">4th place:</span> gets 19% of the $CUDL mined
            </li>
            <li>
               <span class="text-primary">The rest of the $CUDL mined is burned!</span>
            </li>
          </ul>
        </p>
      </div>

      <div
        v-if="isLoaded && isRunning"
        class="text-gray-900 flex flex-col flex-wrap md:flex-row md:-mx-3 md:justify-center items-center mt-6 text-center"
      >
        <div class="md:w-1/2 w-4/5 p-3 md:px-3">
          <div
            class="rounded flex justify-center items-center border-2 p-4 border-gray-900 flex-col shadow-xl bg-white"
          >
            <img
              src="https://api.mooncat.community/image/0x0039390f80"
              alt="NFT"
              class="object-contain mb-6"
              style="height: 320px; width: 320px;"
            />
            <p class="mb-6 text-xl">Prize: pet #{{ nftID }}</p>
            <div class="flex -mx-3">
              <div class="px-3">Current Level: {{ currentLevel }}</div>

              <div class="px-3">
                $CUDL total Rewards:
                <Number decimals="18" :number="cudlSizeReward" />
              </div>
            </div>

            <div class="flex -mx-3">
              <!-- <div class="px-3">
          
              // </div>-->
              <div class="px-3">
                Your tickets: {{ usertickets }} / {{ participants }}
              </div>
            </div>
            <div class="flex -mx-3">
              <!-- <div class="px-3">
          
              // </div>-->
              <div class="px-3">
                End in:
                <vac :end-time="endTime * 1000">
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
              class="text-gray-900 flex md:flex-row flex-col md:items-start items-center md:-mx-2 -my-2 py-4 mt-4 mb-8 text-sm"
            >
              <div class="md:px-2 md:py-0 py-2">
                <button
                  class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-2 px-3 mt-6 text-md"
                >
                  <span class v-if="!hasTokenApproval"  @mouseover="startConfetti()" @click="buyTicket()" >
                    Approve & get ticket for
                    <Number decimals="18" :number="ticketPrice" />$CUDL
                  </span>
                  <span class v-if="hasTokenApproval" @mouseover="startConfetti()" @click="buyTicket()"
                    >Get ticket for
                    <Number decimals="18" :number="ticketPrice" /> $CUDL</span
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
      isRunning: false,
      isApproved: false,
      participants: 0,
      endTime: 0,
      startTime: 0,
      cudlSizeReward: 0,
      ticketPrice: 0,
      nftID: 0,
      usertickets: 0,
      isLoaded: false,
      loader: false,
      currentLevel: 0,
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
      console.log(this.$store.state.account);
      let state = await this.$store.state.LotteryContract.methods
        .getInfos(this.$store.state.account)
        .call();
      this.isRunning = state._end != "0";

      this.participants = parseInt(state._participants);
      this.endTime = parseInt(state._end);
      this.startTime = parseInt(state._start);
      this.nftID = parseInt(state._currentPet);
      this.cudlSizeReward = state._cudlSize;
      this.usertickets = parseInt(state._ownerTickets);
      this.ticketPrice = state._foodPrice;

      let infos = await this.$store.state.Moonpet.methods
        .getPetInfo(this.nftID)
        .call();
      this.currentLevel = infos._level;
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Lottery
            )
            .call()
        ).length >= 18;
      this.isLoaded = true;
    },
    buyTicket: async function () {
      try {
        this.hasTokenApproval =
          (
            await this.$store.state.CUDL.methods
              .allowance(
                this.$store.state.account,
                this.$store.state.contracts.Lottery
              )
              .call()
          ).length >= 18;
        if (!this.hasTokenApproval) {
          await this.approve();
        }
        let minetx = await this.$store.state.LotteryContract.methods
          .buyTicket(this.$store.state.account)
          .send({
            from: this.$store.state.account,
          });

        console.log(minetx);
        await this.initialize();
      } catch (e) {
        console.log(e);
      }
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let approve = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.Lottery, max)
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
  beforeDestroy: function () {
    this.$confetti.stop();
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