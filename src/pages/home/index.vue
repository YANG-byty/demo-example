<template>
  <div class="screen-wrap">
    <div class="head-bar"><span>公权力大数据监督应用大屏</span></div>
    <div class="content">
      <div class="main-side">
        <div class="left-side">
          <div class="side-box">
            <div class="toptitle"><span>总预警情况</span></div>
            <div class="inner">
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
                    <p class="percentage">{{ redObj.percentage }}</p>
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
                    <p class="percentage">{{ yellowObj.percentage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="side-box mt">
            <div class="toptitle"><span>历年预警趋势对比</span></div>
            <div class="inner">
              <div class="chart-box">
                <div id="leftChartOne" style="width: 100%; height: 100%"></div>
              </div>
            </div>
          </div>
          <div class="side-box mt">
            <div class="toptitle"><span>各区县预警情况对比</span></div>
            <div class="inner">
              <div class="chart-box">
                <div id="county-chart" style="width: 100%; height: 100%"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="middle-side">
          <div class="side-box mt">
            <div class="toptitle"><span>各区县专项监督</span></div>
            <div class="inner">
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
                    @click="areaMapTabFn(index, item.name)"
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
                      <ul>
                        <li class="flex-row col-center" v-for="(value, idx) in item.dataList" :key="idx">
                          <em></em><span>{{ value.name + '（' + value.count + '）' }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- <div class="map-name">丽水市{{ areaMapTitle ? '·' + areaMapTitle : '' }}</div> -->
                </div>
                <!-- 显示大图 -->
                <div
                  class="map-box"
                  v-if="showMaxMap"
                  style="background-image: none; cursor: pointer"
                  @click="showMaxMap = false"
                >
                  <div :class="['item', 'active-map', maxMapObj.nameEn]" id="maxMap">
                    <div class="name">{{ maxMapObj.name }}</div>
                    <div class="more" style="right: 27rem">
                      <ul>
                        <li class="flex-row col-center" v-for="(value, idx) in maxMapObj.dataList" :key="idx">
                          <em></em><span>{{ value.name + '（' + value.count + '）' }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="side-box mt">
            <div class="toptitle"><span>各领域统计</span></div>
            <div class="inner">
              <div class="early-warn flex-row row-between">
                <div class="item-wrap" @click="handleClick('/letter-visit')">
                  <div class="item">
                    <div class="chart-box">
                      <div id="rightChartOne" style="width: 100%; height: 100%"></div>
                    </div>
                    <div class="info">
                      <countTo
                        :startVal="0"
                        :endVal="analysisObj.petition ? analysisObj.petition.count : 0"
                        :duration="2000"
                      ></countTo>
                      <p>信访领域预警数</p>
                    </div>
                  </div>
                  <div class="todo-btn flex-row row-center col-center">查看具体情况<Icon type="md-play" /></div>
                </div>
                <div class="line"></div>
                <div class="item-wrap" @click="handleClick('/sport')">
                  <div class="item">
                    <div class="chart-box">
                      <div id="rightChartTwo" style="width: 100%; height: 100%"></div>
                    </div>
                    <div class="info">
                      <countTo
                        :startVal="0"
                        :endVal="analysisObj.sports ? analysisObj.sports.count : 0"
                        :duration="2000"
                      ></countTo>
                      <p>体育领域预警数</p>
                    </div>
                  </div>
                  <div class="todo-btn flex-row row-center col-center">查看具体情况<Icon type="md-play" /></div>
                </div>
                <div class="line"></div>
                <div class="item-wrap" @click="handleClick('/forestry')">
                  <div class="item">
                    <div class="chart-box">
                      <div id="rightChartThree" style="width: 100%; height: 100%"></div>
                    </div>
                    <div class="info">
                      <countTo
                        :startVal="0"
                        :endVal="analysisObj.forestry ? analysisObj.forestry.count : 0"
                        :duration="2000"
                      ></countTo>
                      <p>林业领域预警数</p>
                    </div>
                  </div>
                  <div class="todo-btn flex-row row-center col-center">查看具体情况<Icon type="md-play" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-side">
        <div class="side-box">
          <div class="toptitle flex-row col-center">
            <span>信访领域高频问题</span>
            <div class="todo-btn flex-row row-center col-center" @click="handleClick('/letter-visit')">
              更多<Icon type="md-play" />
            </div>
          </div>
          <div class="inner">
            <div class="problem-list flex-row" style="height: 14.9rem">
              <div
                class="item"
                v-for="(item, index) in xfFrequencyList"
                :key="index"
                @click="showModalFn(item.id, 'letter-visit')"
              >
                <div class="order">{{ index + 1 < 10 ? '0' + (index + 1) : index }}</div>
                <div class="flex-col row-center">
                  <p>
                    <span class="number">{{ item.count }}</span
                    >条
                  </p>
                  <p>{{ item.percentage }}</p>
                  <p class="omit text">{{ item.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="side-box mt">
          <div class="toptitle flex-row col-center">
            <span>体育领域高频问题</span>
            <div class="todo-btn flex-row row-center col-center" @click="handleClick('/sport')">更多<Icon type="md-play" /></div>
          </div>
          <div class="inner">
            <div class="problem-list flex-row">
              <div class="item" v-for="(item, index) in tyFrequencyList" :key="index" @click="showModalFn(item.id, 'sport')">
                <div class="order">{{ index + 1 < 10 ? '0' + (index + 1) : index }}</div>
                <div class="flex-col row-center">
                  <p>
                    <span class="number">{{ item.count }}</span
                    >条
                  </p>
                  <p>{{ item.percentage }}</p>
                  <p class="omit text">{{ item.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="side-box mt">
          <div class="toptitle flex-row col-center">
            <span>林业领域高频问题</span>
            <div class="todo-btn flex-row row-center col-center" @click="handleClick('/forestry')">
              更多<Icon type="md-play" />
            </div>
          </div>
          <div class="inner">
            <div class="problem-list flex-row" style="height: 16rem">
              <div class="item" v-for="(item, index) in lyFrequencyList" :key="index" @click="showModalFn(item.id, 'forestry')">
                <div class="order">{{ index + 1 < 10 ? '0' + (index + 1) : index }}</div>
                <div class="flex-col row-center">
                  <p>
                    <span class="number">{{ item.count }}</span
                    >条
                  </p>
                  <p>{{ item.percentage }}</p>
                  <p class="omit text">{{ item.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 悬浮框 -->
    <floating-window v-model="showModal" :flagName="flagName" :parameter="parameter" />
  </div>
</template>
<style lang="less" src="./style.less" scoped></style>
<script src="./script.js"></script>
