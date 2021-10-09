/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-09-30 16:44:07
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-10-09 14:14:54
 * @FilePath: \gear\packages\tabbar\src\index.tsx
 */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

const CloseCircleOutlined = () => (
  <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2399" width="18" height="18">
    <path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2400" />
    <path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2401" />
  </svg>
);

function insertBefore<T>(list: T[], from: T, to?: T): T[] {
  const copy = [...list];
  const fromIndex = copy.indexOf(from);
  if (from === to) {
    return copy;
  }
  copy.splice(fromIndex, 1);
  const newToIndex = to ? copy.indexOf(to) : -1;
  if (to && newToIndex >= 0) {
    copy.splice(newToIndex, 0, from);
  } else {
    // 没有 To 或 To 不在序列里，将元素移动到末尾
    copy.push(from);
  }
  return copy;
}

function isEqualBy<T>(a: T[], b: T[], key: keyof T) {
  const aList = a.map((item) => item[key]);
  const bList = b.map((item) => item[key]);

  let flag = true;
  aList.forEach((i, idx) => {
    if (i !== bList[idx]) {
      flag = false;
    }
  });
  return flag;
}

export interface ITab {
  path: string;
  title: string;
}

export interface IMTabbarProps {
  tabs: Array<ITab>;
  activeTab: string;
  updateTabs: (tabs: Array<ITab>) => void;
  onTabChange?: (path: string, index: number) => void;
}

interface IPosition {
  x: number;
  y: number;
}

enum ContextMenuKeys {
  close = 'close',
  closeOthers = 'closeOthers',
  closeAll = 'closeAll',
}

type ContextMenuClickHandler = (
  pre: Array<ITab>,
  contextMenuTab: string
) => Array<ITab>;

const ContextMenuClickHandlers: Record<
ContextMenuKeys,
ContextMenuClickHandler
> = {
  [ContextMenuKeys.close]: (pre, contextMenuTab) => pre.filter(
    (item) => item.path !== contextMenuTab,
  ),
  [ContextMenuKeys.closeAll]: () => [],
  [ContextMenuKeys.closeOthers]: (pre, contextMenuTab) => pre.filter(
    (item) => item.path === contextMenuTab,
  ),
};

const TAB_WIDTH = 120;

let originTabPos: IPosition = { x: 0, y: 0 };
let originMousePos: IPosition = { x: 0, y: 0 };

