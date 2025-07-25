<template>
  <Modal class="add-playlist-modal" :show="show" :close="close" title="新建歌单" width="25vw">
    <template v-slot:default>
      <input v-model="title" type="text" placeholder="歌单标题" maxlength="40" />
      <div class="checkbox">
        <input id="checkbox-private" v-model="privatePlaylist" type="checkbox" />
        <label for="checkbox-private">设置为隐私歌单</label>
      </div>
    </template>
    <template v-slot:footer>
      <button class="primary block" @click="_createPlaylist">创建</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import { useStore } from "@/store/pinia";
import * as api from "@/api";
import { toast } from "vue-sonner";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useModalStore } from "@/store/modal";

const { t } = useI18n();
const modalStore = useModalStore();
const title = ref("");
const privatePlaylist = ref(false);
const { updateData, fetchLikedPlaylist } = useStore();

const show = computed(() => modalStore.show.newPlaylist);

function close() {
	modalStore.closeNewPlaylist();
	title.value = "";
	privatePlaylist.value = false;
}

function _createPlaylist() {
	api.playlist
		.createPlaylist({ name: title.value, privacy: privatePlaylist.value ? 10 : 0 })
		.then((data) => {
			if (data.code === 200) {
				if (modalStore.afterCreateAddTrackID !== 0) {
					api.playlist
						.addOrRemoveTrackFromPlaylist({
							op: "add",
							pid: data.id,
							tracks: `${modalStore.afterCreateAddTrackID}`,
						})
						.then((data) => {
							if (data.body.code === 200) {
								toast(t("toast.savedToPlaylist"));
							} else {
								toast(data.body.message);
							}
						});
				}
				close();
				toast("成功创建歌单");
				updateData({ key: "libraryPlaylistFilter", value: "mine" });
				fetchLikedPlaylist();
			}
		});
}
</script>

<style lang="scss" scoped>
.add-playlist-modal {
  .content {
    display: flex;
    flex-direction: column;

    input {
      margin-bottom: 12px;
    }

    input[type='text'] {
      width: calc(100% - 24px);
      flex: 1;
      background: var(--color-secondary-bg-for-transparent);
      font-size: 16px;
      border: none;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 8px;
      margin-top: -1px;
      color: var(--color-text);

      &:focus {
        background: var(--color-primary-bg-for-transparent);
        opacity: 1;
      }

      [data-theme='light'] &:focus {
        color: var(--color-primary);
      }
    }

    .checkbox {
      input[type='checkbox' i] {
        margin: 3px 3px 3px 4px;
      }

      display: flex;
      align-items: center;

      label {
        font-size: 12px;
      }

      user-select: none;
    }
  }
}
</style>
