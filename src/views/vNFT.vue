<template>
  <div class="vnft">
    <div v-if="isConnected && isLoaded">
      <div class="container m-auto text-white">
        <div
          class="
            flex flex-col
            justify-center
            md:flex-row
            md:justify-between
            items-center
            mt-4
          "
        >
          <div class="w-full md:w-auto mb-6">
            <div
              class="
                flex
                items-center
                md:justify-start
                md:ml-2
                justify-center
                w-full
                space-x-6
                text-sm
                border-4 border-black
                pl-3
                pt-3
                bg-yellow-400
                text-black
                boxShadow
              "
            >
              <div class="uppercase font-bold">
                <span class="">Score: </span>
                <span>{{ score }}</span>
              </div>

              <div class="uppercase font-bold">
                <span class="">Bonkable: </span>
                <span>{{ bonkedStats }}</span>
              </div>
              <div class="uppercase font-bold">
                <span class="">Mines: </span>
                <Number class="" decimals="18" :number="expectedReward" /> $CUDL</span>
              </div>
              <div class="flex items-center hidden" v-if="isOwner">
                <img
                  class="h-6 cursor-pointer -mt-3 -ml-1"
                  src="@/assets/img/icons/shopping-tag.svg"
                  v-show="!showField('description')"
                  @click="focusField('description')"
                />
                <span>
                  <textarea
                    v-model="description"
                    v-show="showField('description')"
                    id="description"
                    type="text"
                    class="
                      field-value
                      form-control
                      border-dark border
                      p-4
                      ml-4
                      mb-2
                    "
                    maxlength="140"
                    @focus="focusField('description')"
                    @blur="blurField('description')"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center md:my-0 my-6">
            <div class="text-center text-xl txtShadow4">
              TOD:
              <span v-if="!isStarving" class="text-red-600">
                <countdown :end-time="timeUntilStarving * 1000">
                  <template v-slot:process="mine">
                    <span>
                      {{
                        `${mine.timeObj.d} days & ${mine.timeObj.h}:${mine.timeObj.m}:${mine.timeObj.s}`
                      }}
                    </span>
                  </template>
                </countdown>
              </span>
              <span v-else class="text-red-600">Dead</span>
            </div>
          </div>
        </div>
        <div
          class="
            flex
            md:flex-row
            flex-col
            justify-end
            items-center
            md:items-center
            md:-mx-3
            md:justify-between
            mt-8
            md:mt-0
            mb-10
          "
        >
          <div class="w-full md:w-1/3">
            <div
              class="
                w-full
                mb-2
                md:mb-0
                flex
                items-start
                justify-center
                space-x-4
              "
            >
              <div
                v-if="isOwner || isCareTaker"
                class="
                  w-full
                  md:w-full
                  flex
                  justify-center
                  pt-4
                  mb-6
                  md:mb-0
              
                "
              >
                <!-- battle -->
                <div class="flex flex-col items-center text-white">
                  <div v-for="attr, i  in attributes" :key="i" class="flex space-x-2">
                    <div>
                      {{attr.trait_type}}:  
                    </div>
                    <div>
                      {{attr.value}}
                    </div>
                  </div>
                  
                  <!-- <div class="" id="bonk">
                    <img
                      src="@/assets/img/addons/bonk.svg"
                      alt=""
                      class="h-12 w-10 cursor-pointer"
                      @click="battle"
                    />
                  </div> -->
               
                </div>
              </div>
            </div>
          </div>
          <div class="relative md:w-1/3 px-3">
            <div class="w-full text-center text-2xl">
              <div
                v-if="!isOwner"
                class="flex flex-col items-center justify-center mb-4"
              >
                <!-- <div class="m-0 m-auto pb-4" v-if="!isOwner && isForSale">
                  <a
                    :href="`https://opensea.io/assets/0x57f0b53926dd62f2e26bc40b30140abea474da94/${id}`"
                    @click.stop
                    title="Buy on OpenSea"
                    target="_blank"
                  >
                    <img
                      style="
                        width: 160px;
                        border-radius: 5px;
                        box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
                      "
                      src="https://storage.googleapis.com/opensea-static/opensea-brand/buy-button-blue.png"
                      alt="Buy on OpenSea badge"
                    />
                  </a>
                </div> -->
                <h2 class="txtShadow2 font-normal">PET ID #{{ id }}</h2>
                <h2 class="text-xl">
                  Owned by
                  <Address :address="owner" />
                </h2>
              </div>
              <div v-if="isOwner || isCareTaker" class=""></div>
            </div>
            <div
              class="
                rounded-none
                flex
                justify-center
                items-center
                border-4
                p-4
                pt-8
                border-black
                flex-col
                shadow-xl
                bg-white bg-opacity-100
                text-black
                boxShadow
              "
            >
              <div class="flex w-full justify-center items-center">
                <div class="text-3xl"></div>

                <div
                  v-if="isStarving"
                  class="text-3xl cursor-pointer -mt-3"
                  @click.stop="fatality"
                >
                  <img
                    src="@/assets/img/icons/grumpy1.png"
                    class="h-10"
                    alt=""
                  />
                </div>
                <div v-else class="text-3xl cursor-pointer -mt-3">
                

                  <div class="text-center text-md">
                    {{addPositionSuffix(ranking)}}
                  </div>
                    <img
                    :src="statusImg"
                    class="h-24"
                    alt=""
                  />

                </div>
              </div>
                <div class="mb-4">

                    <SpeechBubble />
                    </div>
              <div class="flip-box">
                <div class="flip-box-inner">
                  <div class="flip-box-front relative">
                  
                    <img
                      id="dropzone"
                      :src="image"
                      alt="Person"
                      :class="{ shake: inBattle }"
                      class="object-contain mb-6"
                      style="height: 220px; width: 320px"
                    />
                    <span class="" :class="{ drop: inBattle }"></span>
                    <span :class="{ drop: inBattle }"></span>
                    <span :class="{ drop: inBattle }"></span>
                    <span :class="{ drop: inBattle }"></span>
                    <span :class="{ drop: inBattle }"></span>
                  </div>

                  <div class="flip-box-back" id="dropzone2">
                    <p class="text-xl leading-normal">
                      Gives you {{ currentGem.score }} score and resets TOD to
                      {{ currentGem.days }} days.
                    </p>
                  </div>
                </div>
              </div>

              <p class="my-6 text-lg text-center flex flex-col">
                <span class="text-2xl font-bold txtShadow"
                  >PET ID #{{ id }}</span
                                  <span class="text-2xl font-bold txtShadow"
                  >{{name}}</span
                >
               <!-- <span v-if="isOwner">
                  <!-- <span
                    class="field-value block"
                    v-show="!showField('name')"
                    @click="focusField('name')"
                    >{{ name }}</span
                  > 
                  <input
                    v-model="name"
                    v-show="showField('name')"
                    id="name"
                    type="text"
                    class="field-value form-control"
                    @focus="focusField('name')"
                    @blur="blurField('name')"
                  />
                </span>
                <!-- <span v-else>{{ name }}</span> -->
              </p>
              <div class="flex -mx-3 text-base mb-4">
                <div class="px-3 text-center uppercase font-bold">
                  Level:
                  <span>{{ level }}</span>
                </div>
                <!-- <div class="px-3 text-center">
                  Score
                  <span>{{ score }}</span>
                </div>-->
              </div>
              <div class="flex -mx-3">
                <div class="px-3 text-center text-base">
                  Time till next reward:
                  <span v-if="!isStarving">
                    <countdown
                      :end-time="(lastTimeMined + 60 * 60 * 24) * 1000"
                    >
                      <template v-slot:process="mine">
                        <span>
                          {{
                            `${mine.timeObj.h}:${mine.timeObj.m}:${mine.timeObj.s}`
                          }}
                        </span>
                      </template>
                      <template v-slot:finish>
                        <span>Now!</span>
                      </template>
                    </countdown>
                  </span>
                  <span v-else>Dead</span>
                </div>
                <!-- <div class="px-3 text-center">
                  Time Of Death (TOD)
                  <span v-if="isVnftAlive">
                    <vac :end-time="timeUntilStarving * 1000">
                      <span slot="process" slot-scope="{ timeObj }">
                        {{
                          `${timeObj.d} days and ${timeObj.h}:${timeObj.m}:${timeObj.s}`
                        }}
                      </span>
                      <span slot="finish">Dead!</span>
                    </vac>
                  </span>
                  <span v-else>Dead</span>
                </div>-->
              </div>
              <div class="w-2/3 m-4 text-center">
                <button
                  v-if="
                    (isOwner || isCareTaker) && !canMine && hasTokenApproval
                  "
                  type="button"
                  disabled
                  class="cursor-not-allowed px-3 mt-4 text-md btn"
                >
                  Can't mine yet
                </button>
                <a
                  v-if="(isOwner || isCareTaker) && canMine && hasTokenApproval"
                  @click="mine"
                  class="px-3 mt-4 text-md btn"
                >
                  Mine
                  <Number decimals="18" :number="expectedReward" /> $CUDL
                </a>
                <div
                  v-if="
                    !hasTokenApproval && (isOwner || isCareTaker) && !isStarving
                  "
                  class="text-sm m-0 flex flex-col justify-center"
                >
                  <!-- <div>You'll need to approve the spending of your $muse token to buy gems.</div> -->
                  <button
                    class="px-3 mt-4 text-md btn"
                    v-on:click="approve()"
                    v-tooltip.top-center="
                      `1st Approve our contract to be able to mine CUDL`
                    "
                  >
                    Click to Approve 1st
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="md:px-3 w-full mt-8 md:mt-0 md:w-1/3 flex">
            <div
              v-if="isOwner || isCareTaker"
              id="items"
              class="
                w-full
                market
                flex
                justify-between
                md:justify-start
                -m-3
                flex-wrap
                leading-snug
              "
            >
              <div
                class="
                  focus:outline-none
                  w-1/3
                  md:w-1/3
                  p-3
                  flex flex-col
                  items-center
                  gem
                  text-black
                "
                v-for="gem in gems"
                v-bind:key="gem.id"
              >
                <div
                  class="
                    boxShadowGem
                    flex flex-col
                    bg-white
                    border-4 border-black
                    w-full
                  "
                >
                  <div class="mx-auto mt-4">
                    <img
                      :src="gem.image"
                      class="h-12 item cursor-move"
                      alt
                      :gem_id="gem.id"
                      :gen_score="gem.score"
                      :gem_days="gem.days"
                    />
                  </div>
                  <div class="flex flex-col text-center py-4 tracking-tight">
                    <div class="text-black text-sm font-bold txtShadow3 mb-4">
                      {{ gem.name }}
                    </div>
                    <div class="text-black text-sm mb-4">
                      {{ gem.price }} $CUDL
                    </div>
                    <div class="text-sm">+{{ gem.score }} PTS</div>
                    <div class="text-sm">TOD {{ gem.days }} Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConnectWallet />
  </div>
