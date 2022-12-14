import { Message } from 'view-design';

let timer = null;
let flag = true;
const resetMessage = (options, type) => {
  if (flag) {
    Message[type](options);
    flag = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      flag = true;
    }, 3000);
  }
};

['error', 'success', 'info', 'warning', 'loading', 'config', 'destroy'].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        content: options
      };
    }
    return resetMessage(options, type);
  };
});

export default resetMessage;
