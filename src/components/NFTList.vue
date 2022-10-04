<template>
  <div class="nft_list">
    <div class="flex items-center justify-between">
      <router-link to="/multi" class="justify-end">
        <img
          src="@/assets/img/icons/heart-box.svg"
          class="h-8 cursor-pointer"
        />
      </router-link>
      <a href="/weapons">
        <img
          src="https://cdns.iconmonstr.com/wp-content/assets/preview/2018/240/iconmonstr-boxing-2.png"
          alt=""
          class="h-8 cursor-pointer"
        />
      </a>
    </div>
    <div v-if="!isLoading">
      <div v-if="isConnected" class="px-2 md:px-0">
        <div
          class="
            flex flex-col flex-wrap
            md:flex-row md:-mx-3 md:justify-start
            items-start
            mt-6
            text-center
          "
        >
          <router-link
            class="md:w-1/3 w-4/5 p-3 md:px-3"
            v-for="nft in nfts"
            :key="nft._pet"
            :to="`/nft/${nft.pet_id}`"
          >
            <NFT :nft="nft" />
          </router-link>
        </div>
      </div>
      <div v-else class="text-center text-2xl mt-10">
        You don't have any active Pets yet. Register one of your NFTs below to
        play the game.

        <!-- Buy one in
        <a
          href="https://nft20.io/mooncats"
          target="_blank"
          class="hover:text-blue-400"
        >
          NFT20</a
        >
        Or with a 1 click buy below. -->
      </div>

      <div id="join" v-if="nftsToJoinLoaded">
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
          Join The Game With Your NFTS
        </div>
        <div
          class="flex items-center md:-mx-3 flex-wrap"
          v-if="userNfts.length > 0"
        >
          <div
            class="md:w-1/3 w-4/5 p-3 md:px-3"
            v-for="nft in userNfts"
            :key="nft.id"
          >
            <NFTCardRegister :nft="nft" v-on:registered="fetchNFTS()" />
          </div>
        </div>
        <div class="text-center text-2xl" v-else>
          <div class="mt-3 mb-3 hidden">
            Make sure to
            <a
              class="underline hover:underline"
              href="https://medium.com/cudl-finance/a-comprehensive-starter-guide-for-cudl-finance-dcb16700f408"
              target="_blank"
              >read our getting started guide</a
            >
            to avoid getting a cat that is already dead and get started safely.
          </div>
          <div>
            You don't own any more qualifying NFTs for the game, you can buy one
            on the
            <router-link
              to="/bazaar?buy=true"
              class="text-purple-500 hover:underline"
            >
              Bazaar
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">Loading...might take a minute</div>

    <ConnectWallet />
  </div>
</template>

<script>
import ConnectWallet from "@/components/ConnectWallet.vue";
import NFT from "@/components/NFT.vue";
import NFTCardRegister from "@/components/NFTCardRegister.vue";
import NFTTools from "@/components/NFTTools.vue";
import axios from "axios";
export default {
  name: "NFTList",
  components: { ConnectWallet, NFT, NFTTools, NFTCardRegister },
  data: function () {
    return {
      nfts: [],
      userNfts: [],
      isLoading: false,
      isLoaded: false,
      listSize: 0,
      onClicked: Function,
      showTable: false,
      nftsCanMine: [],
      gems: [],
      hasTokenApproval: false,
      tooslVisible: false,
      nftsToJoinLoaded: false,
    };
  },
  methods: {
    fetchNFTS: async function () {
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

      let nfts = [];
      const pets = await axios(
        `https://api.nft20.io/cudl/owner/${this.$store.state.account}`
      );
      if (pets.data.petsOwned.length > 0) {
        for (const pet of pets.data.petsOwned) {
          nfts.push(pet);
        }
      }
      if (pets.data.careTaking.length > 0) {
        for (const pet of pets.data.careTaking) {
          nfts.push(pet);
        }
      }

      this.nfts = nfts;
      this.isLoading = false;

      // check pets to join the game

      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Moonpet
            )
            .call()
        ).length >= 18;
      this.isLoaded = true;
    },
    // canMine: function (params) {
    //   alert(params);
    // },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let approve = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.Moonpet, max)
        .send({
          from: this.$store.state.account,
        });
    },

    fetchUnregisteredPets: async function () {
      this.listSize = parseInt(
        await this.$store.state.Mooncat.methods
          .balanceOf(this.$store.state.account)
          .call()
      );
      if (this.listSize > 0) {
        for (let index = 0; index < this.listSize; index++) {
          console.log(index);
          let id = await this.$store.state.Mooncat.methods
            .tokenOfOwnerByIndex(this.$store.state.account, index)
            .call();
          if (
            (await this.$store.state.Moonpet.methods
              .isNftInTheGame(this.$store.state.contracts.Mooncats, id)
              .call()) == false
          ) {
            this.userNfts.push({
              id: id,
              name: "CUDL Pets",
              contract: this.$store.state.contracts.Mooncats,
            });
          }
        }
      }

      // add smol brains

      const smolBrain = await this.$store.state.ERC721(
        this.$store.state.contracts.SmolBrain
      );

      // this.$store.state.account = "0x2f14a4abc940049de389973c8d4ad022712dafc6";
      console.log("smolBrain ", smolBrain);
      let smallBrainsOwned = parseInt(
        await smolBrain.methods.balanceOf(this.$store.state.account).call()
      );

      console.log("smallBrainsOwned ", smallBrainsOwned);

      if (smallBrainsOwned > 0) {
        for (let index = 0; index < smallBrainsOwned; index++) {
          let id = await smolBrain.methods
            .tokenOfOwnerByIndex(this.$store.state.account, index)
            .call();
          if (
            (await this.$store.state.Moonpet.methods
              .isNftInTheGame(this.$store.state.contracts.SmolBrain, id)
              .call()) == false
          ) {
            this.userNfts.push({
              image: `https://gateway.pinata.cloud/ipfs/QmY71ban6QoWg9nbNwikk6wVWknj8NFBG8nMGHEuzwfAwf/${id}/5.png`,
              id: id,
              name: "Smol Brain",
              contract: this.$store.state.contracts.SmolBrain,
            });
          }
        }
      }
      this.nftsToJoinLoaded = true;
    },
    init: async function () {
      // alert(this.hasTokenApproval);
    },
  },
  mounted: function () {
    this.fetchNFTS();
  },
  beforeMount: function () {},
  watch: {
    isConnected: function () {
      this.fetchNFTS();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>