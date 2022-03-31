<template>
  <div
    v-for="(i, index) in listItemNum"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="list-item"
      :style="{ backgroundColor: bgColors[index], zIndex: index }"
      :ref="
        (div) => {
          if (index === 0) {
            firstListItem = div;
          } else if (index === listItemNum - 1) {
            lastListItem = div;
          }
        }
      "
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, ComputedRef } from 'vue';
import { generateRandomColors } from '@/utils/randomColors';

const initMargin = reactive<Number>(20);
const initMarginCSS: ComputedRef = computed(() => {
  return `-${initMargin}px`;
});

const listItemNum = ref<Number>(20);
const firstListItem = ref<HTMLElement>(document.createElement('div'));
const lastListItem = ref<HTMLElement>(document.createElement('div'));

const viewPortHeight =
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

let touchStartY = reactive<Number>(0);
let touchingY = reactive<Number>(0);
let touchEndY = reactive<Number>(0);
let isFirstItemScrollToTop = reactive<Boolean>(true);
let isLastItemScrollToBottom = reactive<Boolean>(false);

const getFirstAndLastItemPosition = (): void => {
  const firstItemPosition: number = firstListItem.value.getBoundingClientRect().y;
  const lastItemPosition: number = Math.floor(lastListItem.value.getBoundingClientRect().y);
  isFirstItemScrollToTop = firstItemPosition > 0;
  isLastItemScrollToBottom = lastItemPosition + lastListItem.value.offsetHeight <= viewPortHeight;
};

const onTouchStart = (event: TouchEvent): void => {
  touchStartY = getTouchPosition(event);
  getFirstAndLastItemPosition();
};
const onTouchMove = (event: TouchEvent): void => {
  touchingY = getTouchPosition(event);
  getFirstAndLastItemPosition();
};
const onTouchEnd = (event: TouchEvent): void => {
  touchEndY = getTouchPosition(event);
  getFirstAndLastItemPosition();
};

const getTouchPosition = (event: TouchEvent): Number => {
  if (event.type === 'touchend') {
    return event.changedTouches[0].clientY;
  } else {
    return event.touches[0].clientY;
  }
};

const bgColors = ref(generateRandomColors(Number(listItemNum.value)));
</script>

<style lang="less" scoped>
.list-item {
  width: 100%;
  min-height: 10vh;
  margin-bottom: v-bind(initMarginCSS);
  box-shadow: -20px -10px 19px 13px rgb(0 0 0 / 10%);
  border-radius: 8px;
}
</style>
