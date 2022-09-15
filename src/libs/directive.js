import Vue from 'vue';
export default () => {
  Vue.directive('inputNum', {
    update(el, { value = 0 }, vnode) {
      // 当被绑定的元素插入到 DOM 中时
      let iscancel = false;
      let num = value;
      const inputEvent = (e) => {
        if (iscancel) {
          return false;
        }
        if (num === 2) {
          e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
        } else if (num === 1) {
          e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null;
        } else {
          e.target.value = e.target.value.match(/^\d*/g)[0] || null;
        }

        let v = e.target.value; //为绑定的值
        vnode.data.model.callback(v); //改变虚拟节点上v-model的值
      };
      el.oninput = inputEvent;
      //解决输入中文的问题
      el.addEventListener('compositionstart', (e) => {
        iscancel = true;
      });
      el.addEventListener('compositionend', (e) => {
        iscancel = false;
        inputEvent(e);
      });
    }
  });
};
