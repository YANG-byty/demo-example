<template>
  <div>
    <h1>画板</h1>
    <div class="container" v-show="showContainer">
      <div class="row">
        <ul name="" class="type">
          <li :class="['line', type == 'line' ? 'typeactive' : '']" @click="setTypeFn('line')">直&nbsp;&nbsp;&nbsp;线</li>
          <li :class="['rect', type == 'rect' ? 'typeactive' : '']" @click="setTypeFn('rect')">矩&nbsp;&nbsp;&nbsp;形</li>
          <li :class="['circle', type == 'circle' ? 'typeactive' : '']" @click="setTypeFn('circle')">圆&nbsp;&nbsp;&nbsp;圈</li>
          <li :class="['pen', type == 'pen' ? 'typeactive' : '']" @click="setTypeFn('pen')">铅&nbsp;&nbsp;&nbsp;笔</li>
          <li
            :class="['poly', type == 'poly' ? 'typeactive' : '']"
            @click="setTypeFn('poly')"
            @mouseenter="showPoly = true"
            @mouseleave="showPoly = false"
          >
            多&nbsp;边&nbsp;形
            <div class="bian" v-show="showPoly">
              <span>边数</span>
              <input v-model="n" @blur="nNumFn" type="number" name="number" />
            </div>
          </li>
          <li :class="['eraser', type == 'eraser' ? 'typeactive' : '']" @click="setTypeFn('eraser')">橡&nbsp;&nbsp;&nbsp;皮</li>
        </ul>
        <ul class="style">
          <li :class="['stroke', style == 'stroke' ? 'styleactive' : '']" @click="setStyleFn('stroke')">
            描&nbsp;&nbsp;&nbsp;边
          </li>
          <li :class="['fill', style == 'fill' ? 'styleactive' : '']" @click="setStyleFn('fill')" v-show="showFill">
            填&nbsp;&nbsp;&nbsp;充
          </li>
        </ul>
        <div class="space"></div>
        <div class="box">
          <span>颜色</span>
          <input v-model="color" type="color" name="color" />
        </div>
        <div class="box linewidth">
          <span>线宽</span>
          <input @blur="lineWidthFn" v-model="linewidth" type="number" name="number" />
        </div>
        <div class="space"></div>
        <div class="create shezhi" @click="showCanvansSize = true">
          新&nbsp;&nbsp;&nbsp;建
          <div class="xinjian" v-show="showCanvansSize">
            <h6>画 板 尺 寸</h6>
            <div class="xinjian_width">
              <span>宽</span>
              <input type="number" @blur="canvasWidthFn" v-model="width" />
            </div>
            <div class="xinjian_height">
              <span>高</span>
              <input type="number" @blur="canvasHeighthFn" v-model="height" />
            </div>
            <input class="ding-btn" type="button" name="queding" value="确定" @click.stop="dingFn" />
            <div class="xinjian_before" @click.stop="create_closeFn">+</div>
          </div>
        </div>
        <div class="clear shezhi" @click="clearFn">清&nbsp;&nbsp;&nbsp;空</div>
        <div class="back shezhi" @click="backFn">撤&nbsp;&nbsp;&nbsp;销</div>
        <div class="save shezhi" @click="saveFn">保&nbsp;&nbsp;&nbsp;存</div>
        <div class="cut shezhi" @click="setTypeFn('cut', true)">剪&nbsp;&nbsp;&nbsp;切</div>
        <div class="copy shezhi" @click="setTypeFn('cut', false)">复&nbsp;&nbsp;&nbsp;制</div>
      </div>
    </div>
    <canvas :width="width" :height="height"></canvas>
  </div>
