<template>
  <div class="home">
    <div class="text-xl md:text-4xl text-center mt-16 px-4 md:px-0 text-white">
      <span class="text-4xl font-bold uppercase txtShadow2 animate-pulse"
        >Leaderboard</span
      >
      <p class="md:text-xl text-lg">
        If a Pet starved you'll see a grumpy cat by his position. You can claim
        20% of it's points by being the first that clicks on the grumpy cat
      </p>
      <p
        class="
          m-5
          animate-pulse
          md:text-xl
          text-red
          border-dark border
          px-2
          hidden
        "
      >
        Warning this page is in test! Data may not be exact! Please report on
        Discord any bugs ;)
      </p>
    </div>
    <div
      class="
        flex
        w-full
        md:flex-row
        flex-col
        items-center
        justify-center
        md:justify-between md:-mx-3
      "
    >
      <div class="mt-8 flex px-3 items-center text-white">
        <div
          class="cursor-pointer border-white rounded-none"
          @click="toggleLeaderboard('leaderboard')"
          :class="{ 'border-b-4': showLeaderboard }"
        >
          Leaderboard
        </div>
        <div
          class="ml-6 cursor-pointer border-white rounded-none"
          @click="toggleLeaderboard"
          :class="{ 'border-b-4': showDeadNfts }"
        >
          Grumpy Pets
        </div>
      </div>

      <!-- <div class="mt-8 flex cursor-pointer rounded">
        <t-select
          :options="types"
          v-model="type"
          class="border-dark border rounded px-2 focus:outline-none mr-6"
        />
        <div
          :class="{ ' border-gray-900 border-b-4': showTable }"
          @click="toggleTable"
        >
          <img :src="require('../assets/img/list.svg')" class="h-6" />
        </div>
      </div> -->
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
      <div class="w-full" v-if="showTable && showLeaderboard">
        <table class="table-auto w-full border border-gray-900">
          <thead>
            <tr>
              <th class="px-4 py-2">Position</th>

              <th class="px-4 py-2">Image</th>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Score</th>
              <th class="px-4 py-2">Level</th>
            </tr>
          </thead>
          <tbody
            class="border border-gray-900"
            v-for="(nft, index) in leaderBoard"
            :key="nft.id"
            v-on:click="clickNFT(nft.id)"
          >
            <NFT
              :contract="nft.contract"
              :id="nft.id"
              :position="index + 1"
              :leaderboard="true"
              :table="true"
              :nft="nft"
            />
          </tbody>
        </table>
      </div>
      <div
        v-if="showLeaderboard && !showTable"
        class="md:w-1/4 w-4/5 p-3"
        v-for="(nft, index) in _leaderboard"
        :key="nft.id"
        v-on:click="clickNFT(nft.id != null ? nft.id : nft.pet_id)"
      >
        <NFT
          :contract="nft.contract"
          :id="nft.id"
          :nft="nft"
          :position="index + 1"
          :leaderboard="true"
        />
      </div>
      <!--
      <t-pagination
        v-if="showLeaderboard"
        :total-items="totalRecords"
        :per-page="perPage"
        v-model="page"
        class="mt-16 w-4/5 h-16"
      />
      -->

      <div
        v-if="!showLeaderboard"
        class="md:w-1/4 w-4/5 p-3"
        v-for="(nft, index) in deadPets"
        :key="nft.id"
        v-on:click="clickNFT(nft.id != null ? nft.id : nft.pet_id)"
      >
        <NFT
          :contract="nft.contract"
          :id="nft.id"
          :nft="nft"
          :position="index + 1"
          :leaderboard="true"
        />
      </div>
      <div class="text-xl mt-8" v-if="isLoading">
        Querying the blockchain. If this keeps showing for over 6 minutes, no
        sad Pets were found.
      </div>
    </div>
    <!--<p class="mt-8 text-center text-sm text-white">
      This page is using data from our API. You don't have to trust us on data
      and can use the
      <router-link class="underline" to="/leaderboard2"
        >simple gallery</router-link
      >.
    </p> -->
  </div>
