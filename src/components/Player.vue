<template>
  <div class="player" @click="toggleLyrics">
    <div class="progress-bar" :class="{
      nyancat: settings.nyancatStyle,
      'nyancat-stop': settings.nyancatStyle && !player.playing,
    }" @click.stop>
      <VueSlider :model-value="progress" @update:model-value="updateProgress" :min="0" :max="player.currentTrackDuration" :interval="1"
        :drag-on-click="true" :duration="0" :dot-size="12" :height="2" :tooltip-formatter="formatTrackTime" :lazy="true"
        :silent="true"></VueSlider>
    </div>
    <div class="controls">
      <div class="playing">
        <div class="container" @click.stop>
          <img :src="resizeImage(currentTrack.al && currentTrack.al.picUrl, 224)" loading="lazy" @click="goToAlbum" />
          <div class="track-info" :title="audioSource">
            <div :class="['name', { 'has-list': hasList() }]" @click="hasList() && goToList()">
              {{ currentTrack.name }}
            </div>
            <div class="artist">
              <span v-for="(ar, index) in currentTrack.ar" :key="ar.id" @click="ar.id && goToArtist(ar.id)">
                <span :class="{ ar: ar.id }"> {{ ar.name }} </span><span v-if="index !== currentTrack.ar.length - 1">,
                </span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <button-icon :title="player.isCurrentTrackLiked
                ? $t('player.unlike')
                : $t('player.like')
              " v-on:click="likeATrack(player.currentTrack.id)">
              <svg-icon v-show="!player.isCurrentTrackLiked" icon-class="heart"></svg-icon>
              <svg-icon v-show="player.isCurrentTrackLiked" icon-class="heart-solid"></svg-icon>
            </button-icon>
          </div>
        </div>
        <div class="blank"></div>
      </div>
      <div class="middle-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <button-icon v-show="!player.isPersonalFM" :title="$t('player.previous')" v-on:click="playPrevTrack"><svg-icon
              icon-class="previous" /></button-icon>
          <button-icon v-show="player.isPersonalFM" title="不喜欢" v-on:click="moveToFMTrash"><svg-icon
              icon-class="thumbs-down" /></button-icon>
          <button-icon class="play" :title="$t(player.playing ? 'player.pause' : 'player.play')"
            v-on:click="playOrPause">
            <svg-icon :icon-class="player.playing ? 'pause' : 'play'" /></button-icon>
          <button-icon :title="$t('player.next')" v-on:click="playNextTrack"><svg-icon
              icon-class="next" /></button-icon>
        </div>
        <div class="blank"></div>
      </div>
      <div class="right-control-buttons">
        <div class="blank"></div>
        <div class="container" @click.stop>
          <button-icon :title="$t('player.nextUp')" :class="{
            active: $route.name === 'next',
            disabled: player.isPersonalFM,
          }" v-on:click="goToNextTracksPage"><svg-icon icon-class="list" /></button-icon>
          <button-icon :class="{
            active: player.repeatMode !== 'off',
            disabled: player.isPersonalFM,
          }" :title="player.repeatMode === 'one'
                ? $t('player.repeatTrack')
                : $t('player.repeat')
              " v-on:click="switchRepeatMode">
            <svg-icon v-show="player.repeatMode !== 'one'" icon-class="repeat" />
            <svg-icon v-show="player.repeatMode === 'one'" icon-class="repeat-1" />
          </button-icon>
          <button-icon :class="{ active: player.shuffle, disabled: player.isPersonalFM }" :title="$t('player.shuffle')"
            v-on:click="switchShuffle"><svg-icon icon-class="shuffle" /></button-icon>
          <button-icon v-if="settings.enableReversedMode"
            :class="{ active: player.reversed, disabled: player.isPersonalFM }" :title="$t('player.reversed')"
            v-on:click="switchReversed"><svg-icon icon-class="sort-up" /></button-icon>
          <div class="volume-control">
            <button-icon :title="$t('player.mute')" v-on:click="mute">
              <svg-icon v-show="volume > 0.5" icon-class="volume" />
              <svg-icon v-show="volume === 0" icon-class="volume-mute" />
              <svg-icon v-show="volume <= 0.5 && volume !== 0" icon-class="volume-half" />
            </button-icon>
            <div class="volume-bar">
              <VueSlider v-model="volume" :min="0" :max="1" :interval="0.01" :drag-on-click="true" :duration="0"
                tooltip="none" :dot-size="12"></VueSlider>
            </div>
          </div>

          <button-icon class="lyrics-button" title="歌词" style="margin-left: 12px" v-on:click="toggleLyrics"><svg-icon
              icon-class="arrow-up" /></button-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/pinia";
