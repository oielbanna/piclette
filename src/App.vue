<template>
  <div id="app">
    <div
      class="home"
      :class="$store.state.paletteMode? 'palette' : 'dropper'"
      :style="{ 'background-color': $store.state.paletteMode? '#ba6d57':'#7FB0AF',
        'background': $store.state.card? $store.state.cardBg :  'linear-gradient(140deg, rgb(214, 186, 174) 0%, rgb(245, 242, 233))' // 'url(https://i.imgur.com/smHDpEy.png), linear-gradient(140deg, rgb(85, 163, 160) 25%,  rgb(230, 255, 254))'
      }"
      @dragover="entering"
      @dragleave="leaving"
      @drop="_dropped"
    >
      <main
        :class="{'mainBordered':  $store.state.card, 'mainBorderedDragging':$store.state.dragging || $store.state.loading }"
      >
        <transition name="slide-down">
          <div class="name-group">
            
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                v-show="$store.state.card"
                @click="$router.push({ path: '/'})"
              >
                <path
                  d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
                />
              </svg>

              <h1 id="app-name"  v-show="!$store.state.card">Piclette</h1>
  
          </div>
        </transition>
        <transition name="fade">
          <div v-show="$store.state.dragging" class="dropzone-overlay">
            <img
              :class="{'dropping':$store.state.dragging}"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNODYsNi44OGMtNDMuNjc0ODQsMCAtNzkuMTIsMzUuNjM2NzQgLTc5LjEyLDc1LjY4Yy0wLjAwMjY3LDEuMjk0NjcgMC43MjE3MiwyLjQ4MTIyIDEuODc0NTMsMy4wNzA0N2w0OS43MjU0NywzMS4wODc2NnYwLjI0MTg3djQ4LjE2aDU1LjA0di00OC40MDE4N2w0OS45MzM3NSwtMzEuMjA4NmMxLjAzNDUzLC0wLjYyMjY1IDEuNjY2OTIsLTEuNzQyMDggMS42NjYyNSwtMi45NDk1M2MwLC00MC4wNDMyNiAtMzUuNDQ1MTYsLTc1LjY4IC03OS4xMiwtNzUuNjh6TTc2LjQzOTIyLDE0LjQ3MjE5Yy0xMS44MDA2MSwxMy4zMjYyMSAtMTkuNDE5NDEsMzUuMjU2NDcgLTIxLjA0MzEyLDU4LjcwODQ0Yy01LjI4NTk1LC00LjgyNzgyIC0xMi42ODYyOSwtNy44MjA2MyAtMjAuOTk2MSwtNy44MjA2M2MtNy41MzAzNywwIC0xNC4yNTE5NywyLjU1NzE1IC0xOS40NjQyMiw2LjU2NDIyYzUuMDk1MjMsLTI4LjY3MTM0IDMwLjAxNTQ4LC01My4yMjgzNiA2MS41MDM0NCwtNTcuNDUyMDN6TTk1LjU2MDc4LDE0LjQ3MjE5YzMxLjQ4Nzk2LDQuMjIzNjcgNTYuNDA4MjEsMjguNzgwNjkgNjEuNTAzNDQsNTcuNDUyMDNjLTUuMjEyMjUsLTQuMDA3MDYgLTExLjkzMzg1LC02LjU2NDIyIC0xOS40NjQyMiwtNi41NjQyMmMtOC4zMDk4MSwwIC0xNS43MTAxNSwyLjk5MjgxIC0yMC45OTYxLDcuODIwNjNjLTEuNjIzNzIsLTIzLjQ1MTk3IC05LjI0MjUyLC00NS4zODIyMyAtMjEuMDQzMTIsLTU4LjcwODQ0ek04NiwxNC43MzQyMmMxMi4wODAwOSwxMC4yNjE2OSAyMS42OTc5OSwzMy4zNjI2NSAyMy42NzY4Nyw1OC40Mzk2OWMtNS45NjcwMiwtNC44NjkzNCAtMTQuMzA2NTIsLTcuODEzOSAtMjMuNjc2ODcsLTcuODEzOWMtOS4zNzAzNSwwIC0xNy43MDk4NiwyLjk0NDU2IC0yMy42NzY4Nyw3LjgxMzljMS45Nzg4OSwtMjUuMDc3MDMgMTEuNTk2NzgsLTQ4LjE3OCAyMy42NzY4NywtNTguNDM5Njl6TTM0LjQsNzIuMjRjOS45NDM4MSwwIDE4LjA4MzcxLDUuMjEzODggMjAuOTI4OSwxMS43MDQwNmMwLjA5MTc4LDAuMjEwMDIgMC4yMDQzMiwwLjQxMDMzIDAuMzM1OTQsMC41OTc5N2wxNy4zODE0LDI4Ljk3Nzk3aC02LjY5ODZsLTUxLjQxMTg3LC0zMi4xMjkwNmMzLjY0NTksLTUuMjQ2NiAxMC44NzA2NywtOS4xNTA5NCAxOS40NjQyMiwtOS4xNTA5NHpNODYsNzIuMjRjMTAuNzQ3ODYsMCAxOS42MzE0NSw0LjY0MDMxIDIzLjQ4ODc1LDEwLjM2MDMxbC0xOC41NTcxOSwzMC45MTk2OWgtOS44NjMxM2wtMTguNTU3MTksLTMwLjkxOTY5YzMuODU3MywtNS43MiAxMi43NDA4OSwtMTAuMzYwMzEgMjMuNDg4NzUsLTEwLjM2MDMxek0xMzcuNiw3Mi4yNGM4LjU5MzU1LDAgMTUuODE4MzIsMy45MDQzNCAxOS40NjQyMiw5LjE1MDk0bC01MS40MTE4NywzMi4xMjkwNmgtNi42OTg2bDE3LjQ0ODYsLTI5LjA3ODc1YzAuMTAzMDcsLTAuMTU4MDggMC4xOTI5NSwtMC4zMjQzNyAwLjI2ODc1LC0wLjQ5NzE5YzIuODQ1MiwtNi40OTAxOSAxMC45ODUxLC0xMS43MDQwNiAyMC45Mjg5LC0xMS43MDQwNnpNNjUuMzYsMTIwLjRoMTMuNjUyNWgyNy42Mjc1djM3Ljg0aC00MS4yOHpNNzkuMTIsMTI3LjI4Yy0xLjI0MDU5LC0wLjAxNzU0IC0yLjM5NDUyLDAuNjM0MjUgLTMuMDE5OTMsMS43MDU4Yy0wLjYyNTQxLDEuMDcxNTUgLTAuNjI1NDEsMi4zOTY4NCAwLDMuNDY4MzljMC42MjU0MSwxLjA3MTU1IDEuNzc5MzUsMS43MjMzNSAzLjAxOTkzLDEuNzA1OGgxMy43NmMxLjI0MDU5LDAuMDE3NTQgMi4zOTQ1MiwtMC42MzQyNSAzLjAxOTkzLC0xLjcwNThjMC42MjU0MSwtMS4wNzE1NSAwLjYyNTQxLC0yLjM5Njg0IDAsLTMuNDY4MzljLTAuNjI1NDEsLTEuMDcxNTUgLTEuNzc5MzUsLTEuNzIzMzUgLTMuMDE5OTMsLTEuNzA1OHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="
            />
            <img src="./assets/drop.png" />
          </div>
        </transition>
        <transition name="fade">
          <!-- <Spinner v-show="$store.state.loading" /> -->
        </transition>
        <div class="container">
          <router-view />
        </div>
        <!-- <Mode style="display:none" /> -->
      </main>
    </div>
  </div>