</template>

<script>
import moment from "moment";
import BigNumber from "bignumber.js";
// @ is an alias to /src
import ConnectWallet from "@/components/ConnectWallet.vue";
import Number from "@/components/Number.vue";
import Address from "@/components/Address.vue";
import ColorPicker from "@/components/tools/ColorPicker.vue";
import SpeechBubble from "@/components/SpeechBubble.vue";
export default {
  name: "vNFT",
  components: {
    ConnectWallet,
    Number,
    Address,
    ColorPicker,
    SpeechBubble,
  },
  data: function () {
    return {
      editField: "",
      name: "",
      attributes: [],
      description: "",
      addressOrigin: "",
      idOrigin: "",
      isPetAlive: true,
      timeUntilStarving: 0,
      timePetBorn: 0,
      lastTimeMined: 0,
      expectedReward: 0,
      score: 0,
      level: 0,
      id: 0,
      hasTokenApproval: false,
      isOwner: false,
      owner: "",
      currentBalance: 0,
      currentGem: {},
      isCareTaker: false,
      isForSale: false,
      isLoaded: false,
      statusImg: "",
      rarity: 0,
      ranking: 0,
      image: "",
      adventure: "regular",
      gems: [
        {
          name: "Bananuman",
          id: 1,
          score: 100,
          days: 2,
          price: 0.5,
          image: require("@/assets/img/items/bananuman-400px.png"),
        },
        {
          name: "Catnip",
          id: 2,
          score: 190,
          days: 1.5,
          price: 0.6,
          image: require("@/assets/img/items/catnip-400px.png"),
        },
        {
          name: "Cucombre",
          id: 3,
          score: 1,
          days: 4,
          price: 2,
          image: require("@/assets/img/items/cucombre-400px.png"),
        },
        {
          name: "Moon Milk",
          id: 4,
          score: 1300,
          days: 2,
          price: 5,
          image: require("@/assets/img/items/moonMilk-400xp.png"),
        },
        {
          name: "Thicc Duck",
          id: 5,
          score: 50,
          days: 3,
          price: 0.8,
          image: require("@/assets/img/items/thiccDuck-400px.png"),
        },
        {
          name: "Tuna",
          id: 6,
          score: 2700,
          days: 5,
          price: 10,
          image: require("@/assets/img/items/tuna-400px.png"),
        },
      ],
      color: "rgba(71,154,104, 39)",
      inBattle: false,
      challengesUsed: 0,
      bonkedStats: "0/11",
    };
  },
  mounted: async function () {
    this.id = this.$route.params.id;
    const context = this;
    window.addEventListener("load", () => {
      this.setupDragAndDrop(context);
    });
    this.fetchPetInfo();
    const forSale = await axios.get(
      `https://gallery.verynifty.io/api/opensea/${this.id}`
    );
    this.isForSale = forSale.data == this.id;

    this.toggleBackground();
  },
  methods: {
    toggleBackground: function () {
      // TODO this is to toggle adventure wen pets sent on journeys paid with milk
      if (this.adventure == "xyz") {
        document.body.className = document.body.className.replace(
          "body",
          "leaderboard"
        );
      } else if (this.adventure == " aox") {
        document.body.className = document.body.className.replace(
          "body",
          "deathvalley"
        );
      }
    },
    colorChanged: async function (color) {
      if (this.color == color) {
        return;
      }
      this.color = color;
      console.log(color);
      /* Here come the API call to sign and change color */
      const sign = await web3.personal.sign(
        web3.fromUtf8(this.color),
        web3.eth.coinbase,
        async (obj, signature) => {
          const saveColor = await axios.post(
            "https://gallery.verynifty.io/api/attributes",
            {
              id: this.id,
              color: this.color,
              signature,
              publicAddress: this.$store.state.account,
            }
          );
          console.log(saveColor.data);
        }
      );
    },
    colorUpdated: async function (color) {
      console.log(color);
      function updateQueryStringParameter(uri, key, value) {
        value = value.trim();
        key = key.trim();
        return uri + "?" + key + "=" + value;
      }
      let img_url = this.image.split("?")[0];
      const img = updateQueryStringParameter(img_url, "color1", color);
      this.image = img;
    },
    fatality: async function (e) {
      const tokenId = prompt(
        `You'll get 20% of his points by killing this Pet #. To which PET Id would you like to give these points?`
      );
      let fatality = await this.$store.state.Moonpet.methods
        .fatality(this.id, tokenId)
        .send({
          from: this.$store.state.account,
        });
    },
    fetchPetInfo: async function () {
      console.log("FETCHPETINFOS");
      if (this.$store.state.web3 == null) {
        return;
      }
      console.log(this.id);
      let infos = await this.$store.state.Moonpet.methods
        .getPetInfo(this.id)
        .call();
      this.name = await this.$store.state.Bazaar.methods.name(this.id).call();
      console.log("infos ", infos);
      // console.log(infos);
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.Moonpet
            )
            .call()
        ).length >= 18;
      console.log(infos);
      this.expectedReward = infos._expectedReward;
      this.timeUntilStarving = parseInt(infos._timeUntilStarving);
      this.addressOrigin = infos._token;
      this.idOrigin = infos._tokenId;
      this.lastTimeMined = parseInt(infos._lastTimeMined);
      this.timePetBorn = parseInt(infos._timePetBorn);
      this.score = parseInt(infos._score);
      this.level = parseInt(infos._level);
      this.owner = infos._owner;
      this.isPetAlive = infos._isAlive;
      this.isStarving = infos._isStarving;
      this.owner = infos._owner;

      this.isOwner =
        this.owner.toLowerCase() == this.$store.state.account.toLowerCase();
      console.log(this.addressOrigin);
      if (
        this.addressOrigin.toLowerCase() == this.$store.state.contracts.Mooncats
      ) {
        console.log("GET IMAGE");
        let a = await this.$store.state.Render.methods
          .render(this.idOrigin)
          .call();

        let getObject = a.substring(27);
        console.log(getObject);
        let { image, attributes } = JSON.parse(`${getObject}`);
        console.log(attributes);

        this.attributes = attributes;
        // console.log());

        this.image = image;
        console.log("setimage");
      } else if (
        this.addressOrigin.toLowerCase() ==
        this.$store.state.contracts.SmolBrain
      ) {
        this.image = `https://gateway.pinata.cloud/ipfs/QmY71ban6QoWg9nbNwikk6wVWknj8NFBG8nMGHEuzwfAwf/${this.idOrigin}/5.png`;
      }
      let careTaker = await this.$store.state.Moonpet.methods
        .careTaker(this.id, infos._owner)
        .call();
      this.challengesUsed = 1;
      const timesAttacked = 1;
      this.bonkedStats = `${timesAttacked}/11`;
      this.bonkedStats =
        this.lastTimeMined + 60 >= Math.floor(Date.now() / 1000);
      // try {
      //   const { data } = await axios.get(
      //     `https://gallery.verynifty.io/api/${this.id}`
      //   );
      //   // this.image = "http://localhost:8080/img/alien.31bad01b.png"; //TOOD
      //   this.name = data.name == null ? "" : data.name;
      //   this.description = data.description == null ? "" : data.description;
      // } catch (error) {}
      this.isCareTaker = careTaker == this.$store.state.account ? true : false;
      this.isLoaded = true;
      let context = this;
      console.log("now ", Math.floor(Date.now() / 1000));
      console.log("timeUntilStarving ", this.timeUntilStarving);
      const timeLeft = this.timeUntilStarving - Math.floor(Date.now() / 1000);
      if (timeLeft > 86400) {
        this.statusImg = require("@/assets/img/icons/1-statusbar.png");
      } else if (timeLeft < 846000 && timeLeft > 72000) {
        this.statusImg = require("@/assets/img/icons/2-statusbar.png");
      } else if (timeLeft < 846000 && timeLeft < 72000 && !this.isStarving) {
        this.statusImg = require("@/assets/img/icons/3-statusbar.png");
      } else if (this.isStarving) {
        this.statusImg = require("@/assets/img/icons/4-statusbar.png");
      }
      setTimeout(() => {
        this.setupDragAndDrop(context);
      }, 1000);
      await this.updateBalance();
      const pet = await axios(`https://api.nft20.io/cudl/${this.id}`);
      this.ranking = pet.data.pet[0].ranking;
    },
    mine: async function () {
      let ctx = this;
      var mineSound = new Audio(require("../assets/audio/mine1.wav"));
      mineSound.play();
      let minetx = await this.$store.state.Moonpet.methods
        .claimMiningRewards(this.id)
        .send({
          from: this.$store.state.account,
        })

        .on("receipt", (receipt) => {
          ctx.fetchPetInfo();
          location.reload();
        });
      console.log(minetx);
      this.fetchPetInfo();
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let ctx = this;
      let minetx = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.Moonpet, max)
        .send({
          from: this.$store.state.account,
        })
        .on("receipt", (receipt) => {
          ctx.fetchPetInfo();
        });
      this.fetchPetInfo();
    },
    feed: async function (id) {
      if (!this.hasTokenApproval) {
        await this.approve();
      }
      let ctx = this;
      let minetx = await this.$store.state.Moonpet.methods
        .buyAccesory(this.id, id)
        .send({
          from: this.$store.state.account,
        })

        .on("receipt", (receipt) => {
          console.log("RECEIPT");
          ctx.fetchPetInfo();
          location.reload();
        });
      this.fetchPetInfo();
    },
    updateBalance: async function () {
      let balance = await this.$store.state.CUDL.methods
        .balanceOf(this.$store.state.account)
        .call();
      this.balance = new BigNumber(balance).shiftedBy(-18).toNumber();
    },
    setupDragAndDrop: async function (context) {
      const containers = document.querySelectorAll("#items");
      const dropzone = document.querySelector(".flip-box .flip-box-inner");
      var click = new Audio(require("../assets/audio/Menu Choice.mp3"));
      var after = new Audio(require("../assets/audio/mine.wav"));
      var gem = new Draggable.Draggable(containers, {
        draggable: ".item",
      });
      gem.on("drag:start", (e) => {
        let elem = e.source.getAttribute("gem_id");
        for (const gem of this.gems) {
          if (gem.id == parseInt(elem)) {
            this.currentGem = gem;
            // console.log(gem);
          }
        }
        click.play();
        this.updateBalance();
      });
      gem.on("drag:stop", () => {
        //  console.log("stop");
      });
      let over = false;
      gem.on("drag:move", (dragMoveEvent) => {
        if (
          dragMoveEvent.sensorEvent.target.id == "dropzone" ||
          dragMoveEvent.sensorEvent.target.id == "dropzone2"
        ) {
          //  console.log("over dropzone");
          dropzone.classList.add("rotate");
          over = true;
        } else {
          over = false;
        }
      });
      gem.on("mirror:destroy", () => {
        if (over) {
          // console.log("mirror:destroy OVER");
          over = false;
          if (this.currentGem.price <= this.balance) {
            this.feed(this.currentGem.id);
            after.play();
          } else {
            alert("You don't have enought CUDL to get this gem.");
          }
        }
        if (dropzone.classList.contains("rotate")) {
          dropzone.classList.remove("rotate");
        }
      });
      // tippy tooltips
      tippy("#items", {
        content: "Drag a gem to your Pet to buy it and get it's beneftis",
      });
      tippy("#bonk", {
        content:
          "You can bonk other pets within 1 minute after they mine for 80% chance of winning more $CUDL",
      });
      // tippy('.gem', {
      //     content: 'Here you can see the CUDL it costs, the points it gives and the # of days it lets you stay alive',
      // });
    },
    focusField: function (field) {
      this.editField = field;
    },
    blurField: function (field) {
      this.editField = "";
      if (field == "description") {
        this.saveDescription();
      } else if (field == "name") {
        this.saveName();
      }
    },
    showField: function (field) {
      if (field == "name") {
        return this.name == "" || this.editField == field;
      } else if (field == "description") {
        return this.description == "" || this.editField == field;
      }
    },
    saveName: async function () {
      // const web3 = this.$store.state.web3;
      const sign = await web3.personal.sign(
        web3.fromUtf8(this.name),
        web3.eth.coinbase,
        async (obj, signature) => {
          const saveName = await axios.post(
            "https://gallery.verynifty.io/api/name",
            {
              id: this.id,
              name: this.name,
              signature,
              publicAddress: this.$store.state.account,
            }
          );
          console.log(saveName.data);
        }
      );
    },
    saveDescription: async function () {
      const sign = await web3.personal.sign(
        web3.fromUtf8(this.description),
        web3.eth.coinbase,
        async (obj, signature) => {
          const saveDescription = await axios.post(
            "https://gallery.verynifty.io/api/description",
            {
              id: this.id,
              description: this.description,
              signature,
              publicAddress: this.$store.state.account,
            }
          );
          console.log(saveDescription.data);
        }
      );
    },
    battle: async function () {
      var battle = new Audio(require("../assets/audio/cat.mp3"));
      const opponent = prompt("Which pet would you like to attack?");
      if (battle !== "") {
        battle.play();
        this.inBattle = true;
        setTimeout(() => {
          this.inBattle = false;
        }, 5000);
      }
      let ctx = this;
      let minetx = await this.$store.state.Moonpet.methods
        .bonk(opponent, this.id)
        .send({
          from: this.$store.state.account,
        })

        .on("receipt", (receipt) => {
          ctx.fetchPetInfo();
        });
    },
    addPositionSuffix: function (number) {
      // creates 1st 2nd 3rd suffixes
      var j = number % 10,
        k = number % 100;
      if (j == 1 && k != 11) {
        return number + "st";
      }
      if (j == 2 && k != 12) {
        return number + "nd";
      }
      if (j == 3 && k != 13) {
        return number + "rd";
      }
      return number + "th";
    },
  },
  beforeMount: function () {},
  computed: {
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
    wrappedNFTName: function () {
      return "Original vNFT";
    },
    canMine: function () {
      let nextMining = this.lastTimeMined + 60 * 60 * 24;
      let currentTime = Math.floor(Date.now() / 1000);
      return nextMining < currentTime;
      // return true;
    },
  },
  watch: {
    isConnected: function () {
      this.fetchPetInfo();
    },
  },
};
</script>

