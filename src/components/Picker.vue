<template>
  <div class="colorMode-container">
    <p class="option" v-for="(c,i) in formattedOptions" :key="i" :ref="i" @click.stop="change(i)">
      <template v-if="showText">{{c.text.toUpperCase()}}</template>
      <template v-if="c.icon !== undefined">
        <Tooltip :hoverText="c.text" mode="top">
          <img class="option-icon" :src="c.icon" />
        </Tooltip>
      </template>
    </p>
  </div>
</template>
<script>
export default {
  name: 'picker',
  props: {
    options: {
      type: Array,
      default: () => { return [] }
    },
    initialSelect: {
      type: Number,
      default: 0
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  date () {
    return {
      selected: this.$props.options[this.$props.initialSelect]
    }
  },
  computed: {
    formattedOptions () {
      return this.$props.options.map((element, i) => {
        return { ...element, id: i }
      })
    }
  },
  mounted () {
    this.updateDot(this.formattedOptions[this.$props.initialSelect].id)
  },
  methods: {
    change (el) {
      this.selected = this.$refs[el][0].innerText.toLowerCase()
      this.updateDot(el)
      this.$emit('change', this.selected)
    },
    updateDot (selected) {
      this.formattedOptions.forEach((element, i) => {
        if (element.id === selected) {
          this.$refs[i][0].id = 'selected'
        } else this.$refs[i][0].id = ''
      })
    }
  }
}
</script>
<style lang="scss">
.colorMode-container {
  display: flex;
  width: 100%;

  .option {
    position: relative;
    font-weight: 400;
    cursor: pointer;
    flex-grow: 1;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    top: 0px;
    transition: all 0.1s ease-in-out;

    &::after {
      position: absolute;
      content: " ";
      background: rgb(127, 176, 175);
      border-radius: 100%;
      width: 6px;
      height: 6px;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: all 0.2s ease-in-out;
    }

    .option-icon {
      height: 24px;
    }
  }
}

#selected {
  top: -4px;
  font-weight: 600;
  &::after {
    bottom: -6px;
    opacity: 1;
  }
}

@media screen and (max-width: 450px) {
  .colorMode-container {
    .option {
      .option-icon {
        height: 20px;
      }
    }
  }
}
</style>
