<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <header>
      <img
        style="height: 45px;left:50%;position:absolute;transform: translateX(-50%);"
        v-show="!$store.state.card"
        :src="require('@/assets/logo.svg')"
      />
      <a @click="random">HOW DOES THIS WORK?</a>
    </header>
    <div class="home-container">
      <h1 key="title">
        <strong>NOT ANOTHER</strong>
        <br />PALETTE GENERATOR
      </h1>
      <h4 key="subtitle">Well...yeah it is, but with a twist.</h4>
      <Dropzone ref="dropzone" />
      <transition name="fade">
        <div v-show="howtoToggle" class="howto-container">
          <h4>Piclette can help you create amazing color palettes from any pictures you have.</h4>
          <h4>Simply drag your image and it will do the rest of the work</h4>
          <img :src="require('@/assets/hover.gif')" />
          <h4>Check out some samples below</h4>
          <img :src="require('@/assets/showcase1.png')" />
          <img :src="require('@/assets/showcase2.png')" />
          <img :src="require('@/assets/showcase3.png')" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Dropzone from "@/components/upload-area";

export default {
  name: "index",
  components: {
    Dropzone
  },
  data() {
    return {
      howtoToggle: false
    };
  },
  created() {
    this.$store.state.card = false;
  },
  methods: {
    random() {
      const Unsplash = require("unsplash-js").default;
      const toJson = require("unsplash-js").toJson;
      const { getPaletteFromURL } = require("color-thief-node");
      const formatter = require("tinycolor2");

      const unsplash = new Unsplash({
        accessKey: "0rrlCtSZzJ78-DVRI4RzjCfvzD2jgVOe4meX7KLed7A",
        secret: "FsiRchukT4wPe1bcy0V5bV0J9ZC2nGkxei9zUi8SxaA"
      });

      unsplash.photos
        .getRandomPhoto({ featured: true })
        .then(toJson)
        .then(json => {
          const imageURL = json.urls.regular;

          (async () => {
            // console.log(json, imageURL);
            let response = await getPaletteFromURL(imageURL, 7, 5);
            // changing format and getting the brightest color
            let i = 0;
            let found = false;
            response = response.map((color, idx) => {
              var c = formatter(`rgb (${color[0]},${color[1]},${color[2]})`);
              if (c.getBrightness() > 70 && !found) {
                i = idx;
                found = true;
              }
              return c.toHexString();
            });
            this.$store.state.cardBg = response[i];
            this.$store.state.image = imageURL;
            this.$store.state.loading = false;
            this.$router.push({
              path: "/result",
              query: { colors: response }
            });
          })();
        });
    }
  }
};
</script>

<style lang="scss">
.container {
  header {
    padding: 25px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 80px;
    font-size: 1rem;
    flex-grow: 0;
  }

  h1 {
    font-size: 7vw;
    margin: 0px;
    font-weight: 300;
  }

  h4 {
    font-size: 2vw;
    opacity: 0.8;
    margin-top: 0px;
  }
}

.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -7%;
  flex-grow: 1;

  .howto-container {
    width: 80%;
    position: absolute;
    background: white;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    padding: 50px 30px 10px 30px;
    overflow: auto;
    top: 85px;
    height: calc(100vh - 85px);

    h4 {
      margin-top: 1.33em;
    }

    img {
      max-width: 90%;
    }
  }
}

.dropzone-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 3rem;
  transition: all 0.2s ease-in-out;

  p {
    margin-top: 150px;
  }
}
@media screen and (max-width: 450px) {
  header a {
    font-size: 0.6em;
  }
}
</style>
