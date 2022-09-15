<template>
  <div class="screen-wrap">
    <div class="head-bar">丽水市<span>林业领域</span>大数据监督应用</div>
    <div class="content">
      <select-year @setTime="setTime" :areaMapTitle="areaMapTitle" />
      <div class="inner">
        <div class="left-side">
          <div class="side-box">
            <div class="side-title">预警情况</div>
            <div class="line-box mt12">
              <em></em>
            </div>
            <ul class="tab-wrap">
              <li
                :class="[modelTypeListActive == index ? 'warning-active' : 'warning', 'disFlex', 'warning-text', 'omit']"
                v-for="(item, index) in modelTypeList"
                :key="item.id"
                @click="modelTypeListFn(index)"
              >
                {{ item.name }}
              </li>
            </ul>
            <div class="line-box">
              <em></em>
            </div>
            <div class="disFlex chart-wrap">
              <div class="title-wrap">
                <div class="title">总预警量： {{ warningConditionObj.total }} 条</div>
                <div class="red">
                  红色预警量： {{ warningConditionObj.redWarning }} 条 {{ warningConditionObj.redPercentage }} %
                </div>
                <div class="yellow">
                  黄色预警量： {{ warningConditionObj.yellowWarning }} 条 {{ warningConditionObj.yellowPercentage }} %
                </div>
              </div>
              <div id="warning-chart"></div>
            </div>
            <div class="line-box">
              <em></em>
            </div>
            <div class="alert-box">预警模型</div>
            <div class="collapse-wrap">
              <div v-for="(item, index) in collapseList" :key="index">
                <div class="collapse disFlex">
                  <div @click="showModalFn(item.id)" style="width: 45%">{{ item.name }}</div>
                  <div class="disFlex row-between" style="width: 55%">
                    <progress-bar :progressBar="'progress-bar' + item.id" :data="[item.count, item.total]" />
                    <div class="disFlex" style="margin-left: 0.75rem">
                      {{ item.count }}条
                      <Icon class="down" :type="item.isDropup ? 'ios-arrow-up' : 'ios-arrow-down'" @click="isDropupFn(index)" />
                    </div>
                  </div>
                </div>
                <div v-if="item.isDropup">
                  <div class="table-box">
                    <div class="thead">
                      <div class="column one">预警内容</div>
                      <div class="column one">年度</div>
                      <div class="column one">差额</div>
                      <div class="column one">状态</div>
                    </div>
                    <div class="tbody">
                      <vue-seamless-scroll
                        class="seamless-warp list"
                        v-if="listData.length > 0"
                        :data="listData"
                        :class-option="optionSingleHeightTime"
                      >
                        <div class="item" v-for="item in listData">
                          <div class="column one" style="height: 2.5rem">
                            <Tooltip :content="item.warningContent" placement="bottom">{{ item.warningContent }}</Tooltip>
                          </div>
                          <div class="column one">{{ item.year }}</div>
                          <div class="column one">{{ item.difference }}元</div>
                          <div class="column one">
                            <span :class="[item.warningType == 1 ? 'red' : 'yellow']">{{ item.status }}</span>
                          </div>
                        </div>
                      </vue-seamless-scroll>
                      <div v-else class="no-data">暂无数据</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="middle-side">
          <div class="side-box">
            <div class="side-title">各区县林业预警统计</div>
            <div class="flex-row row-between col-center">
              <!-- 导航线 -->
              <div class="map-type">
                <div
                  :class="[areaMapTabIndex == 0 ? 'active' : '', 'item', 'flex-row', 'col-center']"
                  @click="areaMapTabFn(0, '')"
                >
                  <em></em>
                  <span>丽水市</span>
                </div>
                <div
                  :class="[areaMapTabIndex == ++index ? 'active' : '', 'item', 'flex-row', 'col-center']"
                  v-for="(item, index) in areaMapList"
                  :key="index"
                  @click="areaMapTabFn(index, item)"
                >
                  <em></em>
                  <span>{{ item.name }}</span>
                </div>
              </div>
              <!-- 地图 -->
              <div class="map-box" v-if="!showMaxMap">
                <div
                  :class="['item', areaMapTabIndex == ++index ? 'active-map' : '', item.nameEn]"
                  v-for="(item, index) in areaMapList"
                  :key="index"
                  @click="areaMapTabFn(index, item, 1)"
                >
                  <div class="name">{{ item.name }}</div>
                  <div class="more">
                    <ul v-if="item.dataList.length > 0">
                      <li class="flex-row col-center" v-for="(value, idx) in item.dataList" :key="idx">
                        <em></em><span>{{ Object.keys(value)[0] + '（' + Object.values(value)[0] + '）' }}</span>
                      </li>
                    </ul>
                    <div v-else style="color: #fff; font-size: 0.875rem">暂无数据</div>
                  </div>
                </div>

                <div class="map-name" @click="cancelMap">丽水市{{ areaMapTitle ? '·' + areaMapTitle : '' }}</div>
              </div>
              <!-- 显示大图 -->
              <div class="map-box" v-if="showMaxMap" style="background-image: none; cursor: pointer" @click="showMaxMap = false">
                <div :class="['item', 'active-map', maxMapObj.nameEn]" id="maxMap">
                  <div class="name">{{ maxMapObj.name }}</div>
                  <div class="more" style="right: 27rem">
                    <ul>
                      <li class="flex-row col-center" v-for="(value, idx) in maxMapObj.dataList" :key="idx">
                        <em></em><span>{{ Object.keys(value)[0] + '（' + Object.values(value)[0] + '）' }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <ul class="model-wrap">
              <li
                :class="['model-btn', activeModel == index ? 'active-model' : '']"
                v-for="(item, index) in tabBtnList"
                :key="index"
                @click="activeModelFn(index, item.id)"
              >
                {{ item.name }}
              </li>
            </ul>
            <div class="line-box">
              <em></em>
            </div>
            <div class="situation-wrap">
              <div class="title-wrap">
                <div class="title">预警情况</div>
                <div class="situation" @click="showModalFn(warningConditionnArr[0].forestryModelId)">
                  <circinate-chart :data="warningConditionnArr" />
                  <div class="bar-wrap">
                    <div v-for="(item, index) in warningConditionnArr" :key="index">
                      <div class="title-num row-between flex-row">
                        {{ item.name }}： <span :style="'color:' + item.color">{{ item.count }}</span
                        >{{ item.percentage }}
                      </div>
                      <progress-bar
                        :progressBar="'progress-warning' + index"
                        :color="item.color"
                        :data="[item.count, item.total]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="title-wrap">
                <div class="title">处置情况</div>
                <div class="situation" @click="showModalFn(disposeConditionArr[0].forestryModelId)">
                  <circinate-chart :data="disposeConditionArr" circinateId="disposal-chart" :color="['#0073DD', '#00F0FF']" />
                  <div class="bar-wrap">
                    <div v-for="(item, index) in disposeConditionArr" :key="index">
                      <div class="title-num row-between flex-row">
                        {{ item.type }}： <span :style="'color:' + item.color">{{ item.count }}</span
                        >{{ item.percentage }}
                      </div>
                      <progress-bar
                        :progressBar="'progress-condition' + index"
                        :color="item.color"
                        :data="[item.count, item.total]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="statistics-wrap">
                <div class="title">处置成效</div>
                <div class="wrap">
                  <div v-for="(item, index) in disposeResultArr" :key="index">
                    <span>{{ item.name }}：</span>
                    <span>{{ item.num }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-side">
          <div class="side-box">
            <div class="side-title">预警对比</div>
            <div class="line-box mt12">
              <em></em>
            </div>
            <div class="alert-box">高频问题</div>
            <div class="option-wrap">
              <div class="option" v-for="(item, index) in issueList" :key="index" @click="showModalFn(item.id)">
                <div class="title">{{ ++index }}</div>
                <div class="text-content">
                  <div class="bar">
                    <span>{{ item.count }}</span> 条
                  </div>
                  <div>{{ item.percentage }}</div>
                  <div class="omit">
                    <Tooltip :content="item.name" placement="bottom">{{ item.name }} </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert-box">各区县预警情况对比</div>
            <div class="county-chart" id="county-chart"></div>
            <div class="alert-box">历年预警趋势对比</div>
            <div class="county-chart" id="overYears-chart"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 悬浮框 -->
    <floating-window v-model="showModal" flagName="forestry" :parameter="parameter" />
  </div>
</template>
<style lang="less" src="./style.less" scoped></style>
<script src="./script.js"></script>
