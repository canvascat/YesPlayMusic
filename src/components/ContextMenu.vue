<template>
  <div class="context-menu">
    <div v-if="state.showMenu" ref="menuRef" class="menu" tabindex="-1" :style="{ top: state.top, left: state.left }"
      @blur="closeMenu" @click="closeMenu">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
	name: "ContextMenu",
});

const emit = defineEmits<{
	closeMenu: [];
}>();

import { useStore } from "@/store/pinia";
import { nextTick, reactive, ref } from "vue";

const { player } = useStore();

const menuRef = ref<HTMLDivElement | null>(null);

const state = reactive({
	showMenu: false,
	top: "0px",
	left: "0px",
});

function setMenu(top: number, left: number) {
	let heightOffset = player.enabled ? 64 : 0;
	let largestHeight = window.innerHeight - menuRef.value!.offsetHeight - heightOffset;
	let largestWidth = window.innerWidth - menuRef.value!.offsetWidth - 25;
	if (top > largestHeight) top = largestHeight;
	if (left > largestWidth) left = largestWidth;
	state.top = top + "px";
	state.left = left + "px";
}

function closeMenu() {
	state.showMenu = false;
	emit("closeMenu");
}

function openMenu(e: MouseEvent) {
	state.showMenu = true;
	nextTick(() => {
		menuRef.value!.focus();
		setMenu(e.y, e.x);
	});
	e.preventDefault();
}

defineExpose({
	openMenu,
	closeMenu,
});
</script>

<style lang="scss" scoped>
.context-menu {
  width: 100%;
  height: 100%;
  user-select: none;
}

.menu {
  position: fixed;
  min-width: 136px;
  max-width: 240px;
  list-style: none;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 6px;
  z-index: 1000;
  -webkit-app-region: no-drag;
  transition: background 125ms ease-out, opacity 125ms ease-out,
    transform 125ms ease-out;

  &:focus {
    outline: none;
  }
}

[data-theme='dark'] {
  .menu {
    background: rgba(36, 36, 36, 0.78);
    backdrop-filter: blur(16px) contrast(120%) brightness(60%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.08);
  }

  .menu .item:hover {
    color: var(--color-text);
  }
}

@supports (-moz-appearance: none) {
  .menu {
    background-color: var(--color-body-bg) !important;
  }
}

.menu .item {
  font-weight: 600;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: default;
  color: var(--color-text);
  display: flex;
  align-items: center;

  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-bg-for-transparent);
    transition: opacity 125ms ease-out, transform 125ms ease-out;
  }

  &:active {
    opacity: 0.75;
    transform: scale(0.95);
  }

  .svg-icon {
    height: 16px;
    width: 16px;
    margin-right: 5px;
  }
}

hr {
  margin: 4px 10px;
  background: rgba(128, 128, 128, 0.18);
  height: 1px;
  box-shadow: none;
  border: none;
}

.item-info {
  padding: 10px 10px;
  display: flex;
  align-items: center;
  color: var(--color-text);
  cursor: default;

  img {
    height: 38px;
    width: 38px;
    border-radius: 4px;
  }

  .info {
    margin-left: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  .subtitle {
    font-size: 12px;
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
