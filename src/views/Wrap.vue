<template>
  <div>
    <div
      class="wrap bg-white mt-12 px-8 border-4 border-black boxShadow"
      v-if="isConnected"
    >
      <div
        class="
          text-xl
          md:text-xl
          text-center
          mt-16
          px-4
          md:px-0
          tracking-wide
          leading-lose
        "
      >
        <p class="md:text-4xl font-bold uppercase txtShadow">
          Wrap supported NFTs to start mining $CUDL
        </p>

        <p class="mt-2">
          You'll need to burn <span class="text-red-700">200 $CUDL</span> to
          wrap your NFT, you can buy $CUDL on
          <a
            href="https://app.uniswap.org/#/swap?inputCurrency=0xb6ca7399b4f9ca56fc27cbff44f4d2e4eef1fc81&outputCurrency=ETH"
            target="_blank"
            class="text-red-700"
          >
            Uniswap
          </a>
        </p>
        <p class="text-lg md:text-lg mt-2">
          <span class="text-red-700">Disclaimer:</span> If you don't buy any
          gems for your vNFT and it dies, you'll lose your original NFT forever
          and won't be able to unwrap it.
        </p>
        <p class="text-lg md:text-lg">
          You can always unwrap it back to your original NFT before it dies to
          exit the game.
        </p>
      </div>
      <div
        class="
          flex
          md:flex-row
          flex-col
          md:-mx-3
          mt-12
          flex-wrap
          items-center
          justify-center
          md:justify-start
        "
      >
        <div class="p-3 w-2/3 md:w-1/4" v-for="nft in nftsToWrap">
          <div
            class="
              rounded
              flex
              justify-center
              items-center
              border-2
              p-4
              border-gray-900
              flex-col
              shadow-xl
              bg-white bg-opacity-25
            "
          >
            <img
              :src="nft.image"
              alt="Person"
              class="object-contain mb-6"
              style="height: 320px"
            />
            <p class="mb-6 text-center">{{ nft.name }}</p>

            <button
              class="
                border-2 border-gray-900
                bg-gray-900 bg-opacity-100
                hover:text-gray-900
                hover:bg-white
                text-white
                py-2
                px-3
                mt-6
                text-md
              "
              @click.stop="
                giveLife(nft.idOrigin, nft.contractName, nft.approval)
              "
            >
              <span v-if="!hasTokenApproval || !nft.approval"
                >Approve & Wrap</span
              >
              <span v-else>Wrap</span>
            </button>
          </div>
        </div>
        <div
          class="p-3 w-2/3 md:w-1/4 cursor-pointer"
          v-for="nft in nftsToUnwrap"
          @click="onNFTClick(nft.id)"
        >
          <div
            class="
              rounded
              flex
              justify-center
              items-center
              border-2
              p-4
              border-gray-900
              flex-col
              shadow-xl
              bg-white bg-opacity-25
            "
          >
            <img
              :src="`https://gallery.verynifty.io/api/image/${nft.id}.svg`"
              alt="Person"
              class="object-contain mb-6"
              style="height: 320px"
            />
            <p class="mb-6 text-center">#{{ nft.id }}</p>

            <button
              class="
                border-2 border-gray-900
                bg-gray-900 bg-opacity-100
                hover:text-gray-900
                hover:bg-white
                text-white
                py-2
                px-3
                mt-6
                text-md
              "
              @click.stop="unwrap(nft.id)"
            >
              Unwrap
            </button>
          </div>
        </div>
      </div>
    </div>
    <ConnectWallet />
  </div>
</template>

