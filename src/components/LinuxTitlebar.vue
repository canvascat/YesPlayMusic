<template>
  <div class="linux-titlebar">
    <div class="logo">
      <img src="/img/logos/yesplaymusic-white24x24.png" />
    </div>
    <div class="title">{{ title }}</div>
    <div class="controls">
      <div class="button minimize codicon codicon-chrome-minimize" @click="windowMinimize"></div>
      <div class="button max-restore codicon" :class="{
        'codicon-chrome-restore': isMaximized,
        'codicon-chrome-maximize': !isMaximized,
      }" @click="windowMaxRestore"></div>
      <div class="button close codicon codicon-chrome-close" @click="windowClose"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@vscode/codicons/dist/codicon.css";
import { ref, computed } from "vue";

import { useStore } from "@/store/pinia";

const isMaximized = ref(false);

const title = computed(() => useStore().title);

if (window.IS_ELECTRON === true) {
	window.ipcRenderer?.on("isMaximized", (_, value) => {
		isMaximized.value = value;
	});
}

const windowMinimize = () => {
	window.ipcRenderer?.send("minimize");
};
const windowMaxRestore = () => {
	window.ipcRenderer?.send("maximizeOrUnmaximize");
};
const windowClose = () => {
	window.ipcRenderer?.send("close");
};
</script>

<style lang="scss" scoped>
.linux-titlebar {
  color: var(--color-text);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  --hover: #e6e6e6;
  --active: #cccccc;

  .logo {
    padding: 0 8px;
  }

  .title {
    padding: 8px;
    font-size: 12px;
    justify-self: center;
    margin: 0 auto;
  }

  .controls {
    height: 32px;
    //margin-left: auto;
    justify-content: flex-end;
    display: flex;

    .button {
      height: 100%;
      width: 46px;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-app-region: no-drag;

      &:hover {
        background: var(--hover);
      }

      &:active {
        background: var(--active);
      }

      &.close {
        &:hover {
          background: #c42c1b;
          color: rgba(255, 255, 255, 0.8);
        }

        &:active {
          background: #f1707a;
          color: #000;
        }
      }
    }
  }
}

[data-theme='dark'] .linux-titlebar {
  --hover: #191919;
  --active: #333333;
}
</style>
