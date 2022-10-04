<template>
  <div>
    <div class="flex flex-col justify-start items-start my-4">
      <div class="text-center my-10">
        <img src="@/assets/img/race-logo.svg" alt />
      </div>
      <div
        class="
          md:px-4
          px-4
          w-full
          flex
          justify-center
          flex-wrap
          md:nowrap
          md:justify-between
          items-center
          mb-0
          text-lg
          flex-col-reverse
          md:flex-row
          border-4 border-black
          bg-white
          p-4
          boxShadow
        "
      >
        <div
          class="
            w-full
            md:w-1/2
            flex
            md:flex-row
            flex-col
            md:space-x-4
            md:mb-0
            mb-4
          "
        >
          <button
            class="btn flex items-center justify-center space-x-4"
            @click="selectingPet = true"
          >
            <img src="@/assets/img/race-flag.svg" class="h-8" />
            <div class="inline-block">Join for 3 $CUDL</div>
          </button>
          <button
            class="btn flex items-center justify-center space-x-4"
            @click="showModal = true"
          >
            How it works?
          </button>
        </div>
        <div class="text-black pr-4 pt-4">
          Race #{{ currentRace }}
          <span v-if="!raceEnded && leftTime != 0">
            will start in:
            <countdown :left-time="leftTime">
              <!-- 101 seconds -->
              <span slot="process" slot-scope="{ timeObj }">{{
                `${timeObj.m}:${timeObj.s}`
              }}</span>
              <span slot="finish">any time!</span>
            </countdown>
            or in {{ maxParticipants - participants }} participants
          </span>
        </div>
      </div>
      <div
        class="
          flex
          md:flex-row
          flex-col
          items-start
          justify-center
          md:justify-between
          border-4 border-black
          p-20
          md:space-x-16
          bg-white
          boxShadow
          w-full
        "
      >
        <div id class="w-full md:w-auto md:mt-10 mb-8 md:mb-0">
          <div id="game" class style="width: 100%; height: 100%"></div>
        </div>
        <div
          class="
            md:w-1/3
            w-full
            justify-center
            md:justify-start
            flex flex-col
            text-center
            space-y-8
          "
        >
          <div class="text-xl font-bold txtShadow">
            Current rewards: {{ participants * 3 }} $CUDL
          </div>
          <div class="uppercase tracking-tight">Leaderboard</div>
          <div class="w-full">
            <table class="min-w-full table-auto leading-loose tracking-wide">
              <thead>
                <tr class="border-b-8 border-white">
                  <th class="text-md">Player</th>
                  <th class="text-md">Position</th>
                </tr>
              </thead>
              <tbody class>
                <tr
                  class="border-b-8 border-white"
                  v-for="racer in sortedRacers"
                  v-bind:key="racer.position"
                >
                  <td class="mb-10">
                    <img
                      :src="NFTimages[racer.key]"
                      alt
                      class="w-16 h-16 rounded-full bg-orange-100"
                      loading="lazy"
                    />
                  </td>
                  <td>{{ racer.endPosition }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="
          flex
          md:nowrap
          md:flex-row
          flex-col
          justify-start
          items-center
          md:space-x-4
          w-full
          md:w-auto
          mt-4
          p-4
          px-6
          bg-yellow-400
          text-black
          border-4 border-black
          boxShadow
        "
      >
        <div class="mb-2 md:mb-0 md:mt-3">Replay race#</div>
        <input
          type="number"
          v-model="replayRace"
          name
          id
          class="
            text-center
            border-2 border-black
            focus:outline-none
            -mt-1
            md:w-20
            boxShadow2
            leading-loose
          "
        />
        <a
          :href="`/race?id=${replayRace}`"
          class="
            flex
            justify-center
            md:block
            md:w-auto
            w-full
            mt-2
            mr-2
            md:mt-0
          "
        >
          <button
            class="
              text-primary
              px-4
              text-base
              btn
              cursor-pointer;
              leading-tight
              mt-2
              md:mt-0
            "
          >
            <span class="inline-block">Replay</span>
          </button>
        </a>

        <a
          :href="`/race`"
          class="
            flex
            justify-center
            md:block
            md:w-auto
            w-full
            ml-2
            mt-2
            md:mt-0
          "
        >
          <button
            class="
              text-primary
              px-4
              text-base
              btn
              cursor-pointer;
              leading-tight
            "
          >
            <span class="inline-block">Latest race</span>
          </button>
        </a>
      </div>
      <div class="text-white mt-10">
        The races are decided by a random generator and can be addictive to
        addictive personalities. Be careful and let us know on Discord if we
        should ban your ip from accessing this page.
      </div>
    </div>

    <JoinRaceModal
      v-if="selectingPet"
      @close="selectingPet = false"
      :ownerNFTs="ownerNFTs"
      :text="`CUDL Finance is an experimental game and currently in beta. Any risks you take using this platform are your own. This is not an investment vehicle. Caution is advised.`"
    />

    <!-- How to play modal MUSE -->
    <Modal
      v-if="showModal"
      @close="showModal = false"
      :title="`How does the race work?`"
      :button="`Take me back`"
    >
      <div slot="body">
        <ol class="list-decimal list-inside leading-loose tracking-wide mb-4">
          <li class="mb-2">Join with 1 NFT and pay the 3 $CUDL fee</li>
          <li class="mb-2">
            The race starts 10 minutes after the 2nd participant joins the race
            or when it reaches 6 participants.
          </li>
          <li class="mb-2">The winner gets 100% of the $CUDL in the race.</li>
          <li class="mb-2">You can play as many times as you'd like.</li>
          <!-- <li class="mb-2">
            The winner also gets a 10% chance of winning a new GEN 2 VNFT and
            mine muse every 24 hours.
            <div>
              <img src="@/assets/img/nft/snicker.jpeg" alt class="h-64" />
            </div>
          </li> -->
        </ol>
        <div class="mb-4">
          The winner is decided by a random generator in the smart contract, you
          can verify it's fairness
          <a
            href="https://etherscan.io/address/0xfa12f95a1a7a069166792fd2ea640d2cd0a4e407"
            target="_blank"
            class="text-blue-600 hover:underline"
            >here</a
          >.
        </div>
      </div>
    </Modal>
    <!-- How to play modal ETh -->
    <!-- <Modal
      v-if="showModal"
      @close="showModal = false"
      :title="`How does the race work?`"
      :button="`Take me back`"
    >
      <div slot="body">
        <ol class="list-decimal list-inside leading-loose tracking-wide mb-4">
          <li class="mb-2">Join with 1 NFT and pay the 0.1eth fee</li>
          <li class="mb-2">
            The race starts when 6 particpants join or after 5 minutes if more
            than one participant is in.
          </li>
          <li class="mb-2">
            The winner gets 90% of the eth, 10% goes to the devs.
          </li>
          <li class="mb-2">You can play as many times as you'd like.</li>
          <li class="mb-2">
            The winner also gets a 10% chance of winning a new GEN 2 VNFT and
            mine muse every 24 hours.
            <div>
              <img src="@/assets/img/nft/snicker.jpeg" alt class="h-64" />
            </div>
          </li>
        </ol>
        <div class="mb-4">
          The winner is decided by a random generator in the smart contract, you
          can verify it's fairness
          <a
            href="https://.io/address/0xe86644c5696d1af082df0b41c5f57e63e27def5d"
            target="_blank"
            class="text-blue-600 hover:underline"
            >here</a
          >.
        </div>
      </div>
    </Modal> -->
  </div>
</template>


<script>
import JoinRaceModal from "@/components/JoinRaceModal.vue";
import Modal from "@/components/Modal.vue";
require("canvas-confetti");

var RaceBackground = require("../assets/img/race.svg");
// var raceMusic = new Audio(require("../assets/audio/raceMusic.ogg"));
console.log("HELLO", RaceBackground);
var isRaceRunning = false;
var graphics;
var followers;
var path;
var needToLoad = false;
var participantOrder;
var NFTimages;

// @ is an alias to /sr
export default {
  name: "Race",

  components: { JoinRaceModal, Modal },
  data: function () {
    return {
      currentRace: 0,
      raceEnded: false,
      participants: 0,
      prize: 0,
      ticketPrice: 0.1,
      maxParticipants: 6,
      devPercent: 5,
      selectingPet: false,
      ownerNFTs: [],
      racers: [],
      NFTimages: {},
      startTime: 200,
      showModal: false,
      game: null,
      replayRace: 0,
      leftTime: 0,
      hasTokenApproval: false,
    };
  },
  created: function () {
    this.initialize();
  },
  mounted: function () {},
  beforeMount: function () {
    document.body.className = document.body.className.replace("body", "race");
  },
  methods: {
    startConfetti: async function (vuectx) {
      // this.$confetti.start();
      vuectx.$confetti.start({
        particles: [
          {
            type: "rect",
            colors: [
              "DodgerBlue",
              "OliveDrab",
              "Gold",
              "pink",
              "SlateBlue",
              "lightblue",
              "Violet",
              "PaleGreen",
              "SteelBlue",
              "SandyBrown",
              "Chocolate",
              "Crimson",
            ],
          },
          {
            type: "circle",
            colors: ["#ba0000"],
          },
          {
            type: "image",
            url: require("@/assets/img/branding/muse-circle.png"),
          },
        ],
      });
    },
    initialize: async function () {
      if (this.$store.state.web3 == null) {
        return false;
      }

      if (this.$route.query.id) {
        this.currentRace = this.$route.query.id;
      } else {
        this.currentRace = await this.$store.state.NFTRace.methods
          .currentRace()
          .call();
      }

      this.initializeRace();
      await this.refreshRace();
    },
    enterRace: async function (contract, nftId, type) {
      console.log(contract, nftId);
      alert(nftId);
      this.hasTokenApproval =
        (
          await this.$store.state.CUDL.methods
            .allowance(
              this.$store.state.account,
              this.$store.state.contracts.NFTRace
            )
            .call()
        ).length >= 18;
      if (!this.hasTokenApproval) {
        await this.approve();
      }
      let send = await this.$store.state.NFTRace.methods
        .joinRace(contract, nftId)
        .send({
          from: this.$store.state.account,
        });
    },
    approve: async function () {
      let max =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      let remove = "0";
      let approve = await this.$store.state.CUDL.methods
        .approve(this.$store.state.contracts.NFTRace, max)
        .send({
          from: this.$store.state.account,
        });
    },
    refreshRace: async function () {
      let raceInfo = await this.$store.state.NFTRace.methods
        .getRaceInfo(this.currentRace)
        .call();
      console.log(raceInfo);
      this.leftTime =
        parseInt(raceInfo._raceStart) * 1000 -
        Math.floor(Date.now()) +
        5 * 60 * 1000;
      this.participants = parseInt(raceInfo._participantsCount);
      this.racers = [];
      for (let index = 0; index < this.participants; index++) {
        let participant = Object.assign({}, raceInfo._participants[index]);
        // This is for testing on localhost
        participant.key = participant.nftContract + ":" + participant.nftId;
        participant.score = parseInt(participant.score);
        if (this.NFTimages[participant.key] == null) {
          let a = await this.$store.state.Mooncat.methods
            .tokenURI(participant.nftId)
            .call();

          let getObject = a.substring(27);
          let { image, attributes } = JSON.parse(`${getObject}`);
          image;

          this.NFTimages[participant.key] = image;
        }
        participant.endPosition = "?";
        participant.initialPosition = index;
        this.racers.push(participant);
      }
      this.raceEnded = raceInfo._raceEnd != "0";

      if (!this.raceEnded) {
        setTimeout(this.refreshRace, 10000);
      }
    },
    initializeRace: async function () {
      console.log("INITIALIZE GAME");
      var config = {
        type: Phaser.AUTO,
        // width: 900,
        // height: 600,
        backgroundColor: "#ffffff",
        // parent: "game",
        scale: {
          mode: Phaser.Scale.FIT,
          parent: "game",
          // resolution: 2,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 900,
          height: 600,
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
          startRace: startRace,
        },
      };

      this.game = new Phaser.Game(config);
      var vuectx = this;
      function startRace() {}

      function preload() {
        this.load.svg("background", RaceBackground);

        // this.load.audio("raceMusic", ["../assets/audio/raceMusic.ogg"]);
      }

      var music;

      function create() {
        // this.scale.displaySize.setAspectRatio(900 / 600);
        // this.scale.refresh();
        // alert(document.querySelector("canvas"));

        document.querySelector("canvas").style.width = "100%";
        console.log(this);
        this.add.image(0, 0, "background").setOrigin(0, 0);

        graphics = this.add.graphics();

        // music = game.add.audio("raceMusic");

        // music.play();
        console.log(graphics);

        path = new Phaser.Curves.Path(50, 500);

        path.splineTo([
          45, 350, 45, 505, 93, 552, 121, 552, 191, 551, 312, 557, 440, 554,
          807, 551, 807, 451, 672, 453, 664, 326, 817, 326, 811, 250, 664, 250,
          664, 135, 811, 135, 811, 37, 200, 37, 45, 57, 45, 350, 45, 505, 93,
          552, 121, 552, 191, 551, 312, 557, 440, 554, 807, 551, 807, 451, 672,
          453, 664, 326, 817, 326, 811, 250, 664, 250, 664, 135, 811, 135, 811,
          37, 200, 37, 45, 57, 45, 350, 45, 505, 93, 552, 121, 552, 191, 551,
          312, 557, 440, 554, 807, 551, 807, 451, 672, 453, 664, 326, 817, 326,
          811, 250, 664, 250, 664, 135, 811, 135, 811, 37, 200, 37, 45, 57, 45,
          350,
        ]);
      }

      async function update() {
        graphics.clear();
        graphics.lineStyle(2, 0xffffff, 1);

        // path.draw(graphics);

        if (needToLoad) {
          needToLoad = false;
          for (let index = 0; index < participantOrder.length; index++) {
            // if (
            //   NFTimages[participantOrder[index].key]
            //     .toLowerCase()
            //     .endsWith(".svg")
            // ) {
            //   this.load.svg(
            //     participantOrder[index].key,
            //     NFTimages[participantOrder[index].key]
            //   );
            // } else {

            var decodedData = atob(
              NFTimages[participantOrder[index].key].split(",")[1]
            );

            const blob = new Blob([decodedData], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);

            this.load.svg(participantOrder[index].key, url);

            await this.load.start();
          }

          /* This is hacky to wait for loaded images */
          function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }
          await sleep(3000);
          console.log(this.load.totalToLoad);

          followers = this.add.group();

          function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
          }

          for (let index = 0; index < participantOrder.length; index++) {
            var ball = followers.create(0, -50, participantOrder[index].key);
            console.log("ball", ball);
            let curves = [
              Smooth(
                [500, 2000, 3200, 3800, 5200, 6500, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 1800, 2400, 3800, 5000, 6000, 7000, 8500, 9200, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [500, 1400, 3000, 3800, 5000, 6000, 7500, 8500, 9500, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 1500, 3000, 3800, 5000, 6500, 7000, 8500, 8700, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 2000, 3000, 3800, 4300, 5900, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 2000, 3000, 3800, 5000, 6000, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 2000, 3000, 3800, 5000, 6000, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 2000, 3000, 3800, 5000, 6000, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 2000, 3000, 3800, 5000, 6000, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
              Smooth(
                [1000, 2000, 3000, 3800, 5000, 6000, 7000, 8500, 9000, 10000],
                { scaleTo: [0, 10000] }
              ),
            ];
            let curve = curves[index];
            ball.setData("vector", new Phaser.Math.Vector2());
            let width = ball.displayWidth;
            let height = ball.displayHeight;
            let maxSize = 90;
            if (width > height) {
              ball.displayWidth = maxSize;
              ball.displayHeight =
                (ball.displayHeight * ball.displayWidth) / width;
            } else {
              ball.displayHeight = maxSize;
              ball.displayWidth =
                (ball.displayWidth * ball.displayHeight) / height;
            }

            this.tweens.add({
              targets: ball,
              z: 1,
              ease: function (x) {
                return curve(x * 10000) / 10000;
              },
              // duration: participantOrder[index].time,
              duration: 36000 + index * 400,
              repeat: 0,
              delay: 2000,
              onComplete: function () {
                vuectx.racers[index].endPosition = index + 1;
                if (index == participantOrder.length - 1) {
                  vuectx.startConfetti(vuectx);
                  setTimeout(() => {
                    location.reload();
                  }, 6000);
                }
              },
            });
          }
          vuectx.$confetti.stop();

          isRaceRunning = true;
        }
        if (isRaceRunning) {
          var balls = followers.getChildren();

          for (var i = 0; i < balls.length; i++) {
            var t = balls[i].z;
            var vec = balls[i].getData("vector");
            path.getPoint(t, vec);
            balls[i].setPosition(vec.x, vec.y);
            balls[i].setDepth(balls[i].y);
          }
        }
      }
    },
  },
  computed: {
    sortedRacers: function () {
      return this.racers.sort(function (a, b) {
        return a.endPosition - b.endPosition;
      });
    },
    isConnected: function () {
      return this.$store.state.web3 != null;
    },
  },
  watch: {
    isConnected: async function () {
      await this.initialize();
    },
    selectingPet: async function () {
      if (!this.selectingPet || this.ownerNFTs.length != 0) {
        return;
      }
      let account = this.$store.state.account;

      this.listSize = parseInt(
        await this.$store.state.Mooncat.methods.balanceOf(account).call()
      );
      if (this.listSize > 0) {
        for (let index = 0; index < this.listSize; index++) {
          console.log(index);
          let id = await this.$store.state.Mooncat.methods
            .tokenOfOwnerByIndex(account, index)
            .call();
          if (
            (await this.$store.state.Moonpet.methods
              .isNftInTheGame(this.$store.state.contracts.Mooncats, id)
              .call()) == true
          ) {
            let a = await this.$store.state.Mooncat.methods.tokenURI(id).call();

            let getObject = a.substring(27);

            let { image, attributes } = JSON.parse(`${getObject}`);

            let thisNft = {
              image: image,
              contractName: this.$store.state.contracts.Moonpet,
              idOrigin: id,
              contractOrigin: this.$store.state.contracts.Mooncats,
              key: this.$store.state.contracts.Mooncats + ":" + id,
            };

            if (this.NFTimages[id] != null) {
              this.NFTimages[id] = image;
            }

            this.ownerNFTs.push(thisNft);
          }
        }
      }
    },

    raceEnded: async function (now, old) {
      if (old != now && now) {
        /* Here we should start everything to display the race running*/
        NFTimages = this.NFTimages;
        participantOrder = this.racers.sort(function (a, b) {
          return b.score - a.score;
        });
        for (let index = 0; index < participantOrder.length; index++) {
          participantOrder[index].position = index + 1;
          participantOrder[index].time = 10000 + 350 * index;
          console.log("time");
        }
        needToLoad = true;
      }
    },
  },
};
</script>

<style scoped>
body {
  background: pink;
}
</style>
