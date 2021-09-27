import React from 'react';
import ReactDOM from 'react-dom';
import { MVerify } from '@mrrs878/sliding-puzzle';
import { useRequest } from '@mrrs878/hooks';

import '@mrrs878/sliding-puzzle/dist/index.css';

const getPuzzleImg = () => fetch('https://api.mrrs.top/blog/auth/puzzleImg')
  .then((response) => response.json());

const App = () => {
  const [loading, puzzleImg, reGetPuzzleImg] = useRequest(getPuzzleImg);
  return (
    <div>
      <MVerify
        background={puzzleImg?.data.background}
        block={puzzleImg?.data.block}
        loading={loading}
        onRefresh={reGetPuzzleImg}
        onRelease={() => Promise.resolve(true)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
