import common from './common';
import approval from './approval';
import message from './message';
import workbench from './workbench';

const wholeObj = Object.assign({}, common, approval, message, workbench);

export default wholeObj;
