import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/tailwind.css";
import "./assets/css/theme.scss";
import "./assets/css/style.css";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import vueMoment from "vue-moment";
// import VueTailwind from "vue-tailwind";

import vueAwesomeCountdown from "vue-awesome-countdown";
import Notifications from "vue-notification";
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
import Pagination from "vue-pagination-2";
import VueConfetti from "vue-confetti";
import VueObserveVisibility from "vue-observe-visibility";

// import axios from "axios";
// import VueAxios from "vue-axios";

import VTooltip from "v-tooltip";
import hotkey from "@undecaf/vue-hotkey";

// const settings = {
//   //...
// };

// Vue.use(VueTailwind, settings);
Vue.use(VueObserveVisibility);

Vue.component("pagination", Pagination);

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "412acf21edf5444a8c9f6bd737cf8ca3", // required
    },
  },
};

const web3Modal = new Web3Modal({
  network: "rinkeby", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

(async function() {
  Vue.prototype.$web3Modal = web3Modal;
  Vue.use(vueMoment);
  Vue.use(VTooltip);
  Vue.use(vueAwesomeCountdown, "vac");
  Vue.use(Notifications);
  Vue.use(Loading);
  Vue.use(VueConfetti);
  Vue.use(hotkey);

  // Vue.use(VueAxios, axios);

  Vue.config.productionTip = false;

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
})();
