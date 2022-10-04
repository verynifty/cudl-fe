import Vue from "vue";
import Vuex from "vuex";

import Contracts from "@/assets/contracts";
import ERC721ABI from "@/assets/ABIS/ERC721";
import ERC20ABI from "@/assets/ABIS/ERC20";

import MultiVnftAbi from "@/assets/ABIS/MultiVnft";
import NFTRaceAbi from "@/assets/ABIS/NFTRace";

import StakeForPointsAbi from "@/assets/ABIS/StakeForPoints";

import vNFTABI from "@/assets/ABIS/vNFT";
import NiftyAddonsABI from "@/assets/ABIS/NiftyAddons";

import CudlABI from "@/assets/ABIS/CUDL";
import MoonpetABI from "@/assets/ABIS/Moonpet";

import LotteryAbi from "@/assets/ABIS/Lottery";
import RenderAbi from "@/assets/ABIS/Render";

import MasterChefAbi from "@/assets/ABIS/MasterChef";
import DistributePetsAbi from "@/assets/ABIS/DistributePets";
import BazaarAbi from "@/assets/ABIS/Bazaar";
import MiniChefAbi from "@/assets/ABIS/MiniChef";
import WeaponsAbi from "@/assets/ABIS/Weapons";

import OldCudlABI from "@/assets/ABIS/OldCudl";
import Web3 from "web3";
import Notify from "bnc-notify";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    web3: null,
    vNFTContract: null,
    AirdropperContract: null,
    MuseTokenContract: null,
    LotteryContract: null,
    contracts: {},
    account: null,
    notify: null,
    Bazaar: null,
    Render: null,
    correctNetwork: null,
    checkNetwork: true,
    OldCudl: null,
    MiniChef: null,
    Milk: null,
    CudlMainnet: null,
    ERC721: null,
  },
  mutations: {
    setNetworkCheck: async function(state, ok) {
      state.checkNetwork = ok;
    },
    setWeb3: async function(state, web3, vueInstance) {
      // Blocknative stuff

      state.notify = Notify({
        dappId: "6aeed7c3-de53-4a11-813b-69b4200c72e6", // [String] The API key created by step one above
        networkId: 1, //mainnet is 1
        darkMode: true,
      });

      state.contracts = Contracts;
      state.vNFTContract = new web3.eth.Contract(vNFTABI, Contracts.vNFT);
      state.Mooncat = new web3.eth.Contract(ERC721ABI, Contracts.Mooncats);
      let chainId = await web3.eth.getChainId();
      console.log("CHAIIIN ID", chainId);
      if (chainId == 42161) {
        state.correctNetwork = "arbitrum";
      } else {
        state.correctNetwork = "WRONG";
      }

      state.Render = new web3.eth.Contract(RenderAbi, Contracts.Render);
      state.DistributePets = new web3.eth.Contract(
        DistributePetsAbi,
        Contracts.DistributePets
      );

      state.MiniChef = new web3.eth.Contract(MiniChefAbi, Contracts.MiniChef);

      state.MiniChefCudl = new web3.eth.Contract(
        MiniChefAbi,
        Contracts.MiniChefCudl
      );

      state.Weapons = new web3.eth.Contract(WeaponsAbi, Contracts.Weapons);

      state.MuseTokenContract = new web3.eth.Contract(
        ERC20ABI,
        Contracts.MuseToken
      );

      state.CUDL = new web3.eth.Contract(CudlABI, Contracts.CUDL);
      state.CudlMainnet = new web3.eth.Contract(CudlABI, Contracts.CUDLMiannet);

      state.Milk = new web3.eth.Contract(CudlABI, Contracts.Milk);

      state.Moonpet = new web3.eth.Contract(MoonpetABI, Contracts.Moonpet);
      state.Bazaar = new web3.eth.Contract(BazaarAbi, Contracts.Bazaar);
      state.OldCudl = new web3.eth.Contract(
        OldCudlABI,
        "0x9c10aed865b63f0a789ae64041581eac63458209"
      );

      state.MultiVnftContract = new web3.eth.Contract(
        MultiVnftAbi,
        Contracts.MultiVnft
      );

      state.NiftyAddonsContract = new web3.eth.Contract(
        NiftyAddonsABI,
        Contracts.NiftyAddons
      );

      state.NFTRace = new web3.eth.Contract(NFTRaceAbi, Contracts.NFTRace);

      state.MasterChefContract = new web3.eth.Contract(
        MasterChefAbi,
        Contracts.MasterChef
      );

      state.LotteryContract = new web3.eth.Contract(
        LotteryAbi,
        Contracts.Lottery
      );

      state.OldMilk = new web3.eth.Contract(
        StakeForPointsAbi,
        "0xabbe7a3674467d758ef7c03af95061a18e4f85e8"
      );

      state.UniCudlEth = new web3.eth.Contract(ERC20ABI, Contracts.UniCudlEth);

      state.ERC20 = async (contract) => {
        return new web3.eth.Contract(ERC20ABI, contract);
      };

      state.ERC721 = async (contract) => {
        return new web3.eth.Contract(ERC721ABI, contract);
      };

      state.account = (await web3.eth.getAccounts())[0];
      state.web3 = web3;

      console.log("set Web3");
    },
  },
  actions: {
    connectWallet: async function(context, vue) {
      const provider = await vue.$web3Modal.connect();
      const web3 = new Web3(provider);
      context.commit("setWeb3", web3, vue);

      provider.on("accountsChanged", (accounts) => {
        context.dispatch("connectWallet", vue);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        context.dispatch("connectWallet", vue);
      });

      // Subscribe to provider disconnection
      provider.on("disconnect", (error) => {
        context.dispatch("connectWallet", vue);
      });
    },
  },
  modules: {},
});
