<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import {
	ScrollAreaCorner,
	ScrollAreaRoot,
	type ScrollAreaRootProps,
	ScrollAreaViewport,
} from "reka-ui";
import { cn } from "@/lib/utils";
import ScrollBar from "./ScrollBar.vue";

const props = defineProps<
	ScrollAreaRootProps & {
		class?: HTMLAttributes["class"];
		viewportClass?: HTMLAttributes["class"];
		scrollBarClass?: HTMLAttributes["class"];
	}
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    v-bind="delegatedProps"
    :class="cn('relative', props.class)"
  >
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      :class="cn('focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1', props.viewportClass)"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollBar :class="props.scrollBarClass" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