</template>
<script>
function Draw(obj, setting) {
  this.obj = obj;
  this.type = setting.type || 'line';
  this.color = setting.color || '#000000';
  this.width = setting.width || '1';
}
Draw.prototype = {
  init: function () {
    this.obj.strokeStyle = this.color;
    this.obj.fillStyle = this.color;
    this.obj.lineWidth = this.width;
  },
  rect: function (x, y, x1, y1) {
    this.init();
    this.obj.beginPath();
    this.obj.rect(x, y, x1 - x, y1 - y);
    if (this.type == 'stroke') {
      this.obj.stroke();
    } else if (this.type == 'fill') {
      this.obj.fill();
    }
  },
  line: function (x, y, x1, y1) {
    this.init();
    this.obj.beginPath();
    this.obj.moveTo(x, y);
    this.obj.lineTo(x1, y1);
    this.obj.stroke();
  },
  circle: function (x, y, x1, y1) {
    this.init();
    var r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    this.obj.beginPath();
    this.obj.arc(x, y, r, 0, 2 * Math.PI);
    if (this.type == 'stroke') {
      this.obj.stroke();
    } else if (this.type == 'fill') {
      this.obj.fill();
    }
  },
  poly: function (x, y, x1, y1, n) {
    this.init();
    var obj = this.obj;
    var r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    obj.save();
    obj.translate(x, y);
    obj.rotate(Math.PI / 2);
    var nx = r * Math.cos(Math.PI / n);
    var ny = r * Math.sin(Math.PI / n);
    obj.beginPath();
    obj.lineCap = 'round';
    obj.moveTo(nx, ny);
    for (var i = 0; i <= n; i++) {
      obj.rotate((Math.PI * 2) / n);
      obj.lineTo(nx, -ny);
    }

    if (this.type == 'stroke') {
      this.obj.stroke();
    } else if (this.type == 'fill') {
      this.obj.fill();
    }

    obj.restore();
  },
  pen: function (x, y, x1, y1) {
    this.init();
    this.obj.save();
    this.obj.lineCap = 'round';
    this.obj.lineTo(x1, y1);
    this.obj.stroke();
    this.obj.restore();
  },
  eraser: function (x, y, x1, y1) {
    this.obj.lineCap = 'round';
    this.obj.clearRect(x1 - 5, y1 - 5, 10, 10);
  },
  cut: function (x, y, x1, y1) {
    this.init();
    this.obj.save();
    this.obj.setLineDash([4, 2]);
    this.obj.beginPath();
    this.obj.lineWidth = 1;
    this.obj.rect(x, y, x1 - x, y1 - y);
    this.obj.stroke();
    this.obj.restore();
  }
};
export default {
  data() {
    return {
      canvas: null,
      obj: null,
      type: 'line',
      color: '#000000',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      n: 3,
      linewidth: 1,
      style: 'stroke',
      showCanvansSize: false,
      showPoly: false,
      showFill: false,
      iscut: true,
      cutflag: false,
      showContainer: true,
      arr: []
    };
  },
  methods: {
    // 关闭
    create_closeFn() {
      this.showCanvansSize = false;
    },
    // 保存绘制内容
    saveFn() {
      // var reg = this.canvas.toDataURL('image/png');
      //跳转页面手动保存
      var reg = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      //直接自动保存下载
      location.href = reg;
    },
    // 设置绘制类型
    setTypeFn(type, iscut) {
      this.type = type;
      if (['line', 'pen'].includes(type)) {
        this.showFill = false;
      } else {
        this.showFill = true;
      }
      this.iscut = iscut ? true : false;
    },
    // 设置描边或填充
    setStyleFn(style) {
      this.style = style;
    },
    // 撤销
    backFn() {
      this.arr.pop();
      this.obj.clearRect(0, 0, this.width, this.height);
      if (this.arr.length > 0) {
        this.obj.putImageData(this.arr[this.arr.length - 1], 0, 0, 0, 0, this.width, this.height);
      }
    },
    // 清除
    clearFn() {
      this.arr = [];
      this.obj.clearRect(0, 0, this.width, this.height);
    },
    // 设置多边形边数
    nNumFn() {
      if (this.n <= 3) {
        this.n = 3;
      }
      if (this.n >= 15) {
        this.n = 15;
      }
    },
    // 设置线宽
    lineWidthFn() {
      if (this.linewidth <= 1) {
        this.linewidth = 1;
      }
      if (this.linewidth >= 150) {
        this.linewidth = 150;
      }
    },
    // 设置画布宽度
    canvasWidthFn() {
      if (this.width <= 500) {
        this.width = 500;
      }
      if (this.width >= this.screenWidth - 295) {
        this.width = this.screenWidth - 295;
      }
    },
    // 设置画布高度
    canvasHeighthFn() {
      if (this.height <= 300) {
        this.height = 300;
      }
      if (this.height >= this.screenHeight - 15) {
        this.height = this.screenHeight - 15;
      }
    },
    // 确定设置画布大小
    dingFn(e) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.left = (this.screenWidth + 295 - this.canvas.width) / 2 + 'px';
      this.canvas.style.top = (this.screenHeight - 5 - this.canvas.height) / 2 + 'px';
      this.arr = [];
      this.obj.clearRect(0, 0, this.width, this.height);
      e.stopPropagation();
      this.create_closeFn();
    },
    // 初始化画板
    canvasInitFn() {
      let that = this;
      this.canvas = document.querySelector('canvas');
      this.screenWidth = document.documentElement.clientWidth;
      this.screenHeight = document.documentElement.clientHeight;
      this.width = this.screenWidth - 295;
      this.height = this.screenHeight - 15;
      this.obj = this.canvas.getContext('2d');

      var x, y, w, h;
      var lx, ly, lw, lh;
      var cutdata;

      this.canvas.onmousedown = function (e) {
        x = e.offsetX;
        y = e.offsetY;
        if (that.type == 'pen') {
          that.obj.beginPath();
          that.obj.moveTo(x, y);
        }
        if (that.type == 'eraser') {
          that.obj.clearRect(x - 5, y - 5, 10, 10);
        }
        if (that.cutflag && that.type == 'cut') {
          if (that.arr.length != 0) {
            that.arr.splice(-1, 1);
          }
        }
        var draw = new Draw(that.obj, {
          type: that.style,
          color: that.color,
          width: that.linewidth
        });

        //实例化构造函数
        that.canvas.onmousemove = function (e) {
          w = e.offsetX;
          h = e.offsetY;
          if (that.type != 'eraser') {
            that.obj.clearRect(0, 0, that.width, that.height);
            if (that.arr.length != 0) {
              that.obj.putImageData(that.arr[that.arr.length - 1], 0, 0, 0, 0, that.width, that.height);
            }
          }
          if (that.cutflag && that.type == 'cut') {
            if (that.iscut) {
              that.obj.clearRect(lx, ly, lw - lx, lh - ly);
            }
            var nx = lx + (w - x);
            var ny = ly + (h - y);
            that.obj.putImageData(cutdata, nx, ny);
          } else if (that.type == 'poly') {
            draw[that.type](x, y, w, h, that.n);
          } else {
            draw[that.type](x, y, w, h);
          }
        };

        document.onmouseup = function () {
          that.canvas.onmousemove = null;
          document.onmouseup = null;
          if (that.type == 'cut') {
            if (!that.cutflag) {
              that.cutflag = true;
              cutdata = that.obj.getImageData(x + 1, y + 1, w - x - 2, h - y - 2);
              lx = x;
              ly = y;
              lw = w;
              lh = h;
              that.showContainer = false;
            } else {
              that.cutflag = false;
              that.showContainer = true;
            }
          }
          that.arr.push(that.obj.getImageData(0, 0, that.width, that.height));
        };
      };
    }
  },
  mounted() {
    this.canvasInitFn();
  }
};
</script>

<style src="./style.less" lang="less" scoped></style>
