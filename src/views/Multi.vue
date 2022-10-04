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
      <NFTTools class="cursor-pointer" :nfts="nfts" />
      <div class="flex mb-16 mt-12">
        <button
          class="
            cursor-pointer
            btn
            focus:outline-none
            flex
            items-center
            justify-center
            w-64
          "
          @click="mineAll"
        >
          <img src="@/assets/img/alien.png" class="h-12 px-2" />
          <span class="px-2 inline-block">Mine Selected</span>
        </button>
        <button
          class="
            cursor-pointer
            btn
            focus:outline-none
            flex
            items-center
            justify-center
            w-64
            ml-4
          "
          @click="feedAll"
        >
          <img src="@/assets/img/alien.png" class="h-12 px-2" />
          <span class="px-2 inline-block">Feed Selected</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// @ is an alias to /src
import NFTTools from "@/components/NFTTools.vue";
import PlayHeader from "@/components/PlayHeader.vue";

export default {
  name: "Home",
  components: {
    NFTTools,
    PlayHeader,
  },
  data: function () {
    return {
      nfts: [],
      isLoading: false,
      hasTokenApproval: false,
      nftsCanMine: [],
      gems: [],
      pendingCudl: 0,
    };
  },
  created: function () {},
  methods: {
    fetchNFTS: async function () {
      console.log(this.$store.state.web3 == null, this.isLoading);
      // if (this.$store.state.web3 == null || this.isLoading || this.isLoaded) {
      //   return;
      // }

      // this.$store.state.account = "0x8cd6dce773329fe67f6ea83fc1af52bb8d0af406"; //TODO remove after

      this.isLoading = true;

      console.log(this.$store.state.account);

      let nfts = [];
      const pets = await axios(
        `https://api.nft20.io/cudl/owner/${this.$store.state.account}`
      );

      let calls = [];
      if (pets.data.petsOwned.length > 0) {
        for (let i = 0; i < pets.data.petsOwned.length; i++) {
          calls.push(this.getPetData(pets.data.petsOwned[i]));
        }

        this.nfts = await Promise.all(calls);
      }

      if (pets.data.careTaking.length > 0) {
        for (const pet of pets.data.careTaking) {
          if (pet.nft_contract == this.$store.state.contracts.Mooncats) {
            let a = await this.$store.state.Render.methods
              .render(pet.nft_id)
              .call();

            let getObject = a.substring(27);
            let { image, attributes } = JSON.parse(`${getObject}`);

            pet.image = image;
          } else if (
            pet.nft_contract.toLowerCase() ==
            this.$store.state.contracts.SmolBrain
          ) {
            pet.image = `https://gateway.pinata.cloud/ipfs/QmY71ban6QoWg9nbNwikk6wVWknj8NFBG8nMGHEuzwfAwf/${this.idOrigin}/5.png`;
          }

          this.nfts.push(pet);
        }

        alert("Finished loading pets");
      }

      console.log("LOADED");
      this.isLoading = false;
    },

    checkTokenApproval: async function () {
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Moonpet
            )
            .call()
        ).length >= 18;
    },

    // canMine: function (params) {
    //   alert(params);
    // },
    mineAll: async function () {
      // get array of id's available to mine
      this.nftsCanMine = [];
      for (const nft of this.nfts) {
        const lastTimeMined = new Date(nft.last_time_mined).getTime() / 1000;

        console.log("last time mined", lastTimeMined);

        let nextMining = lastTimeMined + 60 * 60 * 24;
        let currentTime = Math.floor(Date.now() / 1000);

        // console.log(nextMining);
        // console.log(currentTime);

        const canMine = nextMining < currentTime;

        console.log(`canMine ${nft.pet_id}, ${canMine}`);
        // const canMine = true; for tests

        let selectedToMine = document.querySelectorAll("#mine");
        let wantToMineArr = [];
        for (const wantToMine of selectedToMine) {
          if (wantToMine.checked)
            wantToMineArr.push(parseInt(wantToMine.getAttribute("data-id")));
        }

        console.log("mine with", wantToMineArr);

        if (canMine) {
          this.nftsCanMine.push(parseInt(nft.pet_id + ""));
        }

        this.nftsCanMine = this.nftsCanMine.filter((el) =>
          wantToMineArr.includes(el)
        );
      }

      if (this.nftsCanMine.length == 0) {
        alert(`Check at least 1 pet to mine under the "Can Mine" column`);
      } else {
        // uncomment this to mine

        // execute multi mining
        console.log(this.nftsCanMine);
        let multiclaim = await this.$store.state.Moonpet.methods
          .claimMultiple(this.nftsCanMine)
          .send({
            from: this.$store.state.account,
          });
      }
    },
    feedAll: async function () {
      // get all gems
      //@todo add matching ids
      this.gems = [];
      const gemsPicked = document.querySelectorAll(".feed-gem");

      for (const gem of gemsPicked) {
        if (gem.value != "null") {
          let id = gem.getAttribute("data-nftId");
          this.gems.push({ nftId: id, gemId: gem.value });
        }
      }

      await this.checkTokenApproval();
      if (!this.hasTokenApproval) {
        await this.approve();
      }

      let nftIds = [];
      let gemIds = [];
      for (const g of this.gems) {
        nftIds.push(g.nftId);
        gemIds.push(g.gemId);
      }

      console.log("nftIds ", nftIds);
      console.log("gemIds ", gemIds);
      let multiFeed = await this.$store.state.Moonpet.methods
        .feedMultiple(nftIds, gemIds)
        .send({
          from: this.$store.state.account,
        });

      await this.fetchNFTS();
    },
    getPetData: async function (pet) {
      if (pet.nft_contract == this.$store.state.contracts.Mooncats) {
        let a = await this.$store.state.Render.methods
          .render(pet.nft_id)
          .call();

        let getObject = a.substring(27);
        let { image, attributes } = JSON.parse(`${getObject}`);

        pet.image = image;
      } else if (
        pet.nft_contract.toLowerCase() == this.$store.state.contracts.SmolBrain
      ) {
        this.image = `https://gateway.pinata.cloud/ipfs/QmY71ban6QoWg9nbNwikk6wVWknj8NFBG8nMGHEuzwfAwf/${pet.pet_id}/5.png`;
      }
      return pet;
    },
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
  beforeMount: function () {
    this.init();
  },
  watch: {
    isConnected: function () {
      this.fetchNFTS();
    },
  },
  created: function () {
    //setTimeout(() => (this.tooslVisible = true), 4000);
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
};
</script>
