<template>
  <div class="upload-container" ref="fileform">
    <div v-if="!approaching" class="drop-files-container">
      <div class="input-container pointer">
        Upload image or drag
        <form name="uploader">
          <input
            class="hidden pointer"
            type="file"
            accept="image/*"
            name="accept"
            @change="submitFile"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: "Palette",
      validator: function(value) {
        return ["Palette", "Picker"].indexOf(value) !== -1;
      }
    }
  },
  data() {
    return {
      dragAndDropCapable: false,
      file: null,
      approaching: false
    };
  },

  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    if (this.dragAndDropCapable) {
      document.addEventListener(
        "drop",
        function(e) {
          // TODO WHY IS THIS BEING CALLED SOOO MANY FUCKING TIMESSSS
          e.preventDefault();
          e.stopPropagation();
          if (!this.$store.state.loading) {
            this.file = e.dataTransfer.files[0];
            this.submitFile();
          }
        }.bind(this)
      );
    }
  },

  methods: {
    determineDragAndDropCapable() {
      const div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
    submitFile(e) {
      if (e !== undefined) this.file = e.target.files[0];
      const acceptedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
      if (!acceptedImageTypes.includes(this.file["type"])) {
        this.$toasted.show("Only images (jpg, jpeg, png) allowed.", {
          theme: "bubble",
          position: "bottom-center",
          duration: 1200,
          keepOnHover: true
        });
        return;
      }
      const imageURL = URL.createObjectURL(this.file);
      this.$store.state.loading = true;

      const { getPaletteFromURL } = require("color-thief-node");
      const formatter = require("tinycolor2");
      (async () => {
        let response = await getPaletteFromURL(imageURL, 7);
        // changing format and getting the brightest color
        let i = 0;
        response = response.map((color, idx) => {
          var c = formatter(`rgb (${color[0]},${color[1]},${color[2]})`);
          if (c.getBrightness() > 70) {
            i = idx;
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
        this.$store.state.points = response;
      })();
    }
  }
};
</script>

<style lang="scss">
.upload-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  text-align: center;
  margin: 0 auto;
  transition: all 0.2s ease-in-out;

  img {
    width: 100%;
  }
}
@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.03, 1.03, 1.03);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.dragover {
  animation: pulse 1s infinite;
  border: 4px dashed #3a3a3a;
}

.drop-files-container {
  display: flex;
  flex-direction: column;

  .input-container {
    width: auto;
    overflow: hidden;
    position: relative;
    // background-color: rgba(0, 0, 0, 0.2);
    margin: 4px;
    padding: 10px 13px;
    border: dashed 2px rgba(0, 0, 0, 0.2);
    transition: border 0.3s ease-in-out;

    input {
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 50px;
    }

    &:hover {
      border-style: solid;
    }
  }

  span {
    margin: 4px 0;
  }
}
</style>
