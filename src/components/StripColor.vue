<template>
  <div @mouseenter="me" @mouseleave="ml" class="color-container" :style="{'color': textColor}">
    <!-- <transition name="fade"> -->
      <template v-if="!hover">
        <p
          class="color-code"
          :style="{'background-color':Dcolor, 'border': Border}"
          @click.stop="copyColor"
        >{{Dcolor==='white'? 'No Color Selected': Dcolor}}</p>
      </template>

      <div v-else class="anag-container">
        <p
          v-for="(c,i) in similarColors"
          :key="i"
          @click.stop="copyColor(c)"
          :style="{'background-color':c, 'border': Border}"
        >{{c}}</p>
      </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import formatter from "tinycolor2";

export default {
  name: "color-strip",
  props: {
    color: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "hex",
      validator: function(value) {
        return ["rgb", "hex", "hsl", "hsv"].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {
      hover: false
    };
  },
  computed: {
    Dcolor() {
      if (this.$props.color === "") return "white";

      const c = formatter(this.$props.color);
      return this.formatMode(c);
    },
    textColor() {
      if (this.$props.color === "") return "#2b2b2b";
      const c = formatter(this.$props.color);
      if (c.isLight()) return "#2b2b2b";
      else return "white";
    },
    Border() {
      if (this.$props.color === "") return "dashed 1px #2b2b2b";
      else return "none";
    },
    similarColors() {
      const colors = formatter(this.Dcolor)
        .analogous()
        .splice(0, 3);
      return colors.map(c => c.toHexString());
    }
  },
  methods: {
    copyColor(c) {
      const color = c === undefined ? this.Dcolor : c;
      // success
      if (this.$clipboard(color)) {
        this.$store.state.cardBg = color;
        this.$toasted.show(`Copied ${color}`, {
          theme: "bubble",
          position: "bottom-center",
          duration: 1200,
          keepOnHover: true
        });
      }
    },
    formatMode(tiny) {
      switch (this.mode.toLowerCase()) {
        case "rgb":
          return tiny.toRgbString();
        case "hsl":
          return tiny.toHslString();
        case "hsv":
          return tiny.toHsvString();
        case "hex":
        default:
          return tiny.toHexString().toUpperCase();
      }
    },
    me(x) {
      this.hover = true;
    },
    ml(x) {
      this.hover = false;
    }
  }
};
</script>

<style lang="scss">
.color-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  // padding: 20px 0px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0px;
  }

  .color-code {
    margin: 0px;
    font-weight: bold;
    font-size: 0.8rem;
    line-height: 60px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  }

  // &:hover {
  //   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  // }
}

.anag-container {
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  flex-direction: row;
  padding: 0px;
  flex-grow: 1;

  p {
    height: 100%;
    width: 100%;
    margin: 0 2px 0 4px;
    line-height: 60px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
    font-size: 0.2em;
  }
}
</style>
