/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-08-20 11:17:40
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-08-25 19:08:38
 * @FilePath: \gear\packages\sliding-puzzle\src\dom\index.tsx
 */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, {
  CSSProperties, useCallback, useEffect, useState, useMemo, useRef,
} from 'react';

interface IMVerifyProps {
  background: string;
  block: string;
  onRelease: (moveX: number) => Promise<boolean>;
  onRefresh: () => Promise<boolean>;
}

interface ISpinProps {
  spinning: boolean;
  style?: CSSProperties;
  children?: any;
}

enum DragStatus {
  pending,
  start,
  move,
  end,
}

enum VerifyStatus {
  pending,
  success,
  fail,
}

const VerifyTip: Record<VerifyStatus, string> = {
  [VerifyStatus.fail]: '验证失败，请重试',
  [VerifyStatus.pending]: '',
  [VerifyStatus.success]: '验证成功',
};

const Spin = (props: ISpinProps) => (
  <div style={props.style} className={`${props.spinning ? 'loading' : ''}`}>{ props.children }</div>
);

Spin.defaultProps = {
  style: {},
  children: null,
};

const DragIcon = () => (
  <svg className="puzzle-slider-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2074" width="34" height="34">
    <path d="M537.6 537.6C544 531.2 544 518.4 544 512s0-19.2-6.4-25.6L313.6 262.4C300.8 256 275.2 256 262.4 262.4S256 300.8 262.4 313.6L467.2 512l-198.4 198.4c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L537.6 537.6z" p-id="2075" fill="#c6c6c6" />
    <path d="M486.4 313.6 691.2 512l-198.4 198.4c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0l224-224C768 531.2 768 518.4 768 512s0-19.2-6.4-25.6L537.6 262.4C524.8 256 499.2 256 486.4 262.4S480 300.8 486.4 313.6z" p-id="2076" fill="#c6c6c6" />
  </svg>
);
const FailIcon = () => (
  <svg className="puzzle-slider-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3030" width="34" height="34"><path d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z" p-id="3031" fill="#e6e6e6" /></svg>
);
const SuccessIcon = () => (
  <svg className="puzzle-slider-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4081" width="34" height="34"><path d="M798.293333 307.626667a42.666667 42.666667 0 0 0-60.586666 0l-317.866667 318.293333-133.546667-133.973333A42.666667 42.666667 0 1 0 225.706667 554.666667l163.84 163.84a42.666667 42.666667 0 0 0 60.586666 0l348.16-348.16a42.666667 42.666667 0 0 0 0-62.72z" p-id="4082" fill="#e6e6e6" /></svg>
);

const sum = (a: number, b: number) => a + b;

const square = (a: number) => a * a;

const inRange = (s: number, [min, max]: Array<number>) => {
  if (s < min) return min;
  if (s > max) return max;
  return s;
};
const verifyTrail = (trail: Array<number>) => {
  const average = trail.reduce(sum) / trail.length;
  const deviations = trail.map((x) => x - average);
  const stddev = Math.sqrt(deviations.map(square).reduce(sum) / trail.length);
  return stddev !== 0;
};

