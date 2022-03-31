<template>
  <div
    v-for="(i, index) in listItemNum"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="list-item"
      :style="[
        { backgroundColor: bgColors[index], zIndex: index, minHeight: listItemHeight },
        itemTranslateCSS(index),
      ]"
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
import { ref, computed, watch, ComputedRef } from 'vue';
import { generateRandomColors } from '@/utils/randomColors';

const initTranslate: number = 0;
const itemTranslate = ref<Number>(initTranslate);
const itemTranslateCSS = (index: number): string => {
  if (isTouching.value && Math.abs(Number(distanceSwiped.value)) > 0) {
    // calculate the offset value depend on the index of the element
    const offSetY =
      Number(itemTranslate.value) + (index * Number(listItemHeight.value.slice(0, 3))) / 2;
    return `transform: translate3D(0, ${offSetY}px, 0)`;
  }
  return `transform: translate3D(0, ${itemTranslate.value}px, 0)`;
};

const listItemNum = ref<Number>(20);
const listItemHeight = ref<String>('100px');
const firstListItem = ref<HTMLElement>(document.createElement('div'));
const lastListItem = ref<HTMLElement>(document.createElement('div'));

const viewPortHeight =
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

let isFirstItemScrollToTop = ref<Boolean>(true);
let isLastItemScrollToBottom = ref<Boolean>(false);

const getFirstAndLastItemPosition = (): void => {
  const firstItemPosition: number = firstListItem.value.getBoundingClientRect().y;
  const lastItemPosition: number = Math.floor(lastListItem.value.getBoundingClientRect().y);
  isFirstItemScrollToTop.value = firstItemPosition >= 0;
  isLastItemScrollToBottom.value =
    lastItemPosition + lastListItem.value.offsetHeight <= viewPortHeight;
};

let touchStartY = ref<Number>(0);
let touchingY = ref<Number>(0);
let touchEndY = ref<Number>(0);
let distanceSwiped = ref<Number>(0);

watch(distanceSwiped, (newDistance, oldDistance) => {
  itemTranslate.value = newDistance;
});

const isTouching = ref<Boolean>(false);
const enlargeTranslate = (): void => {
  itemTranslate.value = distanceSwiped.value;
};

const onTouchStart = (event: TouchEvent): void => {
  isTouching.value = true;
  // get the start position of touch event
  touchStartY.value = getTouchPosition(event);
  getFirstAndLastItemPosition();
};
const onTouchMove = (event: TouchEvent): void => {
  isTouching.value = true;
  // update the touching position during the event
  touchingY.value = getTouchPosition(event);
  getFirstAndLastItemPosition();
  // if the first element is already scrolled to top and keep swiping down, enlarge the translate
  if (isFirstItemScrollToTop.value || isLastItemScrollToBottom.value) {
    updateSwipeDistance(event);
    enlargeTranslate();
  }
};
const onTouchEnd = (event: TouchEvent): void => {
  isTouching.value = false;
  touchEndY.value = getTouchPosition(event);
  getFirstAndLastItemPosition();
  // reset the translate to init
  itemTranslate.value = initTranslate;
};

const getTouchPosition = (event: TouchEvent): Number => {
  if (event.type === 'touchend') {
    return event.changedTouches[0].clientY;
  } else {
    return event.touches[0].clientY;
  }
};

const updateSwipeDistance = (event: TouchEvent): void => {
  switch (event.type) {
    case 'touchmove':
      distanceSwiped.value = Number(touchingY.value) - Number(touchStartY.value);
      break;
    case 'touchend':
      distanceSwiped.value = Number(touchEndY.value) - Number(touchStartY.value);
      break;
  }
};

const bgColors = ref(generateRandomColors(Number(listItemNum.value)));
</script>

<style lang="less" scoped>
.list-item {
  width: 100%;
  min-height: 10vh;
  box-shadow: -20px -10px 19px 13px rgb(0 0 0 / 10%);
  border-radius: 8px;
  margin-bottom: -20px;
}
</style>
