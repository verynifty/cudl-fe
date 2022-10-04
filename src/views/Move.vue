<template>
  <div class="nft_list">
    <router-link to="/multi" class="justify-end">
      <img src="@/assets/img/icons/heart-box.svg" class="h-8 cursor-pointer" />
    </router-link>
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
        Transfer your NFTs to another wallet
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
          <NFTCardTransfer :nft="nft" v-on:registered="fetchNFTS()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectWallet from "@/components/ConnectWallet.vue";
import NFT from "@/components/NFT.vue";
import NFTCardTransfer from "@/components/NFTCardTransfer.vue";
import NFTTools from "@/components/NFTTools.vue";
import axios from "axios";
export default {
  name: "NFTList",
  components: { ConnectWallet, NFT, NFTTools, NFTCardTransfer },
  data: function () {
    return {
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
          let gameId = null;
          let image;
          try {
            gameId = await this.$store.state.Moonpet.methods
              .nftToId(this.$store.state.contracts.Mooncats, id)
              .call();

            let a = await this.$store.state.Render.methods
              .render(gameId)
              .call();

            let getObject = a.substring(27);
            let { image, attributes } = JSON.parse(`${getObject}`);

            image = image;
          } catch (e) {
            gameId = null;
          }

          this.userNfts.push({
            id: id,
            petId: gameId,
            image: image,
            contract: this.$store.state.contracts.Mooncats,
          });
        }
      }
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Moonpet
            )
            .call()
        ).length >= 18;
      console.log("LOADED");
      this.isLoading = false;
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