</template>

<script>
// import Mode from '@/components/Mode'

export default {
  components: {
    // Mode
  },
  methods: {
    entering (e) {
      e.preventDefault()
      this.$store.state.dragging = true
    },
    leaving (e) {
      e.preventDefault()
      this.$store.state.dragging = false
    },
    _dropped (e) {
      e.preventDefault()
      this.$store.state.dragging = false
    }
  }
}
</script>

<style lang="scss">
$color1: #ba6d57;
$color2: #7fb0af;

.home {
  height: 100vh;
  overflow: hidden;
  position: relative;
  transition: all 1s ease;
  z-index: 1;

  &::after {
    transition: all 0.3s ease-in-out;
    // content: "";
    position: absolute;
    z-index: -1;
  }
}

.palette {
  &::after {
    animation: c2toc1 0.3s forwards normal;
    height: 54px;
    width: 54px;
    top: 90%;
    right: 55%;
    border-radius: 50%;
  }
}

.dropper {
  &::after {
    animation: c1toc2 0.3s forwards normal;
    height: 54px;
    width: 54px;
    top: 90%;
    right: 45%;
    border-radius: 50%;
  }
}
@keyframes c1toc2 {
  0% {
    background-color: $color1;
  }
  100% {
    background-color: $color2;
    width: 100vw;
    height: 100vh;
    top: 0;
    right: 0;
    border-radius: 0px;
  }
}

@keyframes c2toc1 {
  0% {
    background-color: $color2;
  }
  100% {
    background-color: $color1;
    width: 100vw;
    height: 100vh;
    top: 0;
    right: 0;
    border-radius: 0px;
  }
}

main {
  position: relative;
  height: 100%;
  transition: all 0.2s ease-in-out;
  overflow: hidden;

  .name-group {
    position: absolute;
    top: 20px;
    left: 20px;

    svg {
      transform: rotateY(180deg);
      fill: #7fb0af;
      cursor: pointer;
    }

    #app-name {
      position: relative;
      font-size: 1.8rem;
      margin: 0px;
      text-transform: uppercase;

      &::after {
        // content: "";
        position: absolute;
        left: -5px;
        width: 3.2rem;
        background: rgba(127, 176, 175, 0.7);
        z-index: 1;
        height: 35%;
      }
    }
  }
}

.mainBordered {
  background-color: #f3f3f3;
  margin: 5rem 3rem;
  height: calc(100% - 10rem);
  border-radius: 4px;
  box-shadow: 0px 4px 13px -2px rgba(0, 0, 0, 0.6);
}

.mainBorderedDragging {
  margin: 2rem 1rem;
  height: calc(100% - 4rem);
  background-color: #f3f3f3;
  border-radius: 4px;
  box-shadow: 0px 4px 13px -2px rgba(0, 0, 0, 0.6);
}

.container {
  text-align: center;
  height: 100%;
}
@media screen and (max-width: 450px) {
  header h1 {
    font-size: 9vw;
  }

  .mainBordered {
    margin: 2rem 1rem;
    height: calc(100% - 4rem);
  }
}
</style>