const MVerify = (props: IMVerifyProps) => {
  const [dragStatus, setDragStatus] = useState(DragStatus.pending);
  const [getPuzzleImgLoading, setGetPuzzleImgLoading] = useState(false);
  const [containerSize] = useState({ width: 350, height: 200 });
  const [moveX, setMoveX] = useState(0);
  const trail = useRef<Array<number>>([]);
  const [verifyStatus, setVerifyStatus] = useState(VerifyStatus.pending);
  const [originPosition, setOriginPosition] = useState({ x: 0, y: 0 });

  useEffect(() => () => {
    setVerifyStatus(VerifyStatus.pending);
    setDragStatus(DragStatus.pending);
  }, []);

  const imgPositionLeft = useMemo(
    () => inRange(moveX, [10, containerSize.width - 65]),
    [containerSize.width, moveX],
  );
  const sliderPositionLeft = useMemo(
    () => inRange(moveX, [0, containerSize.width - 40]),
    [containerSize.width, moveX],
  );

  const reset = useCallback(async () => {
    try {
      setMoveX(0);
      setVerifyStatus(VerifyStatus.pending);
      setDragStatus(DragStatus.pending);
      setGetPuzzleImgLoading(true);
      await props.onRefresh();
      setGetPuzzleImgLoading(false);
    } catch (e) {
      setGetPuzzleImgLoading(false);
    }
  }, [props]);

  const onFail = useCallback(() => {
    setVerifyStatus(VerifyStatus.fail);
    setTimeout(reset, 800);
  }, [reset]);

  const onSuccess = useCallback(() => {
    setVerifyStatus(VerifyStatus.success);
    setTimeout(reset, 800);
  }, [reset]);

  const handleDragStart = useCallback((e: any) => {
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    setOriginPosition({ x, y });
    setDragStatus(() => DragStatus.start);
  }, []);

  const handleDragMove = useCallback((e: any) => {
    if (dragStatus !== DragStatus.start) return false;
    const eventX = e.clientX || e.touches[0].clientX;
    const eventY = (e.clientX || e.touches[0].clientY) as number;
    const newMoveX = eventX - originPosition.x;
    if (newMoveX < 10 || newMoveX >= containerSize.width) return false;
    setMoveX(newMoveX);
    trail.current.push(eventY);
    return true;
  }, [containerSize.width, dragStatus, originPosition.x]);

  const handleDragEnd = useCallback(async () => {
    try {
      if (dragStatus !== DragStatus.start) return;
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      setDragStatus(DragStatus.end);
      const isHuman = verifyTrail(trail.current);
      if (!isHuman) {
        onFail();
        return;
      }
      const res = await props.onRelease(moveX);
      if (res) onSuccess();
      else onFail();
    } catch (error) {
      onFail();
    }
  }, [dragStatus, handleDragMove, moveX, onFail, onSuccess, props]);

  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove]);

  return (
    <div className="puzzle-container">
      <p>请完成以下验证后继续:</p>
      <div
        style={{
          zIndex: getPuzzleImgLoading ? 0 : 1,
          width: containerSize.width,
          height: containerSize.height,
          position: 'relative',
        }}
      >
        <Spin
          spinning={getPuzzleImgLoading}
        >
          <>
            <img src={props.background} alt="" srcSet="" width={containerSize.width} height={containerSize.height} crossOrigin="anonymous" />
            <div onClick={props.onRefresh} className="puzzle-refresh">
              <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2070" width="28" height="28"><path d="M935.161672 427.51891c-14.511505-11.744485-37.643342-9.155521-49.1627 5.403057l-12.9438 16.20917c-0.926092-5.842055-1.995447-11.625782-3.158946-17.325597C831.326792 245.594511 666.360623 110.434182 477.668077 110.434182c-27.455305 0-55.099922 2.885723-82.198094 8.562003C179.036629 164.405397 39.60195 378.546545 84.655052 596.34499c38.522362 186.222285 203.488531 321.383638 392.229173 321.383638 27.430746 0 55.076386-2.873444 82.174558-8.549723 75.144444-15.746636 144.18589-53.508681 198.288089-108.002806l1.87572-1.662873c1.757017-1.74576 2.778276-3.432169 2.588965-3.443425l1.781576-2.387373c2.137687-3.527336 4.65502-9.191336 4.65502-16.173354 0-17.361413-14.035668-31.479969-31.326473-31.479969-4.275373 0-8.454556 0.914836-12.325723 2.612501l-1.90028-1.318018-8.644891 8.65717c-46.359864 46.478568-104.261599 78.042447-167.484525 91.283006-22.657023 4.750187-45.766346 7.160073-68.684312 7.160073-157.818375 0-295.733445-113.073288-327.96145-268.87268-37.738509-182.291766 78.849836-361.484961 259.918751-399.448598 22.657023-4.750187 45.766346-7.160073 68.708871-7.160073 157.793816 0 295.709909 113.061009 327.96145 268.860401 0.427742 2.101871 0.855484 4.227278 1.258667 6.364965l-13.751189-11.091616c-14.511505-11.768021-37.59627-9.1678-49.1627 5.390777-12.017708 15.056927-9.619078 37.156248 5.343705 49.269124l78.089519 63.1032c0.14224 0.106424 0.285502 0.213871 0.427742 0.332575l3.491521 2.814092 0.712221 0c6.483668 3.657296 15.770172 4.964058 21.065781 4.322445 9.475815-0.890276 17.954931-5.485945 23.940249-12.93152l62.723553-78.659501C952.498526 461.635939 950.052824 439.560154 935.161672 427.51891z" p-id="2071" fill="#c4c4c4" /></svg>
            </div>
            <img src={props.block} alt="" srcSet="" className="puzzle-block" style={{ left: `${imgPositionLeft}px` }} />
            <span
              className={`puzzle-tip
            ${verifyStatus === VerifyStatus.success ? 'puzzle-tip-success' : ''}
            ${verifyStatus === VerifyStatus.fail ? 'puzzle-tip-fail' : ''}
          `}
            >
              { VerifyTip[verifyStatus] }
            </span>
          </>
        </Spin>
        <div
          className={`puzzle-slider-container
            ${verifyStatus === VerifyStatus.success ? 'puzzle-slider-success' : ''}
            ${verifyStatus === VerifyStatus.fail ? 'puzzle-slider-fail' : ''}
          `}
        >
          <div style={{ width: `${sliderPositionLeft}px` }} className="puzzle-slider-mask" />
          <div style={{ left: `${sliderPositionLeft}px` }} onMouseDown={handleDragStart} className="puzzle-slider">
            {
              ([DragStatus.pending, DragStatus.start].includes(dragStatus)
                && verifyStatus === VerifyStatus.pending) && <DragIcon />
            }
            {
              verifyStatus === VerifyStatus.success && <SuccessIcon />
            }
            {
              verifyStatus === VerifyStatus.fail && <FailIcon />
            }
          </div>
          <span className="puzzle-slider-text">
            {
              verifyStatus === VerifyStatus.success ? '验证通过' : '向右滑动填充拼图'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export { MVerify };
