import React from 'react';
import { Link } from 'dva/router';
import Exception from '@/components/Exception/Exception';

export default () => (
  <Exception type="500" message="抱歉，服务器出错了" linkElement={Link} />
);
