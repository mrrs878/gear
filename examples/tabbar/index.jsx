import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { MTabbar } from '@mrrs878/tabbar';

import '@mrrs878/tabbar/dist/index.css';

const App = () => {
  const [tabs, setTabs] = useState([
    { path: '/home', title: '首页' },
    { path: '/profile', title: '个人中心' },
    { path: '/setting', title: '设置' },
  ]);
  const [currentTab, setCurrentTab] = useState(tabs[0]?.path);
  return (
    <div>
      <MTabbar
        tabs={tabs}
        activeTab={currentTab}
        updateTabs={setTabs}
        onTabChange={setCurrentTab}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
