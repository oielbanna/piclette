<template>
  <transition name="slide">
    <div class="result-container">
      <div class="main-container">
        <div class="image-container">
          <!-- <img ref="image" :src="image" /> -->
          <canvas ref="image">Your browser does not support the HTML5 canvas tag.</canvas>

          <span class="pointColor" />
        </div>
      </div>
      <div class="side-container">
        <h4>{{settingMode}}</h4>
        <div style="margin-bottom: 5px;flex-grow:1;display: flex;flex-direction: column;">
          <color-strip v-for="(c,i) in palette" :mode="colorMode" :key="i" :color="c" />
        </div>
        <Picker :options="colorOptions" :initialSelect="initialPicker" @change="modeChanged" />
      </div>
    </div>
  </transition>
</template>

<script>
import ColorStrip from "@/components/StripColor";
import Picker from "@/components/Picker";
// import Zoomer from "@/components/Zoomer";

export default {
  name: "result",
  components: {
    ColorStrip,
    Picker
    // Zoomer
  },
  computed: {
    palette() {
      const formatter = require("tinycolor2");
      let c = this.$route.query.colors;
      c = c.sort(function(a, b) {
        const af = formatter(a);
        const bf = formatter(b);
        return af.toHsv().h - bf.toHsv().h
      });
      return c;
    },
    initialPicker() {
      let i = 0;
      this.colorOptions.forEach((element, idx) => {
        if (element.text.includes(this.colorMode)) {
          i = idx;
        }
      });
      return i;
    }
  },
  data() {
    return {
      colorMode: "hex",
      colorOptions: [
        { text: "hex" },
        { text: "rgb" },
        { text: "hsl" },
        { text: "hsv" }
      ],
      settingMode: "Dominant Palette",
      dominantColors: this.$route.query.colors,
      points: this.$store.state.points
    };
  },
  mounted() {
    this.$store.state.card = true;
    var canvas = this.$refs.image;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    var img = new Image();
    img.src = this.$store.state.image;
    img.onload = function() {
      var ctx = canvas.getContext("2d");
      canvas.width = w;
      canvas.height = h;
      if (this.naturalWidth > this.naturalHeight){
        ctx.drawImage(
          this,
          canvas.width / 2 - w / 2,
          canvas.height / 2 - (this.height * (w / this.width)) / 2,
          w,
          this.height * (w / this.width)
        );
      }
      else
        ctx.drawImage(
          this,
          canvas.width / 2 - (this.width * (h / this.height)) / 2,
          canvas.height / 2 - h/ 2,
          this.width * (h / this.height),
          h
        );
    };
  },
  methods: {
    modeChanged(e) {
      this.colorMode = e;
    },
    settingChanged(e) {
      this.settingMode = e
        .toLowerCase()
        .split(" ")
        .map(function(word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
    clicked(e) {
      var x = (e.target.naturalWidth / e.target.clientWidth) * e.offsetX;
      var y = (e.target.naturalHeight / e.target.clientHeight) * e.offsetY;
    }
  }
};
</script>

<style lang="scss">
.result-container {
  display: flex;
  height: 100%;

  .main-container {
    width: 70%;
    padding: 48px 20px 20px 20px;
    display: flex;
    flex-direction: column;

    .image-container {
      position: relative;
      height: 80%;
      max-width: 100%;

      // background: red;

      canvas {
        width: 100%;
        height: 100%;
      }

      .pointColor {
        display: none;
        position: absolute;
        background: red;
        width: 34px;
        height: 34px;
        top: 0;
        left: 0;
        border: solid 2px white;
        border-radius: 50%;
        z-index: 1;
        cursor: crosshair;
        pointer-events: auto;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        box-sizing: border-box;
      }
    }
  }

  .side-container {
    width: 30%;
    background-color: white;
    box-shadow: -3px 0px 7px -4px rgba(0, 0, 0, 0.2);
    text-align: left;
    padding: 1rem 1.3rem;
    display: flex;
    flex-direction: column;
    overflow: auto;

    h4 {
      margin: 10px 0px;
      text-transform: capitalize;
    }
  }
}

@media screen and (max-width: 780px) {
  .result-container {
    flex-direction: column;

    .main-container {
      width: 100%;
      padding: 65px 15px 15px 15px;

      .img-settngs-container {
        max-width: 75%;
        min-width: 35%;
      }

      .zoomer {
        margin-bottom: 15px;
      }
    }

    .side-container {
      width: 100%;
      overflow: auto;
      flex: 1;
      box-shadow: 0px -3px 7px -4px rgba(0, 0, 0, 0.2);

      h4 {
        font-size: 5vw;
      }
    }
  }
}
</style>
