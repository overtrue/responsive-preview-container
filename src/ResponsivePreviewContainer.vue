<template>
  <div class="responsive-preview-container">
    <div
      class="flex items-end justify-center bg-white p-2 h-16 fixed top-0 w-full right-0 z-50 shadow"
    >
      <a
        class="inline-block text-center cursor-pointer select-none mr-8"
        :class="activeScreen === 'xs' ? 'text-gray-800' : 'text-gray-500'"
        @click="activeScreen = 'xs'"
      >
        <svg
          width="13"
          height="20"
          viewBox="0 0 13 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 0v20H0V0h13zm-1 1H1v18h11V1z"
            fill="currentColor"
            fill-rule="nonzero"
          />
        </svg>
        <div class="text-xs">xs</div>
      </a>
      <a
        class="inline-block text-center cursor-pointer select-none mr-8"
        :class="activeScreen === 'sm' ? 'text-gray-800' : 'text-gray-500'"
        @click="activeScreen = 'sm'"
      >
        <svg
          width="17"
          height="20"
          viewBox="0 0 17 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 0v20H0V0h17zm-1 1H1v18h15V1z"
            fill="currentColor"
            fill-rule="nonzero"
          />
        </svg>
        <div class="text-xs">sm</div>
      </a>
      <a
        class="inline-block text-center cursor-pointer select-none mr-8"
        :class="activeScreen === 'md' ? 'text-gray-800' : 'text-gray-500'"
        @click="activeScreen = 'md'"
      >
        <svg
          width="24"
          height="20"
          viewBox="0 0 24 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 0v20H0V0h24zm-1 1H1v18h22V1z"
            fill="currentColor"
            fill-rule="nonzero"
          />
        </svg>
        <div class="text-xs">md</div>
      </a>
      <a
        class="inline-block text-center cursor-pointer select-none mr-8"
        :class="activeScreen === 'lg' ? 'text-gray-800' : 'text-gray-500'"
        @click="activeScreen = 'lg'"
      >
        <svg
          width="31"
          height="20"
          viewBox="0 0 31 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill-rule="evenodd" fill="currentColor">
            <path d="M29 1v16H2V1h27zm-1 1H3v14h25V2z" fill-rule="nonzero" />
            <path d="M0 19h31v1H0z" />
          </g>
        </svg>
        <div class="text-xs">lg</div>
      </a>
      <a
        class="inline-block text-center cursor-pointer select-none"
        :class="activeScreen === 'xl' ? 'text-gray-800' : 'text-gray-500'"
        @click="activeScreen = 'xl'"
      >
        <svg
          width="27"
          height="20"
          viewBox="0 0 27 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="currentColor" fill-rule="evenodd">
            <path d="M27 1v16H0V1h27zm-1 1H1v14h25V2z" fill-rule="nonzero" />
            <path d="M7 19h13v1H7z" />
          </g>
        </svg>
        <div class="text-xs">xl</div>
      </a>
    </div>

    <div
      ref="container"
      class="overflow-hidden absolute inset-0 bg-gray-300 mt-16 p-8"
    >
      <iframe
        src
        ref="iframe"
        class="border-none h-full m-auto absolute inset-0"
        style="transition: width 0.2s ease 0s; width: 0px; transform:scale(1);transform-origin: center;"
      ></iframe>
      <div
        v-if="scale < 1"
        class="absolute rounded bottom-0 right-0 p-3 m-4 bg-gray-900 text-gray-500 opacity-50 shadow"
      >
        Scale {{ parseInt(this.scale * 100) }}%
      </div>
    </div>
    <pre ref="code" class="hidden">
      <slot />
    </pre>
  </div>
</template>

<script>
require("./tailwind.css");

export default {
  data() {
    return {
      activeScreen: "xs",
      breakpoints: {
        xs: 640,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1500
      },
      scale: 1
    };
  },

  watch: {
    activeScreen() {
      this.updateIframeSize();
    }
  },
  methods: {
    getContainerWidth() {
      return this.$refs["container"].offsetWidth;
    },
    getContainerHeight() {
      return this.$refs["container"].offsetHeight;
    },
    setDefaultScreen() {
      for (const size in this.breakpoints) {
        if (this.getContainerWidth() >= this.breakpoints[size]) {
          this.activeScreen = size;
        }
      }
    },
    updateIframeSize() {
      const containerWidth = this.getContainerWidth() - 64;
      const targetSize = this.breakpoints[this.activeScreen] - 1;
      const realScale = containerWidth / targetSize;
      this.scale = realScale > 1 ? 1 : realScale;

      this.$refs["iframe"].style.width = targetSize + "px";
      this.$refs["iframe"].style.transform = `scale(${this.scale})`;
      this.$refs["iframe"].style.transformOrigin =
        realScale > 1 ? "center" : "left";
    },
    updateIframeContent() {
      const code = this.$refs["code"].innerHTML;

      const html = `<html class="flex w-full h-full flex-col">
                  <head>
                    <meta charset="UTF-8" />
                    <link
                      href="https://unpkg.com/tailwindcss@1.1.4/dist/tailwind.min.css"
                      rel="stylesheet"
                    />
                  </head>

                  <body class="flex-1 items-center justify-center my-auto">
                    ${code}
                  </body>
                </html>`;
      this.$refs["iframe"].src = "data:text/html," + encodeURIComponent(html);
    },
    registerCodeObserver() {
      this.observer = new MutationObserver(
        function(mutations) {
          this.updateIframeSize();
          this.updateIframeContent();
        }.bind(this)
      );

      // Setup the observer
      this.observer.observe(this.$refs["code"], {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setDefaultScreen();
      this.updateIframeContent();
      this.updateIframeSize();
      this.registerCodeObserver();
    });

    window.onresize = this.updateIframeSize;
  },
  beforeDestroy: function() {
    this.observer.disconnect();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
</style>