</template>

<script>
// @ is an alias to /src
import NFT from "@/components/NFT.vue";
const axios = require("axios").default;

export default {
  name: "Leaderboard",
  components: {
    NFT,
  },
  data: function () {
    return {
      leaderBoard: [],
      deadPets: [],
      showLeaderboard: true,
      showTable: false,
      showDeadNfts: false,
      page: 1,
      isLoading: false,
      perPage: 0,
      totalRecords: 0,
      type: "all",
      types: {
        all: "All",
        "57f0b53926dd62f2e26bc40b30140abea474da94": "vNFT",
        e4605d46fd0b3f8329d936a8b258d69276cba264: "Meme Ltd",
      },
    };
  },
  created: function () {
    this.refreshLeaderBoard();
  },
  methods: {
    changePage: function (pageInfo) {
      console.log(pageInfo);
    },
    clickNFT: function (id) {
      this.$router.push({ name: "vNFT", params: { id: id } });
    },
    refreshLeaderBoard: async function () {
      if (!this.isConnected || this.isLoading) {
        return;
      }
      this.isLoading = true;

      const result = await axios.get(`https://api.nft20.io/cudl/leaderboard`);

      console.log(result);
      this.leaderBoard = result.data.leaderboard;
      this.deadPets = result.data.grumpy;

      // return;
      /*
      this.totalRecords = result.data.pagination.total;
      this.perPage = result.data.pagination.perPage;
      this.leaderBoard = [];
      while (this.leaderBoard.length > 0) {
        this.leaderBoard.pop();
      }
      for (const nft of result.data.data) {
        this.leaderBoard.push(nft);
      }
      const deathresult = await axios.get(
        `https://gallery.verynifty.io/api/leaderboard/starving?type=${this.type}`
      );
      while (this.deadVnfts.length > 0) {
        this.deadVnfts.pop();
      }
      for (const nft of deathresult.data) {
        this.deadVnfts.push(nft);
      } */

      // this.leaderBoard = [];
      // this.deadVnfts = [];
      // let index = 0;
      // let failInARow = 0;
      // while (failInARow < 5) {
      //   console.log("FETCH PET", index);
      //   try {
      //     let pet = await this.$store.state.Moonpet.methods
      //       .getPetInfo(index)
      //       .call();
      //     pet.id = parseInt(pet._pet);
      //     if (pet._isStarving && pet._isAlive) {
      //       this.deadPets.push(pet);
      //     } else {
      //       this.leaderBoard.push(pet);
      //     }
      //     console.log("adding", pet);
      //   } catch (error) {
      //     console.log(error);
      //     console.log("pet ", index);
      //     failInARow++;
      //     index++;
      //     continue;
      //   }
      //   failInARow = 0;
      //   index++;
      // }
      this.isLoading = false;
    },
    toggleLeaderboard: function (tab) {
      if (tab == "leaderboard") {
        this.showLeaderboard = true;
        this.showDeadNfts = false;

        document.body.className = document.body.className.replace(
          "deathvalley",
          "body"
        );
      } else {
        this.showLeaderboard = false;
        this.showDeadNfts = true;
        document.body.className = document.body.className.replace(
          "body",
          "deathvalley"
        );
      }
    },
    toggleTable: function () {
      this.showTable = !this.showTable;
    },
  },
  beforeMount: function () {
    this.refreshLeaderBoard();
  },
  beforeDestroy: function () {
    document.body.className = document.body.className.replace(
      "deathvalley",
      "body"
    );
  },
  mounted: function () {},
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
    _leaderboard: function () {
      return this.leaderBoard.sort(function (b, a) {
        console.log(a, b);
        return parseInt(a._score) - parseInt(b._score);
      });
    },
  },
  watch: {
    page: function () {
      this.refreshLeaderBoard();
    },
    type: function () {
      this.refreshLeaderBoard();
    },
    isConnected: function () {
      this.refreshLeaderBoard();
    },
  },
};
</script>
