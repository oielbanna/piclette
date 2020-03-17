<template>
  <transition name="fade">
    <div
      @click.stop="copyColor"
      class="color-container"
      :style="{'background-color':Dcolor, 'border': Border}"
    >
      <transition name="fade" mode="out-in">
        <p
          class="color-code"
          :style="'color:'+ textColor"
        >{{Dcolor==='white'? 'No Color Selected': Dcolor}}</p>
      </transition>
    </div>
  </transition>
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
  computed: {
    Dcolor() {
      if (this.$props.color === "") return "white";

      const c = formatter(this.$props.color);
      switch (this.mode.toLowerCase()) {
        case "rgb":
          return c.toRgbString();
        case "hsl":
          return c.toHslString();
        case "hsv":
          return c.toHsvString();
        case "hex":
        default:
          return c.toHexString().toUpperCase();
      }
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
    }
  },
  methods: {
    copyColor() {
      // success
      if (this.$clipboard(this.Dcolor)) {
        this.$store.state.cardBg = this.Dcolor;
        this.$toasted.show(`Copied ${this.Dcolor}`, {
          theme: "bubble",
          position: "bottom-center",
          duration: 1200,
          keepOnHover: true
        });
      }
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
  padding: 20px 0px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);

  &:last-child {
    margin-bottom: 0px;
  }

  .color-code {
    margin: 0px;
    font-weight: bold;
    font-size: 0.8rem;
  }

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
}
</style>
