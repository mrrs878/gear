/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-12-23 17:52:01
 * @LastEditTime: 2021-08-18 19:04:27
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \wrench\packages\hooks\src\useDrop.ts
 */
import {
  useCallback, useMemo, useRef, useState,
} from 'react';

interface DropAreaState {
  isHovering: boolean;
}

interface DropProps {
  onDragOver: React.DragEventHandler;
  onDragenter: React.DragEventHandler;
  onDragLeave: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onPaste: React.ClipboardEventHandler;
}

interface DropAreaOptions {
  onFiles?: (file: Array<File>, event?: React.DragEvent) => void;
  onUri?: (url: string, event?: React.DragEvent) => void;
  onDom?: (content: any, event?: React.DragEvent) => void;
  onText?: (text: string, event?: React.ClipboardEvent) => void;
}

const getProps = (
  callback: (dataTransfer: DataTransfer, event: React.DragEvent | React.ClipboardEvent) => void,
  setIsHovering: (over: boolean) => void,
): DropProps => ({
  onDragOver: (event: React.DragEvent) => event.preventDefault(),
  onDragenter: (event: React.DragEvent) => {
    event.preventDefault();
    setIsHovering(true);
  },
  onDragLeave: () => setIsHovering(false),
  onDrop: (event: React.DragEvent) => {
    event.preventDefault();
    event.persist();
    setIsHovering(false);
    callback(event.dataTransfer, event);
  },
  onPaste: (event: React.ClipboardEvent) => {
    event.persist();
    callback(event.clipboardData, event);
  },
});

const useDrop = (options: DropAreaOptions = {}): [DropProps, DropAreaState] => {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [isHovering, setIsHovering] = useState(false);
  const callback = useCallback(
    (dataTransfer: DataTransfer, event: React.DragEvent | React.ClipboardEvent) => {
      const uri = dataTransfer.getData('text/uri-list');
      const dom = dataTransfer.getData('custom');

      if (dom && optionsRef.current.onDom) {
        let data = dom;
        try {
          data = JSON.parse(dom);
        } catch (e) {
          data = dom;
        }
        optionsRef.current.onDom(data, event as React.DragEvent);
        return;
      }

      if (uri && optionsRef.current.onUri) {
        optionsRef.current.onUri(uri, event as React.DragEvent);
        return;
      }

      if (dataTransfer.files && dataTransfer.files.length && optionsRef.current.onFiles) {
        optionsRef.current.onFiles(Array.from(dataTransfer.files), event as React.DragEvent);
        return;
      }

      if (dataTransfer.items && dataTransfer.items.length && optionsRef.current.onText) {
        dataTransfer.items[0].getAsString((text) => {
          optionsRef.current.onText!(text, event as React.ClipboardEvent);
        });
      }
    },
    [],
  );

  const props: DropProps = useMemo(() => getProps(callback, setIsHovering), [
    callback,
    setIsHovering,
  ]);

  return [props, { isHovering }];
};

export default useDrop;