import "@/assets/css/slider.css";

import ButtonIcon from "@/components/ButtonIcon.vue";
import VueSlider from "vue-slider-component";
import { goToListSource, hasListSource } from "@/utils/playList";
import { formatTrackTime } from "@/utils/common";
import { resizeImage } from "@/utils/filters";
import { computed, onMounted, onBeforeMount, ref, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRafFn } from "@vueuse/core";

const { player, settings, toggleLyrics, likeATrack } = useStore();

const currentTrack = computed(() => player.currentTrack);
const volume = computed({
	get() {
		return player.volume;
	},
	set(value) {
		player.volume = value;
	},
});

const audioSource = computed(() => player.audioSource);
const route = useRoute();
const router = useRouter();

// TODO
const progress = ref(player.progress);
useRafFn(() => {
	progress.value = player.progress;
});
function updateProgress(value: number) {
	player.progress = value;
	progress.value = value;
}

onMounted(() => {
	Object.assign(window, { player });
	setupMediaControls();
	window.addEventListener("keydown", handleKeydown);
});
onBeforeMount(() => {
	window.removeEventListener("keydown", handleKeydown);
});

function playPrevTrack() {
	player.playPrevTrack();
}
function playOrPause() {
	player.playOrPause();
}
function playNextTrack() {
	if (player.isPersonalFM) {
		player.playNextFMTrack();
	} else {
		player.playNextTrack();
	}
}
function goToNextTracksPage() {
	if (player.isPersonalFM) return;
	route.name === "next" ? router.go(-1) : router.push({ name: "next" });
}

function hasList() {
	return hasListSource();
}
function goToList() {
	goToListSource();
}
function goToAlbum() {
	if (!player.currentTrack?.al?.id) return;
	router.push({ path: "/album/" + player.currentTrack.al.id });
}
function goToArtist(id: number) {
	router.push({ path: "/artist/" + id });
}
function moveToFMTrash() {
	player.moveToFMTrash();
}
function switchRepeatMode() {
	player.switchRepeatMode();
}
function switchShuffle() {
	player.switchShuffle();
}
function switchReversed() {
	player.switchReversed();
}
function mute() {
	player.mute();
}

function setupMediaControls() {
	if ("mediaSession" in navigator) {
		navigator.mediaSession.setActionHandler("play", () => {
			playOrPause();
		});
		navigator.mediaSession.setActionHandler("pause", () => {
			playOrPause();
		});
		navigator.mediaSession.setActionHandler("previoustrack", () => {
			playPrevTrack();
		});
		navigator.mediaSession.setActionHandler("nexttrack", () => {
			playNextTrack();
		});
	}
}

function handleKeydown(event: KeyboardEvent) {
	switch (event.code) {
		case "MediaPlayPause":
			playOrPause();
			break;
		case "MediaTrackPrevious":
			playPrevTrack();
			break;
		case "MediaTrackNext":
			playNextTrack();
			break;
		default:
			break;
	}
}
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  // background-color: rgba(255, 255, 255, 0.86);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}

@supports (-moz-appearance: none) {
  .player {
    background-color: var(--color-body-bg);
  }
}

.progress-bar {
  margin-top: -6px;
  margin-bottom: -6px;
  width: 100%;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;

  padding: {
    right: 10vw;
    left: 10vw;
  }
}

@media (max-width: 1336px) {
  .controls {
    padding: 0 5vw;
  }
}

.blank {
  flex-grow: 1;
}

.playing {
  display: flex;
}

.playing .container {
  display: flex;
  align-items: center;

  img {
    height: 46px;
    border-radius: 5px;
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    user-select: none;
  }

  .track-info {
    height: 46px;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .name {
      font-weight: 600;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    .has-list {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .artist {
      font-size: 12px;
      opacity: 0.58;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;

      span.ar {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.middle-control-buttons {
  display: flex;
}

.middle-control-buttons .container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;

  .button-icon {
    margin: 0 8px;
  }

  .play {
    height: 42px;
    width: 42px;

    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
}

.right-control-buttons {
  display: flex;
}

.right-control-buttons .container {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .expand {
    margin-left: 24px;

    .svg-icon {
      height: 24px;
      width: 24px;
    }
  }

  .active .svg-icon {
    color: var(--color-primary);
  }

  .volume-control {
    margin-left: 4px;
    display: flex;
    align-items: center;

    .volume-bar {
      width: 84px;
    }
  }
}

.like-button {
  margin-left: 16px;
}

.button-icon.disabled {
  cursor: default;
  opacity: 0.38;

  &:hover {
    background: none;
  }

  &:active {
    transform: unset;
  }
}
</style>
