import React from 'react';
import { Link } from 'dva/router';
import Exception from '@/components/Exception/Exception';

export default () => (
  <Exception type="404" message="抱歉，你访问的页面不存在" linkElement={Link} />
);
