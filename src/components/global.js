import SelectYear from '@/components/SelectYear.vue';
import FloatingWindow from '@/components/FloatingWindow/FloatingWindow.vue';
import ProgressBar from '@/components/ProgressBar.vue';
const components = [SelectYear, FloatingWindow, ProgressBar];
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default install;
