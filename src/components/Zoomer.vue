<template>
  <div class="vue-magnifier-container">
    <slot></slot>
    <!-- <span
      ref="magnificationElement"
      class="preview"
      v-bind:style="{backgroundImage:'url(' + src + ')'}"
      @mousedown="clickPos"
    >
      <span
        ref="glass"
        class="magnifying-glass"
        v-bind:style="{backgroundImage: 'url(' + src + ')', backgroundPosition: backgroundPos, left: cursorX + 'px', top: cursorY + 'px'}"
      ></span>
    </span>-->

    <img ref="magnificationElement" class="preview" :src="src" @mousedown="clickPos" />

    <span
      v-if="active"
      ref="glass"
      class="magnifying-glass"
      v-bind:style="{backgroundImage: 'url(' + src + ')', backgroundPosition: backgroundPos, left: cursorX + 'px', top: cursorY + 'px'}"
    ></span>
  </div>
</template>
<script>
export default {
  name: 'Zoomer',
  props: {
    src: String,
    active: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      img: null,
      width: null,
      height: null,
      bounds: null,
      cursorX: 0,
      cursorY: 0,
      thumbPos: { x: 0, y: 0 },
      backgroundPos: '0 0'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.$refs.magnificationElement.addEventListener(
        'mousemove',
        this.moveMagnifier
      )
    })
  },
  methods: {
    getCursorPos: function (e) {
      var x = window.Event
        ? e.pageX
        : event.clientX +
          (document.documentElement.scrollLeft
            ? document.documentElement.scrollLeft
            : document.body.scrollLeft)
      var y = window.Event
        ? e.pageY
        : event.clientY +
          (document.documentElement.scrollTop
            ? document.documentElement.scrollTop
            : document.body.scrollTop)

      this.cursorX = x - this.thumbPos.x
      this.cursorY = y - this.thumbPos.y
    },
    getBounds: function () {
      var el = this.$refs.magnificationElement

      this.bounds = el.getBoundingClientRect()

      var xPos = 0
      var yPos = 0
      while (el) {
        var transform = this.getTransform(el)
        if (el.tagName == 'BODY') {
          // deal with browser quirks with body/window/document and page scroll
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft
          var yScroll = el.scrollTop || document.documentElement.scrollTop

          xPos +=
            el.offsetLeft - xScroll + el.clientLeft + parseInt(transform[0])
          yPos +=
            el.offsetTop - yScroll + el.clientTop + parseInt(transform[1])
        } else {
          // for all other non-BODY elements
          xPos +=
            el.offsetLeft -
            el.scrollLeft +
            el.clientLeft +
            parseInt(transform[0])
          yPos +=
            el.offsetTop - el.scrollTop + el.clientTop + parseInt(transform[1])
        }

        el = el.offsetParent
      }
      this.thumbPos = {
        x: xPos,
        y: yPos
      }
    },
    moveMagnifier: function (e) {
      e.preventDefault()

      this.getBounds()
      this.getCursorPos(e)

      this.backgroundPos =
        (this.cursorX * 100) / this.bounds.width +
        '% ' +
        (this.cursorY * 100) / this.bounds.height +
        '%'
    },
    getTransform: function (el) {
      var transform = window
        .getComputedStyle(el, null)
        .getPropertyValue('-webkit-transform')

      function rotate_degree (matrix) {
        if (matrix !== 'none') {
          var values = matrix
            .split('(')[1]
            .split(')')[0]
            .split(',')
          var a = values[0]
          var b = values[1]
          var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
        } else {
          var angle = 0
        }
        return angle < 0 ? (angle += 360) : angle
      }

      var results = transform.match(
        /matrix(?:(3d)\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*)), -{0,1}\d+\.?\d*\)|\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))\))/
      )

      var output = [0, 0, 0]
      if (results) {
        if (results[1] == '3d') {
          output = results.slice(2, 5)
        } else {
          results.push(0)
          output = results.slice(5, 9) // returns the [X,Y,Z,1] value;
        }

        output.push(rotate_degree(transform))
      }
      return output
    },
    clickPos (e) {
      console.log(this.cursorX, this.cursorY)
    }
  }
}
</script>

<style lang="scss">
// Magnifying glass options
$border-size: 3px; // Modify the border width of the magnifying glass component
$border-color: #666666; // Modify the border color of the magnifying glass component
$magnifier-width: 150px; // Modify the width of the magnifying glass component
$magnifier-height: 150px; // Modify the height of the magnifying glass component

.vue-magnifier-container {
  position: relative;
  .preview {
    position: relative;
    background: {
      repeat: no-repeat;
      size: contain;
      position: 50% 50%;
    }
    display: block;
    clear: both;
    margin: 0 auto;
    cursor: crosshair;

    &:hover {
      ~ .magnifying-glass {
        display: block;
      }
    }
  }

  .magnifying-glass {
    position: absolute;
    border: $border-size solid $border-color;
    border-radius: 50%;
    cursor: none;
    width: $magnifier-width;
    height: $magnifier-height;
    // transform: translate(($magnifier-width), ($magnifier-width));
    background: #fff no-repeat;
    display: none;
    pointer-events: none;
    transition: all 0.1s ease-in-out;
  }
}
</style>
