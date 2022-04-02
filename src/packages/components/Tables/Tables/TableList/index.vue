<template>
  <div class="go-tables-rank" :style="`color: ${textColor}`">
    <div
      class="row-item"
      v-for="(item, i) in status.rows"
      :key="item.toString() + item.scroll"
      :style="`height: ${status.heights[i]}px;`"
    >
      <div class="ranking-info">
        <div class="rank" :style="`color: ${color}`">No.{{ item.ranking }}</div>
        <div class="info-name" v-html="item.name" />
        <div class="ranking-value" :style="`color: ${textColor}`">
          {{
            status.mergedConfig.valueFormatter
              ? status.mergedConfig.valueFormatter(item)
              : item.value
          }}
          {{ unit }}
        </div>
      </div>
      <div class="ranking-column" :style="`border-color: ${borderColor}`">
        <div
          class="inside-column"
          :style="`width: ${item.percent}%;background-color: ${color}`"
        >
          <div class="shine" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
})
const { w, h } = toRefs(props.chartConfig.attr)
const { rowNum, unit, color, textColor, borderColor } = toRefs(
  props.chartConfig.option
)

const status = reactive({
  mergedConfig: props.chartConfig.option,
  rowsData: [],
  rows: [],
  heights: [],
  animationIndex: 0,
  animationHandler: '',
  updater: 0,
})

const calcRowsData = () => {
  let { dataset, rowNum, sort } = status.mergedConfig
  sort &&
    dataset.sort(({ value: a }, { value: b }) => {
      if (a > b) return -1
      if (a < b) return 1
      if (a === b) return 0
    })
  const value = dataset.map(({ value }) => value)
  const min = Math.min(...value) || 0
  // abs of min
  const minAbs = Math.abs(min)
  const max = Math.max(...value) || 0
  // abs of max
  const maxAbs = Math.abs(max)
  const total = max + minAbs
  dataset = dataset.map((row, i) => ({
    ...row,
    ranking: i + 1,
    percent: ((row.value + minAbs) / total) * 100,
  }))
  const rowLength = dataset.length
  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    dataset = [...dataset, ...dataset]
  }
  dataset = dataset.map((d, i) => ({ ...d, scroll: i }))
  status.rowsData = dataset
  status.rows = dataset
}

const calcHeights = (onresize = false) => {
  const { rowNum, dataset } = status.mergedConfig
  const avgHeight = h.value / rowNum
  status.avgHeight = avgHeight
  if (!onresize) status.heights = new Array(dataset.length).fill(avgHeight)
}

const animation = async (start = false) => {
  let { avgHeight, animationIndex, mergedConfig, rowsData, updater } = status
  const { waitTime, carousel, rowNum } = mergedConfig
  const rowLength = rowsData.length
  if (rowNum >= rowLength) return
  if (start) {
    await new Promise(resolve => setTimeout(resolve, waitTime))
    if (updater !== status.updater) return
  }
  const animationNum = carousel === 'single' ? 1 : rowNum
  let rows = rowsData.slice(animationIndex)
  rows.push(...rowsData.slice(0, animationIndex))
  status.rows = rows.slice(0, rowNum + 1)
  status.heights = new Array(rowLength).fill(avgHeight)
  await new Promise(resolve => setTimeout(resolve, 300))
  if (updater !== status.updater) return
  status.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))
  animationIndex += animationNum
  const back = animationIndex - rowLength
  if (back >= 0) animationIndex = back

  status.animationIndex = animationIndex
  status.animationHandler = setTimeout(animation, waitTime * 1000 - 300)
}

const stopAnimation = () => {
  status.updater = (status.updater + 1) % 999999
  if (!status.animationHandler) return
  clearTimeout(status.animationHandler)
}

const onRestart = async () => {
  if (!status.mergedConfig) return
  stopAnimation()
  calcRowsData()
  calcHeights(true)
  animation(true)
}

onRestart()

watch(
  () => w.value,
  () => {
    onRestart()
  }
)

watch(
  () => h.value,
  () => {
    onRestart()
  }
)

watch(
  () => rowNum.value,
  () => {
    onRestart()
  }
)

// 数据更新
watch(
  () => props.chartConfig.option.dataset,
  () => {
    onRestart()
  }
)

useChartDataFetch(props.chartConfig, useChartEditStore)

onUnmounted(() => {
  stopAnimation()
})
</script>

<style lang="scss" scoped>
@include go('tables-rank') {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .row-item {
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  .ranking-info {
    display: flex;
    width: 100%;
    font-size: 13px;

    .rank {
      width: 40px;
    }

    .info-name {
      flex: 1;
    }
  }

  .ranking-column {
    border-bottom: 2px solid #1370fb80;
    margin-top: 5px;

    .inside-column {
      position: relative;
      height: 6px;
      margin-bottom: 2px;
      border-radius: 1px;
      overflow: hidden;
    }

    .shine {
      position: absolute;
      left: 0%;
      top: 2px;
      height: 2px;
      width: 50px;
      transform: translateX(-100%);
      background: radial-gradient(rgb(40, 248, 255) 5%, transparent 80%);
      animation: shine 3s ease-in-out infinite alternate;
    }
  }
}

@keyframes shine {
  80% {
    left: 0;
    transform: translateX(-100%);
  }

  100% {
    left: 100%;
    transform: translateX(0%);
  }
}
</style>