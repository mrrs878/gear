# 滑动拼图验证码SDK

后端（Node.js）+ 前端（React.js）

## 使用

### 后端

``` js
const { getPuzzleImg } = require('@mrrs878/sliding-puzzle');

const data = await getPuzzleImg('https://img2.baidu.com/it/u=1759559009,1100199201&fm=26&fmt=auto&gp=0.jpg');
```

### 前端

``` jsx
import { MVerify } from '@mrrs878/sliding-puzzle';
import '@mrrs878/sliding-puzzle/dist/index.css';

<MVerify
  background={puzzleImgRes?.data.background || ''}
  block={puzzleImgRes?.data.block || ''}
  onRelease={onPuzzleRelease}
  onRefresh={() => {
    reGetPuzzleImg();
    return Promise.resolve(true);
  }}
/>
```
