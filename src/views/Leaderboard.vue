<template>
  <div class="home">
    <div class="text-xl md:text-4xl text-center mt-16 px-4 md:px-0 txtShadow2">
      Leaderboard
      <p class="md:text-xl text-lg">
        If a Pet starved you'll see a grumpy cat face by his position. You can
        claim 20% of it's points by being the first that clicks on the grumpy
        cat
      </p>
    </div>
    <div class="md:px-0 px-2">
      <div class="mt-8 flex md:-mx-4">
        <div
          class="px-4 cursor-pointer border-gray-900 rounded"
          @click="toggleLeaderboard('leaderboard')"
          :class="{ 'border-b-4': showLeaderboard }"
        >
          Leaderboard
        </div>
        <div
          class="px-4 cursor-pointer border-gray-900 rounded"
          @click="toggleLeaderboard"
          :class="{ 'border-b-4': showDeadNfts }"
        >
          Grumpy Pets
        </div>
      </div>
    </div>
    <div
      class="
        flex
        -m-3
        md:px-0
        px-2
        justify-center
        md:justify-start
        mt-8
        flex-wrap
        overflow-y-hidden overflow-x-auto
      "
    >
      <div
        v-if="isConnected && showLeaderboard"
        class="md:w-1/4 w-4/5 p-3"
        v-for="(nft, index) in leaderBoard"
        :key="nft.id"
        v-on:click="clickNFT(nft.id)"
      >
        <NFT
          :contract="nft.contract"
          :id="nft.id"
          :position="index + 1"
          :leaderboard="true"
        />
      </div>
      <div
        v-if="isConnected && !showLeaderboard"
        class="md:w-1/4 w-4/5 p-3"
        v-for="(nft, index) in deadVnfts"
        :key="nft.id"
        v-on:click="clickNFT(nft.id)"
      >
        <NFT
          :contract="nft.contract"
          :id="nft.id"
          :position="index + 1"
          :leaderboard="true"
        />
      </div>
      <div
        class="text-xl mt-8"
        v-if="!deadVnfts.length > 0 && !showLeaderboard"
      >
        Querying the blockchain. If this keeps showing for over 6 minutes, no
        dead vNFTs were found.
      </div>
    </div>

    <ConnectWallet />
  </div>
</template>

<script>
// @ is an alias to /src
import NFT from "@/components/NFT.vue";
import ConnectWallet from "@/components/ConnectWallet.vue";

export default {
  name: "Leaderboard",
  components: {
    NFT,
    ConnectWallet,
  },
  data: function () {
    return {
      leaderBoard: [],
      deadVnfts: [],
      showLeaderboard: true,
      showDeadNfts: false,
    };
  },
  created: function () {
    this.$store.commit("setNetworkCheck", true);

    this.refreshLeaderBoard();
  },
  methods: {
    clickNFT: function (id) {
      this.$router.push({ name: "vNFT", params: { id: id } });
    },
    refreshLeaderBoard: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      let totalNFT = await this.$store.state.vNFTContract.methods
        .totalSupply()
        .call();
      let intTotalNFT = parseInt(totalNFT);
      for (let index = 0; index < intTotalNFT; index++) {
        let element = null;
        try {
          element = await this.$store.state.vNFTContract.methods
            .getVnftInfo(index)
            .call();

          if (element._vNFT && element._isAlive) {
            console.log("alive", element._vNFT);

            this.leaderBoard.push({
              id: element._vNFT,
              score: parseInt(element._score),
            });
          } else if (
            element._vNFT &&
            !element._isAlive &&
            !element._level == 1
          ) {
            console.log("dead", element._vNFT);
            console.log(element._vNFT);
            this.deadVnfts.push({
              id: element._vNFT,
              score: parseInt(element._score),
            });
          }

          this.leaderBoard.sort((a, b) => b.score - a.score);
          this.deadVnfts.sort((a, b) => b.score - a.score);
        } catch (error) {
          intTotalNFT++;
          console.log("Erro");
        }
      }
    },
    toggleLeaderboard: function (tab) {
      if (tab == "leaderboard") {
        this.showLeaderboard = true;
        this.showDeadNfts = false;
      } else {
        this.showLeaderboard = false;
        this.showDeadNfts = true;
      }
    },
  },
  mounted: function () {
    this.$store.commit(
      "setBackgroundVideoUrl",
      "https://player.vimeo.com/video/409572571?background=1"
    );
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  watch: {
    isConnected: function () {
      this.refreshLeaderBoard();
    },
  },
};
</script>
