import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import vNFT from "../views/vNFT.vue";
import Mint from "../views/Mint.vue";
import Wrap from "../views/Wrap.vue";
import About from "../views/About.vue";
import CareTaker from "../views/CareTaker.vue";
import Leaderboard from "../views/Leaderboard.vue";
import Leaderboard2 from "../views/Leaderboard2.vue";
import Leaderboard3 from "../views/Leaderboard3.vue";

import ClaimAirdrop from "../views/ClaimAirdrop.vue";
import Branding from "../views/Branding.vue";
import Calculator from "../views/Calculator.vue";
import Killerboard from "../views/Killerboard.vue";
import Race from "../views/Race.vue";
import ClaimTokens from "../views/ClaimTokens.vue";
import Faqs from "../views/Faqs.vue";
import Farm from "../views/Farm.vue";
import Animals from "../views/Animals.vue";
import Lottery from "../views/Lottery.vue";
import Bazaar from "../views/Bazaar.vue";
import Dead from "../views/Dead.vue";
import Airdrop from "../views/Airdrop.vue";
import Milk from "../views/Milk.vue";
import Multi from "../views/Multi.vue";
import Transfer from "../views/Transfer.vue";
import ClaimOldBalances from "../views/Old.vue";
import Bridge from "../views/Bridge.vue";
import BridgeWeapons from "../views/BridgeWeapons.vue";
import Move from "../views/Move.vue";

import Render from "../views/Render.vue";
import Weapons from "../views/Weapons.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/play",
    name: "Play",
    component: Home,
  },
  {
    path: "/weapons",
    name: "Weapons",
    component: Weapons,
  },

  {
    path: "/dead",
    name: "Dead",
    component: Dead,
  },
  {
    path: "/gift",
    name: "Move",
    component: Move,
  },
  {
    path: "/bridge",
    name: "Bridge",
    component: Bridge,
  },
  // {
  //   path: "/bridge-weapons",
  //   name: "BridgeWeapons",
  //   component: BridgeWeapons,
  // },
  {
    path: "/animals",
    name: "Animals",
    component: Animals,
  },
  {
    path: "/claim-old",
    name: "ClaimOldBalances",
    component: ClaimOldBalances,
  },
  {
    path: "/render",
    name: "Render",
    component: Render,
  },
  {
    path: "/milk",
    name: "Milk",
    component: Milk,
  },
  {
    path: "/bazaar",
    name: "Bazaar",
    component: Bazaar,
  },
  {
    path: "/multi",
    name: "Multi",
    component: Multi,
  },
  {
    path: "/lottery",
    name: "Lottery",
    component: Lottery,
  },
  {
    path: "/faqs",
    name: "Faqs",
    component: Faqs,
  },
  {
    path: "/farm",
    name: "Farm",
    component: Farm,
  },
  {
    path: "/",
    name: "About",
    component: About,
  },

  {
    path: "/mintold",
    name: "Mint",
    component: Mint,
  },
  {
    path: "/transfer",
    name: "Transfer",
    component: Transfer,
  },
  {
    path: "/wrap",
    name: "Wrap",
    component: Wrap,
  },

  {
    path: "/leaderboard3",
    name: "Leaderboard",
    component: Leaderboard2,
  },
  {
    path: "/leaderboard2",
    name: "Leaderboard2",
    component: Leaderboard,
  },
  {
    path: "/leaderboard",
    name: "Leaderboard3",
    component: Leaderboard3,
  },
  {
    path: "/care-taker",
    name: "Care Taker",
    component: CareTaker,
  },
  {
    path: "/claim-tokens",
    name: "Claim Tokens",
    component: ClaimTokens,
  },
  {
    path: "/branding",
    name: "Branding",
    component: Branding,
  },
  {
    path: "/calc",
    name: "Calculator",
    component: Calculator,
  },
  {
    path: "/killerboard",
    name: "Killerboard",
    component: Killerboard,
  },
  {
    path: "/race",
    name: "race",
    component: Race,
  },

  {
    path: "/nft/:id",
    name: "vNFT",
    component: vNFT,
  },
  {
    path: "/airdrop",
    name: "Airdrop",
    component: Airdrop,
  },
  {
    path: "/claim/:id/:key",
    name: "Claim",
    component: ClaimAirdrop,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
