<template>
  <transition name="slide">
    <div class="result-container">
      <div class="main-container">
        <div class="image-container" id="imgContainer" ref="imgContainer">
          <!-- <img ref="image" :src="image" /> -->
          <v-stage :config="canvasConfig">
            <v-layer>
              <v-image :config="{image: image}" ref="image" />
              <v-circle
                v-for="(c,i) in palette"
                :key="i"
                :ref="'c'+i"
                @dragmove="handleDrag"
                :config="{
                  x: 100 + (i * 20),
                  y: 100,
                  radius: 13,
                  fill: c,
                  stroke: 'white',
                  strokeWidth: 1,
                  draggable: true,
                }"
              ></v-circle>
            </v-layer>
          </v-stage>
          <!-- <canvas ref="image">Your browser does not support the HTML5 canvas tag.</canvas> -->
        </div>
      </div>
      <div class="side-container">
        <h4>{{settingMode}} Palette</h4>
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

export default {
  name: "result",
  components: {
    ColorStrip,
    Picker
  },
  computed: {
    palette() {
      const formatter = require("tinycolor2");
      var c = [];
      if (this.settingMode === "Dominant") {
        c = this.dominantColors;
      } else {
        c = this.customPalette;
      }
      c = c.sort(function(a, b) {
        const af = formatter(a);
        const bf = formatter(b);
        return af.toHsv().h - bf.toHsv().h;
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
      settingMode: "Dominant",
      dominantColors: this.$route.query.colors,
      customPalette: this.$route.query.colors,
      image: null,
      canvasConfig: {
        width: 780,
        height: 400
      }
    };
  },
  mounted() {
    this.$store.state.card = true;
    setTimeout(() => {
      this.setImage();
    }, 200);

    // this.$nextTick(()=>{
    //   this.setImage();
    // })
  },
  updated() {
    // this.setImage();
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
    },
    handleDrag(evt) {
      // console.log(evt)
      const formatter = require("tinycolor2");
      const oldColor = evt.target.attrs.fill;
      this.settingMode = "Custom";
      const x = Math.max(0, evt.target.attrs.x);
      const y = Math.max(0, evt.target.attrs.y);
      // console.log(x, y)
      const { data } = this.$refs.image
        .getNode()
        .getContext()
        ._context.getImageData(x, y, 1, 1);

      // console.log(data)
      const c = formatter({ r: data[0], g: data[1], b: data[2], a: data[3] });
      // console.log(this.customPalette[0], c.toHexString());
      const idx = this.customPalette.findIndex(rgb => rgb === oldColor);
      this.customPalette.splice(idx, 1, c.toHexString());

      // evt.target.VueComponent.config.fill = c.toHexString();
      // this.customPalette.push(c.toHexString());
      // this.customPalette[5] = "red";
      // this.isDragging = true;
    },
    setImage() {
      const im = this.$refs.imgContainer;
      const image = new Image();
      image.src = this.$store.state.image;
      image.onload = () => {
        let scale = 1;
        if (image.naturalWidth > image.naturalHeight) {
          scale = im.clientWidth / image.naturalWidth; // assuming image is always bigger than client width
        } else {
          scale = im.clientHeight / image.naturalHeight;
        }
        const w = image.naturalWidth * scale;
        const h = image.naturalHeight * scale;
        this.canvasConfig.width = image.width = w;
        this.canvasConfig.height = image.height = h;
        this.image = image;
      };
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
      height: 85%;
      max-width: 100%;
      display: flex;
      justify-content: center;

      // background: red;

      canvas {
        width: 100%;
        height: 100%;
      }

      // .pointColor {
      //   // display: none;
      //   position: absolute;
      //   background: red;
      //   width: 24px;
      //   height: 24px;
      //   top: 0;
      //   left: 0;
      //   border: solid 2px white;
      //   border-radius: 50%;
      //   z-index: 1;
      //   cursor: crosshair;
      //   pointer-events: auto;
      //   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
      //   box-sizing: border-box;
      // }
    }
  }

  .side-container {
    width: 30%;
    background-color: white;
    box-shadow: -3px 0px 7px -4px rgba(0, 0, 0, 0.2);
    text-align: center;
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
