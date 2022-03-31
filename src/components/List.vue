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
import { ref, computed, ComputedRef } from 'vue';
import { generateRandomColors } from '@/utils/randomColors';

let itemMargin = ref<Number>(20);
const itemMarginCSS: ComputedRef = computed(() => {
  return `-${itemMargin.value}px`;
});

const listItemNum = ref<Number>(20);
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
  console.log(firstItemPosition, isFirstItemScrollToTop);
};

const resizeMargin = (): void => {
  const distanceSwiped = Number(touchingY.value) - Number(touchStartY.value);
  if (distanceSwiped > 0) {
    itemMargin.value = distanceSwiped;
  }
};

let touchStartY = ref<Number>(0);
let touchingY = ref<Number>(0);
let touchEndY = ref<Number>(0);
const onTouchStart = (event: TouchEvent): void => {
  touchStartY.value = getTouchPosition(event);
  getFirstAndLastItemPosition();
};
const onTouchMove = (event: TouchEvent): void => {
  touchingY.value = getTouchPosition(event);
  getFirstAndLastItemPosition();
  if (isFirstItemScrollToTop.value) {
    resizeMargin();
  }
};
const onTouchEnd = (event: TouchEvent): void => {
  touchEndY.value = getTouchPosition(event);
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
  margin-bottom: v-bind(itemMarginCSS);
  box-shadow: -20px -10px 19px 13px rgb(0 0 0 / 10%);
  border-radius: 8px;
}
</style>
