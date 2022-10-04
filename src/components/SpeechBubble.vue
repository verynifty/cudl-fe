<template>
  <div
    v-hotkey="{
      keys: 'X',
      action: () => $nextTick(() => (showSpeechBubble = !showSpeechBubble)),
    }"
  >
    <div
      class="bubble bubble-bottom-left bg-gray-300"
      style="font-size: 1rem"
      v-if="showSpeechBubble"
    >
      > {{ showText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SpeechBubble",
  components: {},
  data: function () {
    return {
      texts: [
        "Wen moon ser?",
        "Wen Airdrop?",
        "GM",
        "!vibes",
        "!floor",
        "Satoshi Nakamoto is a fictitious name of the Bitcoin creator or creators, to this day no one knows who the actual creator is.",
        "Proof-of-stake is a method of securing a cryptocurrency network and achieving distributed consensus by showing ownership of currency.",
        "Proof-of-work is the most popular method of securing the blockchain, there are at least 480 implementations, including SHA-256 what Bitcoin uses",
        "ERC-20 is the token standard for fungible tokens on Ethereum, ERC-721 is the token standard for non-fungible tokens (NFTs).",
        "Looks rare",
        "!OG",
        "Super cycle",
        "Few",
        "Gib",
      ],
      showSpeechBubble: true,
      showText: "",
    };
  },
  mounted: async function () {
    this.showSpeechBubble = localStorage.showSpeechBubble;
    this.returnRandom();
  },
  methods: {
    returnRandom: async function () {
      const randomText =
        this.texts[Math.floor(Math.random() * this.texts.length)];
      this.showText = randomText;
    },
  },
  beforeMount: function () {
    this.showSpeechBubble = localStorage.showSpeechBubble;
  },
  computed: {},
  watch: {
    showSpeechBubble(newVal) {
      localStorage.showSpeechBubble = newVal;
    },
  },
};
</script>


<style scoped>
.bubble {
  position: relative;
  font-size: 18px;
  line-height: 24px;
  width: 300px;
  /* background: lightblue; */
  border-radius: 40px;
  padding: 24px;
  text-align: center;
  color: #000;
}

.bubble-bottom-left:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 24px solid rgba(226, 232, 240, var(--bg-opacity));
  border-right: 12px solid transparent;
  border-top: 12px solid rgba(226, 232, 240, var(--bg-opacity));
  border-bottom: 20px solid transparent;
  left: 50%;
  bottom: -24px;
}
</style>