<style scoped>
.shake {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}
@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
/* end shake */
.drop {
  font-size: 8rem;
  width: 0.1em;
  height: 0.1em;
  border-radius: 0 100% 100% 100%;
  background-color: red;
  position: absolute;
  top: 70%;
  animation: drop 3s infinite both;
}
/* .drop:nth-child(1) {
  left: 0%;
} */
/* .drop:nth-child(2) {
  left: 14%;
  animation-delay: -0.4s;
} */
.drop:nth-child(3) {
  left: 39%;
  animation-delay: -1.5s;
}
.drop:nth-child(4) {
  left: 55%;
  animation-delay: -0.8s;
}
/* .drop:nth-child(5) {
  left: 82.5%;
  animation-delay: -1.3s;
} */
@keyframes drop {
  0% {
    transform: translateY(0) scaleX(0.85) rotate(45deg);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(120%) scaleX(0.85) rotate(45deg);
    animation-timing-function: ease-in;
  }
  80%,
  100% {
    transform: translateY(60vh) scaleX(0.85) rotate(45deg);
  }
}
/* end battle css */
/* The flip box container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-box {
  background-color: transparent;
  width: 320px;
  height: 220px;
  perspective: 1000px;
  /* Remove this if you don't want the 3D effect */
}
/* This container is needed to position the front and back side */
.flip-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
/* Do an horizontal flip when you move the mouse over the flip box container */
/* .flip-box:hover .flip-box-inner {
            transform: rotateY(180deg);
        } */
.rotate {
  transform: rotateY(180deg);
}
/* Position the front and back side */
.flip-box-front,
.flip-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  /* Safari */
  backface-visibility: hidden;
}
/* Style the front side (fallback if image is missing) */
.flip-box-front {
  color: black;
}
/* Style the back side */
.flip-box-back {
  transform: rotateY(180deg);
}
/*VUE TOOLTIP */
/*END VUE TOOLTIP*/
</style>