const MTabbar = (props: IMTabbarProps) => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTab, setContextMenuTab] = useState('');
  const [contextMenuPos, setContextMenuPos] = useState<IPosition>({ x: 0, y: 0 });
  const [movingTabPos, setMovingTabPos] = useState<IPosition>({ x: 0, y: 0 });
  const movingTabPath = useRef<string>('');
  const contentDivRef = useRef<HTMLDivElement>(null);

  const onTabClick = useCallback((e, path, index) => {
    props.onTabChange?.call(null, path, index);
  }, [props]);

  const onTabCloseClick = useCallback((e, path) => {
    e.preventDefault();
    e.stopPropagation();
    const newTabs = props.tabs.filter((item) => item.path !== path);
    props.updateTabs(newTabs);
  }, [props]);

  const onTabContextMenu = useCallback((e, path) => {
    e.preventDefault();
    setContextMenuVisible(true);
    setContextMenuPos({ x: e.pageX, y: 20 });
    setContextMenuTab(path);
  }, []);

  const onTabMouseMove = useCallback((e) => {
    e.preventDefault();
    const contentWidth = (contentDivRef.current?.getBoundingClientRect().width || 0);
    const contentLeft = (contentDivRef.current?.getBoundingClientRect().left || 0);
    const threshold = (contentLeft + (TAB_WIDTH / 2));
    if (e.pageX < threshold) {
      setMovingTabPos({ x: 0, y: 0 });
      return;
    }
    let x = e.pageX - originMousePos.x + originTabPos.x;
    x = x > contentWidth - threshold ? contentWidth - threshold : x;
    setMovingTabPos({ x, y: 0 });
  }, []);
  const onTabMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onTabMouseMove);
    document.removeEventListener('mouseup', onTabMouseUp);
    setMovingTabPos({ x: 0, y: 0 });
    movingTabPath.current = '';
  }, [onTabMouseMove]);
  const onTabMouseDown = useCallback(async (e, path) => {
    e.preventDefault();
    movingTabPath.current = path;
    const x = (parseInt(e.currentTarget.style.left, 10) || 0);
    originMousePos = { x: e.pageX, y: 0 };
    originTabPos = ({ x, y: 0 });
    const activeTab = contentDivRef.current?.querySelectorAll('.active') || [];
    Array.from(activeTab)?.forEach((item) => item.classList.remove('active'));
    e.currentTarget?.classList.add('active');
    e.currentTarget?.classList.add('moving');
    setMovingTabPos({ x: 0, y: 0 });
    document.addEventListener('mousemove', onTabMouseMove);
    document.addEventListener('mouseup', onTabMouseUp);
  }, [onTabMouseMove, onTabMouseUp]);

  const onDocumentClick = useCallback(() => {
    setContextMenuVisible(false);
  }, []);

  const onContextMenuClick = useCallback(
    (e) => {
      const composedPath = e.nativeEvent?.composedPath();
      const target = composedPath.find((item: any) => item.className?.includes('menuItem'));
      const getNewTabs = () => {
        const preTabs = props.tabs;
        const key: ContextMenuKeys = target?.dataset?.key;
        const newTabs = ContextMenuClickHandlers[key](preTabs, contextMenuTab);
        return newTabs;
      };
      props.updateTabs(getNewTabs());
    },
    [contextMenuTab, props],
  );

  const updateTabs = useCallback((clientX: number) => {
    const dropRect = contentDivRef.current?.getBoundingClientRect();
    if (dropRect && movingTabPath.current) {
      const offsetX = clientX - dropRect.left;
      const dragItem = props.tabs.find((item) => item.path === movingTabPath.current) || { path: '', title: '' };
      const col = Math.floor(offsetX / TAB_WIDTH);
      let currentIndex = col;
      const fromIndex = props.tabs.indexOf(dragItem);
      if (fromIndex < currentIndex) {
        currentIndex += 1;
      }
      const currentItem = props.tabs[currentIndex];
      const ordered = insertBefore(props.tabs, dragItem, currentItem);
      if (isEqualBy(ordered, props.tabs, 'path')) return;
      if (fromIndex < currentIndex) {
        originMousePos.x += TAB_WIDTH;
      } else {
        originMousePos.x -= TAB_WIDTH;
      }
      props.updateTabs(ordered);
    }
  }, [props]);

  const onTabOver = useCallback((e) => {
    e.preventDefault();
    updateTabs(e.clientX);
  }, [updateTabs]);

  useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onDocumentClick);
    };
  }, [onDocumentClick]);

  return (
    <>
      {props.tabs.length > 0 && (
        <div className="tabbar-container">
          <div className="top" />
          <div
            className="content"
            ref={contentDivRef}
            onMouseMove={onTabOver}
          >
            {props.tabs.map((tab, index) => (
              <div
                onClick={(e) => onTabClick(e, tab.path, index)}
                onContextMenu={(e) => onTabContextMenu(e, tab.path)}
                onMouseDown={(e) => onTabMouseDown(e, tab.path)}
                key={tab.path}
                data-path={tab.path}
                className={`${'tab-container'} ${props.activeTab === tab.path ? 'active' : ''}`}
                style={{ left: movingTabPath.current === tab.path ? movingTabPos.x : 'unset' }}
              >
                <span className="tab-text">
                  {tab.title}
                </span>
                <span
                  className="tab-close"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => onTabCloseClick(e, tab.path)}
                >
                  <CloseCircleOutlined />
                </span>
              </div>
            ))}
          </div>
          <div className="bottom" />
          {contextMenuVisible && (
            <ul
              className="menu"
              style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
              onClick={onContextMenuClick}
            >
              <li data-key={ContextMenuKeys.close} className="menu-item">
                关闭当前
              </li>
              <li data-key={ContextMenuKeys.closeOthers} className="menu-item">
                关闭其他
              </li>
              <li data-key={ContextMenuKeys.closeAll} className="menu-item">
                关闭所有
              </li>
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export { MTabbar };
