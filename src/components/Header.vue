<template>
  <div class="">
    <div
      class="
        flex
        md:flex-row
        flex-wrap flex-col
        justify-center
        md:justify-between
        items-center
        shadow-lg
        full-width
        px-10
        bg-purple-500
        text-blue-900
        py-3
        border-b-4 border-purple-900
      "
    >
      <div
        class="
          w-full
          md:w-auto
          flex
          justify-between
          md-:justify-start
          items-center
          text-xl
          md:text-4xl
          z-50
        "
      >
        <div class="">
          <div class="flex items-center">
            <router-link to="/">
              <img src="@/assets/img/cudl.png" class="h-16" />
            </router-link>
            <span class="mt-3 ml-2 text-sm font-semibold">
              <a href="https://twitter.com/niftymuseum" target="blank">
                By $MUSE</a
              >
            </span>
          </div>
        </div>

        <div class="hidden ml-6 md:flex items-center text-sm leading-normal">
          <div class="px-3 pt-3 pb-0 hover:bg-purple-400">
            <router-link to="/play">Play</router-link>
          </div>
          <div class="px-3 pt-3 pb-0 hover:bg-purple-400">
            <router-link to="/leaderboard">Leaderboard</router-link>
          </div>

          <div class="px-3 pt-3 pb-0 hover:bg-purple-400">
            <a href="https://cudl.finance/bazaar?buy=true">Buy Pet</a>
          </div>

          <div class="px-3 pt-3 pb-0 hover:bg-purple-400">
            <a
              href="https://app.sushi.com/swap?inputCurrency=&outputCurrency=0x0f4676178b5c53ae0a655f1b19a96387e4b8b5f2"
              target="_blank"
              >Buy $CUDL</a
            >
          </div>

          <div class="px-3 pt-3 pb-0 hover:bg-purple-400">
            <router-link to="/farm">Farm</router-link>
          </div>

          <div class="px-3 pt-3 pb-0 hover:bg-purple-400">
            <router-link to="/milk">Milk</router-link>
          </div>
        </div>

        <!-- this is on mobile -->
        <div
          class="
            md:hidden
            text-sm
            cursor-pointer
            px-3
            pt-3
            pb-0
            hover:bg-purple-400
            border-bg-yellow-400
          "
          @click="toggleMenu"
        >
          Menu
        </div>
      </div>

      <div class="space-x-8 md:flex items-center hidden">
        <div class="text-sm cursor-pointer px-3 pt-3" @click="toggleMenu">
          <div class="text-yellow-400">
            <div class="relative">
              Adventures

              <div class="absolute -right-7 -top-4 text-2xl">🌏</div>
            </div>
          </div>
        </div>
        <div class="items-center">
          <div>
            <div
              class="
                flex
                text-sm
                items-center
                justify-center
                w-full
                border-4 border-black
                pl-3
                pt-3
                bg-yellow-400
                text-black
                boxShadow
                space-x-4
              "
            >
              <!-- <div>Your $CUDL:</div> -->
              <div class="uppercase font-bold">
                <span>
                  <TokenBalance
                    :erc20="CUDLToken"
                    :account="account"
                    symbol="CUDL"
                    decimals="18"
                /></span>
              </div>
              <div>
                <span>
                  <TokenBalance
                    :erc20="$store.state.contracts.Milk"
                    :account="$store.state.account"
                    symbol="Milk"
                    decimals="18"
                  />
                </span>
              </div>
              <div class="uppercase font-bold">
                <Address :address="account" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        w-full
        sm:w-64 sm:absolute
        z-50
        bg-purple-500
        py-4
        px-10
        sm:px-0 sm:right-96
      "
      id="mobile-menu"
      v-if="menuActive"
      @click="toggleMenu"
    >
      <ul>
        <li class="sm:hidden mt-2"><Address :address="account" /></li>
        <li class="sm:hidden mt-2">
          <TokenBalance
            :erc20="CUDLToken"
            :account="account"
            symbol="$CUDL"
            decimals="18"
          />
        </li>

        <li class="mt-2 sm:hidden">
          <router-link to="/play">Play</router-link>
        </li>

        <li class="mt-2 sm:hidden">
          <router-link to="/leaderboard">Leaderboard</router-link>
        </li>

        <li class="mt-2 sm:hidden">
          <a href="https://cudl.finance/bazaar?buy=true">Buy A Pet</a>
        </li>

        <li class="mt-2 sm:hidden">
          <a
            href="https://app.sushi.com/swap?inputCurrency=&outputCurrency=0x0f4676178b5c53ae0a655f1b19a96387e4b8b5f2"
            target="_blank"
            >Buy $CUDL</a
          >
        </li>

        <li class="mt-2 desktopMenu">
          <router-link to="/bazaar">Bazaar</router-link>
        </li>
        <li class="mt-2 desktopMenu">
          <router-link to="/milk">Milk</router-link>
        </li>
        <li class="mt-2 desktopMenu">
          <router-link to="/race">Race</router-link>
        </li>
        <li class="mt-2 desktopMenu">
          <router-link to="/care-taker">Care Taker</router-link>
        </li>

        <li class="mt-2 sm:hidden">
          <router-link to="/farm">Farm</router-link>
        </li>
        <li class="mt-2 sm:hidden">
          <router-link to="/faqs">How To Play</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>



<script>
import Header from "@/components/Header.vue";
import TokenBalance from "@/components/TokenBalance.vue";
import EthBalance from "@/components/EthBalance.vue";
import Address from "@/components/Address.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: { TokenBalance, EthBalance, Address, Footer, Header },
  data: function () {
    return {
      menuActive: false,
      milk: 0,
    };
  },
  props: {},
  mounted: async function () {
    // await this.getMilk();
  },
  beforeMount: function () {
    if (this.$web3Modal.providerController.cachedProvider != null) {
      console.log(
        "Connecting back to: ",
        this.$web3Modal.providerController.cachedProvider
      );
      this.$store.dispatch("connectWallet", this);
    }
  },
  computed: {
    account: function () {
      return this.$store.state.account;
    },
    CUDLToken: function () {
      return this.$store.state.contracts.CUDL;
    },
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
    correctNetwork: function () {
      console.log(
        this.$store.state.checkNetwork,
        this.$store.state.correctNetwork
      );
      return (
        (this.$store.state.checkNetwork &&
          this.$store.state.correctNetwork != "WRONG") ||
        (!this.$store.state.checkNetwork &&
          this.$store.state.correctNetwork == "WRONG")
      );
    },
    checkNetwork: function () {
      return this.$store.state.checkNetwork;
    },
  },
  methods: {
    toggleMenu: function () {
      this.menuActive = !this.menuActive;
      // some code to filter users
    },
    getMilk: async function () {
      const earned = await this.$store.state.Milk.methods
        .earned(this.$store.state.account)
        .call();

      this.milk = parseInt(earned / 1e12) / 1e6;
    },
    connectToArbitrum: async function () {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xA4B1",
            chainName: "Arbitrum One",
            nativeCurrency: {
              name: "AETH",
              symbol: "AETH",
              decimals: 18,
            },
            rpcUrls: ["https://arb1.arbitrum.io/rpc"],
            blockExplorerUrls: ["https://arbiscan.io"],
          },
        ],
      });
      location.reload();
    },
  },
  watch: {
    isConnected: function () {
      // this.getMilk();
    },
  },
};
</script>

<style></style>


