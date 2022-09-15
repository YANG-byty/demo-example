<template>
  <div class="screen-wrap">
    <div class="head-bar"><div class="title">丽水市<span>信访领域</span>大数据监督应用</div></div>
    <div class="content">
      <div class="main-side">
        <div class="left-side">
          <div class="flex-row col-center row-center">
            <div class="year flex-row col-center row-center">
              <div class="all" @click="clearTime">全部</div>
              <DatePicker
                type="year"
                :editable="false"
                v-model="dataFrom.startTime"
                @on-change="changeTimeFn($event, 'start')"
                placeholder="年份选择"
              ></DatePicker>
              <span class="line"></span>
              <DatePicker
                type="year"
                :editable="false"
                v-model="dataFrom.endTime"
                @on-change="changeTimeFn($event, 'end')"
                placeholder="年份选择"
              ></DatePicker>
            </div>
            <div class="city" @click="cancelMap(true)">
              丽水市{{ areaMapTitle ? ' ·' : '' }}<span>{{ areaMapTitle }}</span>
            </div>
          </div>

          <div class="side-box mt">
            <div class="toptitle">
              <span>{{ areaMapTitle || '丽水市' }}主要情况</span>
            </div>
            <div class="inner">
              <div class="petition-number flex-row col-center">
                <div class="icon">
                  <img src="@/assets/img/letter-visit/petition-icon.png" alt="" />
                </div>
                <div class="flex-col">
                  <div class="text">总信访件</div>
                  <div class="text">
                    <span class="number"><countTo :startVal="0" :endVal="conditionsObj.total" :duration="4000"></countTo></span>次
                  </div>
                </div>
              </div>
              <div class="petition-list flex-row">
                <div
                  class="item flex-col row-center"
                  v-for="(item, index) in conditionsObj.model"
                  :key="index"
                  @click="showModalFn(item.id)"
                >
                  <p>
                    <span class="number">{{ item.count }}</span
                    >次
                  </p>
                  <p class="omit">{{ item.name }}</p>
                </div>
              </div>

              <div class="petition-total flex-row row-center col-center">
                <span>{{ areaMapTitle || '丽水市' }}<br />年度总化解专项资金</span>
                <span class="number"><countTo :startVal="0" :endVal="yearTotal" :duration="3000"></countTo></span><br />元
              </div>

              <div class="chart-box">
                <div id="leftChartOne" style="width: 100%; height: 100%"></div>
              </div>
              <div class="capital-total flex-row row-center col-center">
                <span>挽回化解<br />专项资金</span>
                <span class="number"><countTo :startVal="0" :endVal="fundsLatitudeObj.restore" :duration="5000"></countTo></span>
                <span><br />元</span>
              </div>
            </div>
          </div>
        </div>

        <div class="middle-side">
          <div class="total-list flex-row">
            <div
              :class="[petitionModelTypeId == item.id ? 'active' : '', 'item', 'flex-row', 'col-center']"
              @click="modelTypeFn(item.id)"
              v-for="(item, index) in modelTypeList"
              :key="index"
            >
              <div class="icon flex-row col-center row-center">
                <img src="@/assets/img/letter-visit/shixiangbanli.png" alt="" />
              </div>
              <div class="flex-col">
                <div class="number"><countTo :startVal="0" :endVal="item.count" :duration="3000"></countTo></div>
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
          </div>
          <div class="map-side flex-row row-center">
            <!-- <div class="type">
              <div class="title"><span>各区县信访类型</span></div>
              <div
                :class="[petitionModelTypeId == '' ? 'active' : '', 'item', 'flex-row', 'row-between', 'col-center']"
                @click="modelTypeFn('')"
              >
                <span>全部</span><Icon type="md-arrow-dropright" />
              </div>
              <div
                :class="[petitionModelTypeId == item.id ? 'active' : '', 'item', 'flex-row', 'row-between', 'col-center']"
                v-for="(item, index) in modelTypeList"
                :key="index"
                @click="modelTypeFn(item.id)"
              >
                <span>{{ item.name }}</span
                ><Icon type="md-arrow-dropright" />
              </div>
            </div> -->
            <!-- 地图 -->
            <div class="map-box" v-if="!showMaxMap">
              <div
                :class="[item.nameEn, areaMapTabIndex == ++index ? 'active-map' : '', 'item']"
                v-for="(item, index) in areaMapList"
                :key="index"
                @click="areaMapTabFn(index, item)"
              >
                <div class="name">{{ item.name }}</div>
                <div class="more">
                  <dl v-for="(value, idx) in item.dataList" :key="idx">
                    <dt>{{ value.name }}</dt>
                    <dd v-for="(val, idxs) in value.value" :key="idxs" @click.stop="showModalFn(val.id)">
                      {{ val.name + ' ' + val.count }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <!-- 显示大图 -->
            <div class="map-box" v-if="showMaxMap" style="background-image: none; cursor: pointer" @click="showMaxMap = false">
              <div :class="['item', 'active-map', maxMapObj.nameEn]" id="maxMap">
                <div class="name">{{ maxMapObj.name }}</div>
                <div class="more" style="right: 27rem">
                  <dl v-for="(value, idx) in maxMapObj.dataList" :key="idx">
                    <dt>{{ value.name }}</dt>
                    <dd v-for="(val, idxs) in value.value" :key="idxs" @click.stop="showModalFn(val.id)">
                      {{ val.name + ' ' + val.count }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="side-box">
            <div class="toptitle"><span>子场景预警占比</span></div>
            <div class="inner">
              <div class="model-proportion flex-row">
                <div
                  class="item flex-col flex-one col-center"
                  v-for="(item, index) in contrastList"
                  :key="index"
                  @click="showModalFn(item.id)"
                >
                  <div class="icon flex-row col-center row-center">
                    <img :src="item.iconImg" alt="" />
                  </div>
                  <div class="number">{{ item.percentage }}</div>
                  <div class="name omit-two">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-side mt">
        <div class="side-box">
          <div class="toptitle"><span>预警情况</span></div>
          <div class="inner flex-row row-between">
            <div class="warn-type flex-row">
              <div class="item red flex-one">
                <div class="flex-row">
                  <div class="icon flex-row col-center row-center">
                    <img src="@/assets/img/letter-visit/red-warn.png" alt="" />
                  </div>
                  <div class="flex-col">
                    <div class="name">红色预警量</div>
                    <div class="text">
                      <span class="number">{{ warningObj.redCount }}</span
                      >条
                    </div>
                  </div>
                </div>
                <div class="progress">
                  <ul>
                    <li class="flex-row col-center" v-for="(item, index) in warningConditionObj.red" :key="index">
                      <div class="label">{{ item.name }}</div>
                      <div class="number">{{ item.count }}</div>
                      <div class="progress-bg">
                        <span
                          :class="[index == 0 ? 'blue' : index == 1 ? 'yellow' : 'green']"
                          :style="'width:' + item.percentage"
                        ></span>
                      </div>
                      <div>{{ item.percentage }}</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="item yellow flex-one">
                <div class="flex-row">
                  <div class="icon flex-row col-center row-center">
                    <img src="@/assets/img/letter-visit/yellow-warn.png" alt="" />
                  </div>
                  <div class="flex-col">
                    <div class="name">流转预警量</div>
                    <div class="text">
                      <span class="number">{{ warningObj.yellowCount }}</span
                      >条
                    </div>
                  </div>
                </div>
                <div class="progress">
                  <ul>
                    <li class="flex-row col-center" v-for="(item, index) in warningConditionObj.yellow" :key="index">
                      <div class="label">{{ item.name }}</div>
                      <div class="number">{{ item.count }}</div>
                      <div class="progress-bg">
                        <span
                          :class="[index == 0 ? 'blue' : index == 1 ? 'yellow' : 'green']"
                          :style="'width:' + item.percentage"
                          style="width: 12%"
                        ></span>
                      </div>
                      <div>{{ item.percentage }}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="table-box">
              <div class="thead">
                <div class="column one">类型</div>
                <div class="column two">预警时间</div>
                <!-- <div class="column three">信访人姓名</div> -->
                <!-- <div class="column four">证件号</div> -->
                <div class="column five">预警内容</div>
                <div class="column six">处理状态</div>
              </div>
              <div class="tbody">
                <vue-seamless-scroll
                  v-if="listData.length > 0"
                  class="seamless-warp list"
                  :data="listData"
                  :class-option="optionSingleHeightTime"
                >
                  <div class="item" v-for="(item, index) in listData" :key="index">
                    <div class="column one">
                      <span :class="[item.status == '红' ? 'red' : 'yellow']">{{ item.status }}</span>
                    </div>
                    <div class="column two omit">{{ item.warningTime }}</div>
                    <!-- <div class="column three">{{ item.name }}</div> -->
                    <!-- <div class="column four">{{ item.idNumber }}</div> -->
                    <div class="column five omit">
                      {{ item.warningContent }}
                    </div>
                    <div class="column six omit">{{ item.disposeStatusStr }}</div>
                  </div>
                </vue-seamless-scroll>
                <div class="no-data" v-else>暂无数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-side">
        <div class="time-info flex-row col-center">
          <div class="time">{{ nowTime[1] }}</div>
          <div class="week">
            {{ nowTime[0][0] + '年' + nowTime[0][1] + '月' + nowTime[0][2] + '日' }}<span>{{ dayTime }}</span>
          </div>
        </div>
        <div class="side-box mt">
          <div class="toptitle"><span>高频问题</span></div>
          <div class="inner">
            <div class="problem-list flex-row">
              <div class="item" v-for="(item, index) in frequencyList" :key="index" @click="showModalFn(item.id)">
                <div class="order">{{ index + 1 < 10 ? '0' + (index + 1) : index }}</div>
                <div class="flex-col row-center">
                  <p>
                    <span class="number">{{ item.count }}</span
                    >条
                  </p>
                  <p>{{ item.percentage }}</p>
                  <p class="omit">{{ item.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="side-box mt">
          <div class="toptitle"><span>预警趋势对比</span></div>
          <div class="inner">
            <div class="chart-box">
              <div id="rightChartOne" style="width: 100%; height: 100%"></div>
            </div>
          </div>
        </div>

        <div class="side-box mt">
          <div class="toptitle"><span>热点关注</span></div>
          <div class="inner" style="padding: 0">
            <div class="hot-attention-wrap">
              <div id="hot-attention" style="width: 100%; height: 100%"></div>
            </div>
            <!-- <div class="results-list flex-row">
              <div class="item row flex-row col-center">
                <div class="icon flex-row col-center row-center">
                  <img src="@/assets/img/letter-visit/chulirenshu.png" alt="" />
                </div>
                <div class="flex-col">
                  <div class="name">处理人数</div>
                  <div class="text">
                    <span class="number">{{ resultsContrastObj.disposeCount }}</span
                    >人
                  </div>
                </div>
              </div>
              <div class="item flex-row col-center">
                <div class="icon flex-row col-center row-center">
                  <img src="@/assets/img/letter-visit/wanhuisunshi.png" alt="" />
                </div>
                <div class="flex-col">
                  <div class="name">挽回损失</div>
                  <div class="text">
                    <span class="number">{{ resultsContrastObj.restoreLoss }}</span
                    >元
                  </div>
                </div>
              </div>
              <div class="item flex-row col-center">
                <div class="icon flex-row col-center row-center">
                  <img src="@/assets/img/letter-visit/dianxinanli.png" alt="" />
                </div>
                <div class="flex-col">
                  <div class="name">典型案例</div>
                  <div class="text">
                    <span class="number">{{ resultsContrastObj.typicalCase }}</span
                    >个
                  </div>
                </div>
              </div>
              <div class="item flex-row col-center">
                <div class="icon flex-row col-center row-center">
                  <img src="@/assets/img/letter-visit/zhiduchengxiao.png" alt="" />
                </div>
                <div class="flex-col">
                  <div class="name">制度成效</div>
                  <div class="text">
                    <span class="number">{{ resultsContrastObj.systemPerformance }}</span
                    >个
                  </div>
                </div>
              </div>
              <div class="item flex-row col-center">
                <div class="icon flex-row col-center row-center">
                  <img src="@/assets/img/letter-visit/jiandumoxin.png" alt="" />
                </div>
                <div class="flex-col">
                  <div class="name">监督模型</div>
                  <div class="text">
                    <span class="number">{{ resultsContrastObj.supervisionModel }}</span
                    >个
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 悬浮框 -->
    <floating-window v-model="showModal" flagName="letter-visit" :parameter="parameter" />
  </div>
</template>
<style lang="less" src="./style.less" scoped></style>
<script src="./script.js"></script>
