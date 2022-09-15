<template>
  <div class="screen-wrap">
    <div class="head-bar">丽水市<span>体育领域</span>大数据监督应用</div>
    <div class="content">
      <select-year @setTime="setTime" :areaMapTitle="areaMapTitle" />
      <div class="inner">
        <div class="left-side">
          <div class="side-box">
            <div class="side-title">预警情况统计</div>
            <div class="line-box"><em></em></div>

            <div class="warn-info flex-row">
              <div class="flex-one flex-col col-center">
                <div class="name">红色预警</div>
                <div class="icon red">
                  <div class="bg"></div>
                  <img src="@/assets/img/sport/red-warn-icon.png" alt="" />
                </div>
                <div class="total flex-col row-center">
                  <p>
                    <span class="number"><countTo :startVal="0" :endVal="redObj.count" :duration="3000"></countTo></span>条
                  </p>
                  <p>{{ redObj.percentage }}</p>
                </div>
              </div>
              <div class="flex-one flex-col col-center">
                <div class="name">黄色预警</div>
                <div class="icon yellow">
                  <div class="bg"></div>
                  <img src="@/assets/img/sport/yellow-warn-icon.png" alt="" />
                </div>
                <div class="total flex-col row-center">
                  <p>
                    <span class="number"><countTo :startVal="0" :endVal="yellowObj.count" :duration="3500"></countTo></span>条
                  </p>
                  <p>{{ yellowObj.percentage }}</p>
                </div>
              </div>
            </div>

            <div class="line-box"><em></em></div>

            <div class="alert-box mt">各预警情况</div>

            <div class="chart-box">
              <div id="leftChartOne" style="width: 100%; height: 100%"></div>
            </div>
            <div class="chart-info">
              最突出问题：{{ maxSportsModelObj.name }}/{{ maxSportsModelObj.value }}条 占比：{{ maxSportsModelObj.percentage }}
            </div>
          </div>
        </div>
        <div class="middle-side">
          <div class="side-box">
            <div class="side-title">各区县体育专项监督</div>
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
                        <em></em><span>{{ value.name + value.count }}</span>
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
                    <ul v-if="maxMapObj.dataList.length > 0">
                      <li class="flex-row col-center" v-for="(value, idx) in maxMapObj.dataList" :key="idx">
                        <em></em><span>{{ value.name + '（' + value.count + '）' }}</span>
                      </li>
                    </ul>
                    <div v-else style="color: #fff; font-size: 0.875rem">暂无数据</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list flex-row">
              <div class="item" v-for="(item, index) in modelTypeList" :key="index">
                <div class="top-info flex-row col-center"><img :src="typeImgList[index]" alt="" />{{ item.name }}</div>
                <div class="info">
                  <div class="text flex-row row-between col-center">
                    <div>
                      预警数<span>{{ item.count }}</span>
                    </div>
                    <div>
                      <span>红色预警：{{ item.red }}</span
                      ><span>黄色预警：{{ item.yellow }}</span>
                    </div>
                  </div>
                  <div class="mt10 flex-row row-between col-center">
                    <progress-bar
                      style="width: 84%"
                      :progressBar="'progress-modelType' + index"
                      color="#FF4444"
                      :data="[item.count, item.total]"
                    />
                    <div class="per">{{ item.percentage }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-side">
          <div class="side-box">
            <div class="side-title">预警情况分析</div>
            <div class="line-box"><em></em></div>
            <div class="early-warn flex-row">
              <div class="item flex-one flex-col row-center col-center">
                <div class="chart-box">
                  <div id="rightChartOne" style="width: 100%; height: 100%"></div>
                </div>
                <div class="info">
                  <p>
                    红色预警量：<span class="red">{{ analysisObj.red }}</span
                    >条
                  </p>
                  <p>
                    黄色预警量：<span class="yellow">{{ analysisObj.yellow }}</span
                    >条
                  </p>
                </div>
              </div>
              <div class="item flex-one flex-col row-center col-center">
                <div class="chart-box">
                  <div id="rightChartTwo" style="width: 100%; height: 100%"></div>
                </div>
                <div class="info">
                  <p>
                    已处理量：<span class="blue">{{ analysisObj.dispose }}</span
                    >条
                  </p>
                  <p>
                    未处理量：<span class="green">{{ analysisObj.untreated }}</span
                    >条
                  </p>
                </div>
              </div>
            </div>
            <div class="warning-statistics flex-row">
              <div class="option one flex-row">
                <div>处理人数</div>
                <div>{{ disposeResultObj.disposeCount || 0 }}<span> 人</span></div>
              </div>
              <div class="option two flex-row">
                <div>挽回损失</div>
                <div>{{ disposeResultObj.recoverDamage || 0 }}<span> 万元</span></div>
              </div>
              <div class="option three flex-row">
                <div>制度成效</div>
                <div>{{ disposeResultObj.institutionResult || 0 }}<span> 个</span></div>
              </div>
              <div class="option four flex-row">
                <div>监督模型</div>
                <div>{{ disposeResultObj.supervisionModel || 0 }}<span> 个</span></div>
              </div>
            </div>
            <div class="line-box"><em></em></div>
            <div class="tab flex-row">
              <div :class="[type == 1 ? 'active' : '', 'item']" @click="typeChangeFn(1)">预警详情</div>
              <div :class="[type == 2 ? 'active' : '', 'item']" @click="typeChangeFn(2)">处置详情</div>
            </div>

            <!--预警详情-->
            <div class="collapse-wrap" v-if="type == 1">
              <div v-for="(item, index) in collapseList" :key="index">
                <div class="collapse flex-col">
                  <div class="first-row flex-row row-between col-center">
                    <div class="flex-row flex-one col-center" @click="showModalFn(item.id)">
                      <div>{{ item.name }}</div>
                      <div>
                        <Tooltip placement="top" max-width="460">
                          <img src="@/assets/img/sport/tip.png" class="icon" alt="" />
                          <template #content>
                            <p class="txt"><span>预警说明：</span>{{ item.warningDescribe }}</p>
                          </template>
                        </Tooltip>
                      </div>
                      <div class="tag">{{ item.sportsModelType }}</div>
                    </div>
                    <div class="flex-row col-center">
                      <span>{{ item.count }}条</span>
                      <Icon
                        class="down flex-row col-center row-center"
                        :type="item.isDropup ? 'ios-arrow-up' : 'ios-arrow-down'"
                        @click="isDropupFn(index)"
                      />
                    </div>
                  </div>
                  <progress-bar :progressBar="'progress-detail' + index" :data="[item.count, item.total]" />
                </div>
                <div v-if="item.isDropup">
                  <div class="table-box">
                    <div class="thead">
                      <div class="column one">企业名称</div>
                      <div class="column two">姓名/职位</div>
                      <div class="column three">预警时间</div>
                    </div>
                    <div class="tbody">
                      <vue-seamless-scroll
                        v-if="listData.length > 0"
                        class="seamless-warp list"
                        :data="listData"
                        :class-option="optionSingleHeightTime"
                      >
                        <div class="item" v-for="item in listData">
                          <div class="column one">{{ item.unit }}</div>
                          <div class="column two">{{ item.name }}</div>
                          <div class="column three">{{ item.warningTime }}</div>
                        </div>
                      </vue-seamless-scroll>
                      <div class="no-data" v-else>暂无数据</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--处置详情-->
            <div class="table-box chuzhi mt" v-else>
              <div class="thead">
                <div class="column one">对象名称</div>
                <div class="column two">单位</div>
                <div class="column three">职务</div>
                <div class="column four">处理措施</div>
                <div class="column five">措施使用时间</div>
              </div>
              <div class="tbody">
                <vue-seamless-scroll
                  v-if="listData.length > 0"
                  class="seamless-warp list"
                  :data="listData"
                  :class-option="optionSingleHeightTime"
                >
                  <div class="item" v-for="item in listData">
                    <div class="column one">{{ item.name }}</div>
                    <div class="column two">{{ item.unit }}</div>
                    <div class="column three">{{ item.position }}</div>
                    <div class="column four omit">{{ item.disposeMeasure }}</div>
                    <div class="column five omit">{{ item.disposeTime }}</div>
                  </div>
                </vue-seamless-scroll>
                <div class="no-data" v-else>暂无数据（省级平台对接中）</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 悬浮框 -->
    <floating-window v-model="showModal" flagName="sport" :parameter="parameter" />
  </div>
</template>
<style lang="less" src="./style.less" scoped></style>
<script src="./script.js"></script>
