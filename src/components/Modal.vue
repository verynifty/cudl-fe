<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h1 class="text-2xl font-bold">
                {{ title }}
              </h1>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <span class="text-xl">
                {{ text }}
              </span>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <!-- foter -->

              <button
                @click="$emit('close')"
                class="border-2 border-gray-900 bg-gray-900 bg-opacity-100 hover:text-gray-900 hover:bg-white text-white py-0 px-3 mt-6 text-2xl btn leading-loose"
              >
                {{ button }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// add this as button to components
//  <button id="show-modal" @click="showModal = true">
//           Show Modal
//         </button>

export default {
  name: "Modal",
  components: {},
  props: {
    text: String,
    title: String,
    button: String,
  },
  data: function () {
    return {};
  },
  methods: {},
  beforeMount: function () {},
  watch: {},
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  width: 40%;
  margin: 0px auto;
  padding: 30px 30px;
  background-color: #fff;
  border-radius: 0px;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 1);
  transition: all 0.3s ease;
  font-family: "minecraftia";
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

@media (max-width: 768px) {
  .modal-container {
    max-height: calc(100vh - 80px);
    overflow-y: auto;

    width: 80%;
  }
}
</style>