<script>
// @ is an alias to /src
import NFTList from "@/components/NFTList.vue";
import ConnectWallet from "@/components/ConnectWallet.vue";
export default {
  name: "Wrap",
  components: {
    NFTList,
    ConnectWallet,
  },
  data: function () {
    return {
      nftsToWrap: [],
      nftsToUnwrap: [],
      hasTokenApproval: false,
      hasNftApproval: false,
      hasChonkApproval: false,
    };
  },
  mounted: async function () {
    this.getData();
  },
  created: function () {},
  methods: {
    getData: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      const account = this.$store.state.account;
      // const account = "0x6ecee8813775cd158f5b1f7ab14f5d0d053d13fd";
      const MEME = this.$store.state.contracts.MEME;
      const Chonker = this.$store.state.contracts.Chonker;
      const MemeFactory = this.$store.state.contracts.MemeFactory;
      const Doki = this.$store.state.contracts.Doki;
      const Doki2 = this.$store.state.contracts.Doki2;
      const Sergs = this.$store.state.contracts.Sergs;

      const call = `https://api.opensea.io/api/v1/assets?owner=${account}&asset_contract_addresses=${MEME}&asset_contract_addresses=${Chonker}&asset_contract_addresses=${Doki}&asset_contract_addresses=${Sergs}&asset_contract_addresses=${Doki2}&asset_contract_addresses=${MemeFactory}&order_direction=desc&offset=0&limit=50`;

      let nftsToWrap = await axios.get(call);
      nftsToWrap = nftsToWrap.data.assets;

      for (const nft of nftsToWrap) {
        const isApproved = await this.nftApproval(nft.asset_contract.name);
        console.log(nft.asset_contract.name);
        const thisNft = {
          image: nft.image_original_url,
          name: nft.name,
          contractName: nft.asset_contract.name,
          idOrigin: nft.token_id,
          contractOriign: nft.asset_contract.address,
          approval: isApproved,
        };
        this.nftsToWrap.push(thisNft);
      }

      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.vNFT
            )
            .call()
        ).length >= 18;
      this.hasNftApproval = await this.$store.state.MemeContract.methods
        .isApprovedForAll(
          this.$store.state.account,
          this.$store.state.contracts.vNFT
        )
        .call();
    },
    giveLife: async function (id, name, nftApproved) {
      if (this.$store.state.web3 == null) {
        return;
      }

      if (!this.hasTokenApproval) {
        await this.approve();
      }
      if (!nftApproved) {
        await this.approveNft(name);
      }

      // this is to get array for the contract
      let approvedNftId;

      if (name == "ChonkNFT") {
        approvedNftId = 1;
      } else if (name == "Meme Factory") {
        approvedNftId = 5;
      } else if (name == "Doki Doki Finance") {
        approvedNftId = 2;
      } else if (name == "Meme Ltd.") {
        approvedNftId = 0;
      } else if (name == "Unidentified contract") {
        approvedNftId = 3;
      } else if (name == "dokidoki.momiji") {
        approvedNftId = 4;
      }

      let giveLife = await this.$store.state.vNFTContract.methods
        .giveLife(approvedNftId, id, 1155)
        .send({
          from: this.$store.state.account,
        });

      this.getData();
    },
    nftApproval: async function (name) {
      console.log(name);
      if (name == "ChonkNFT") {
        console.log(name);

        return await this.$store.state.ChonkerContract.methods
          .isApprovedForAll(
            this.$store.state.account,
            this.$store.state.contracts.vNFT
          )
          .call();
      } else if (name == "Meme Factory") {
        return await this.$store.state.MemeFactoryContract.methods
          .isApprovedForAll(
            this.$store.state.account,
            this.$store.state.contracts.vNFT
          )
          .call();
      } else if (name == "Doki Doki Finance") {
        return await this.$store.state.DokiContract.methods
          .isApprovedForAll(
            this.$store.state.account,
            this.$store.state.contracts.vNFT
          )
          .call();
      } else if (name == "Meme Ltd.") {
        return await this.$store.state.MemeContract.methods
          .isApprovedForAll(
            this.$store.state.account,
            this.$store.state.contracts.vNFT
          )
          .call();
      } else if (name == "Unidentified contract") {
        return await this.$store.state.SergsContract.methods
          .isApprovedForAll(
            this.$store.state.account,
            this.$store.state.contracts.vNFT
          )
          .call();
      } else if (name == "dokidoki.momiji") {
        return await this.$store.state.Doki2Contract.methods
          .isApprovedForAll(
            this.$store.state.account,
            this.$store.state.contracts.vNFT
          )
          .call();
      }
    },
    unwrap: async function (id) {
      if (this.$store.state.web3 == null) {
        return;
      }

      let unwrap = await this.$store.state.vNFTContract.methods
        .unwrap(id)
        .send({
          from: this.$store.state.account,
        });
    },
    fetchNFTS: async function () {
      if (this.$store.state.web3 == null) {
        return;
      }
      console.log(this.$store.state.account);
      this.listSize = await this.$store.state.vNFTContract.methods
        .balanceOf(this.$store.state.account)
        .call();
      let tokens = [];
      for (let index = 0; index < this.listSize; index++) {
        console.log(index);
        let id = await this.$store.state.vNFTContract.methods
          .tokenOfOwnerByIndex(this.$store.state.account, index)
          .call();
        const nftInfo = await await this.$store.state.vNFTContract.methods
          .getVnftInfo(id)
          .call();
        if (nftInfo._token != this.$store.state.contracts.vNFT) {
          tokens.push({
            id: id,
            contract: this.$store.state.account.toLowerCase(),
          });
        }
      }
      this.nftsToUnwrap = tokens;
    },
    onNFTClick: function (id) {
      this.$router.push({ name: "vNFT", params: { id: id } });
    },
    approveNft: async function (name) {
      if (name == "ChonkNFT") {
        let minetx = await this.$store.state.ChonkerContract.methods
          .setApprovalForAll(this.$store.state.contracts.vNFT, true)
          .send({
            from: this.$store.state.account,
          });
      } else if (name == "Meme Factory") {
        let minetx = await this.$store.state.MemeFactoryContract.methods
          .setApprovalForAll(this.$store.state.contracts.vNFT, true)
          .send({
            from: this.$store.state.account,
          });
      } else if (name == "Doki Doki Finance") {
        let minetx = await this.$store.state.DokiContract.methods
          .setApprovalForAll(this.$store.state.contracts.vNFT, true)
          .send({
            from: this.$store.state.account,
          });
      } else if (name == "dokidoki.momiji") {
        let minetx = await this.$store.state.Doki2Contract.methods
          .setApprovalForAll(this.$store.state.contracts.vNFT, true)
          .send({
            from: this.$store.state.account,
          });
      } else {
        let minetx = await this.$store.state.MemeContract.methods
          .setApprovalForAll(this.$store.state.contracts.vNFT, true)
          .send({
            from: this.$store.state.account,
          });
      }
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let minetx = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.vNFT, max)
        .send({
          from: this.$store.state.account,
        });

      this.fetchvNFTInfo();
    },
  },
  beforeMount: function () {
    this.fetchNFTS();
  },
  watch: {
    isConnected: function () {
      this.fetchNFTS();
      this.getData();
    },
  },
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
};
</script>
