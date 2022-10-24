import React, { MouseEvent, MouseEventHandler } from "react";
import "./dragAndDropList.css";

export type DnDProps = {
  rowHeight: number,
  rowList: any[],
  rowGenerator: (
    rowData: any,
    index: number,
    onMouseDown: MouseEventHandler<HTMLDivElement>,
    onMouseUp: MouseEventHandler<HTMLDivElement>,
  ) => JSX.Element,
  onChange: (rowIndex: number, dropIndex: number) => void
}

const draggingRowZIndex = '1000000';
const rowZIndex = '100000';
const scrollPixelIncrement = 4;
const scrollTriggerPadding = 10;

export default class DragAndDropList extends React.Component<DnDProps> {

  constructor(props: DnDProps) {
    super(props);
    this.onMouseDownCapture = this.onMouseDownCapture.bind(this);
    this.onMouseMoveCapture = this.onMouseMoveCapture.bind(this);
    this.onMouseUpCapture = this.onMouseUpCapture.bind(this);
    this._scrollParentListener = this._scrollParentListener.bind(this);
  }

  dndRoot? : HTMLDivElement;
  mouseMoveId? : number;

  draggingRowHouse?: HTMLElement;
  draggingRow?: HTMLElement;
  draggingIndex: number = -1;
  startY: number = 0;
  maxY: number = 0;
  minY: number = 0;
  scrollParent? : HTMLElement | null;
  lastMouseMove?: MouseEvent;
  prevDropRowOffset: number = 0;
  newDragIndex: number = 0;

  onMouseDownCapture(evt: MouseEvent) {
    if (!evt.target || !this.dndRoot ) return;
    let target = ( evt.target as HTMLElement );
    let parent: HTMLElement | null = target.parentElement;
    while (parent && parent !== this.dndRoot) {
      target = parent;
      parent = parent.parentElement;
    }
    this.draggingRowHouse = target as HTMLElement;
    this.draggingRow = target.firstChild as HTMLElement;
    this.draggingRow.classList.add('moving-row');
    this.draggingIndex = parseInt(
      this.draggingRowHouse.getAttribute('data-row-index') || '-1'
    );
    this.startY = evt.clientY;
    this.minY = 0 - this.draggingRowHouse.offsetTop;
    this.maxY = this.minY + this.dndRoot.offsetHeight - this.props.rowHeight;

    this.dndRoot.classList.add('moving');
    document.addEventListener('mousemove', this.onMouseMoveCapture as any);
    document.addEventListener('mouseup', this.onMouseUpCapture as any);

    this.draggingRow.style.zIndex = draggingRowZIndex;
    this.draggingRow.style.transition = `box-shadow 0.3s`;

    [...this.dndRoot.childNodes].map((rowHouse, index) => {
      const row = rowHouse.firstChild as HTMLDivElement;
      if (row === this.draggingRow ) return;
      row.style.transition = `top 0.3s, left 0.3s, right 0.3s`;
    });

    this.lastMouseMove = evt;
    this.scrollParent = this.dndRoot.parentElement;
    this.scrollParent?.addEventListener('scroll', this._scrollParentListener);
  }

  _scrollParentListener() {
    if (!this.lastMouseMove) return;
      this.onMouseMoveCapture(this.lastMouseMove);
  }

  _getListPositionInfo(evt: MouseEvent) {
    let dragY = Math.max(
      this.minY,
      Math.min(
        this.maxY, 
        (evt.clientY - this.startY)
      ),
    );

    return {
      dragY,
      dropIndex: Math.floor(
        (( dragY - this.minY ) / this.props.rowHeight )
      ),
    };
  }

  onMouseMoveCapture(evt: MouseEvent) {
    if (
      !this.draggingRow ||
      !this.dndRoot ||
      !this.draggingRowHouse ||
      !this.scrollParent
    ) return;

    this.lastMouseMove = evt;
    const listInfo = this._getListPositionInfo(evt);

    // dragging stuff around...
    const absDraggingY = this.draggingRowHouse.offsetTop + 
      listInfo.dragY + //this.draggingRow.offsetTop + 
      this.props.rowHeight + 
      this.dndRoot.offsetTop;
    const scrollBottom = this.scrollParent.clientHeight + 
      this.scrollParent.scrollTop;
    const scrollTop = this.scrollParent.scrollTop + 
      this.props.rowHeight;

    let scrollOffset = 0;
    let isScrolling = false;
    if (absDraggingY > ( scrollBottom - scrollTriggerPadding )) {// BOTTOM
      scrollOffset = scrollPixelIncrement;
      isScrolling = true;
    }else if (absDraggingY < ( scrollTop + scrollTriggerPadding )) {// TOP
      scrollOffset = -scrollPixelIncrement;
      isScrolling = true;
    }

    this.startY -= scrollOffset;
    this.draggingRow.style.top = `${listInfo.dragY+(scrollOffset)}px`;
    if (isScrolling) {
      this.scrollParent.scrollTo(
        {top: this.scrollParent.scrollTop + scrollOffset}
      );
    }

    // Move rows around the drop area
    [...this.dndRoot.childNodes].map((rowHouse, index) => {
      const row = rowHouse.firstChild as HTMLDivElement;
      if (row === this.draggingRow ) return;
      if (
        this.draggingIndex > index && 
        listInfo.dropIndex <= index
      ) {
        row.style.top = `${this.props.rowHeight}px`;
        row.style.zIndex = rowZIndex;
      }else if (
        this.draggingIndex < index && 
        listInfo.dropIndex >= index
      ) {
        row.style.top = `-${this.props.rowHeight}px`;
        row.style.zIndex = rowZIndex;
      }else{
        row.style.top = `0px`;
        row.style.zIndex = `auto`;
      }
    })
  }

  onMouseUpCapture(evt: MouseEvent) {
    if (
      !this.draggingRow ||
      !this.dndRoot ||
      !this.draggingRowHouse ||
      !this.scrollParent
    ) return;
    const listInfo = this._getListPositionInfo(evt);

    this.dndRoot.classList.remove('moving');
    document.removeEventListener('mousemove', this.onMouseMoveCapture as any);
    document.removeEventListener('mouseup', this.onMouseUpCapture as any);
    this.scrollParent.removeEventListener('scroll', this._scrollParentListener);

    this.prevDropRowOffset = this.draggingRow.offsetTop;
    this.newDragIndex = listInfo.dropIndex;

    this.draggingRow.style.transition = 'top 0.3s';
    this.draggingRow.style.top = `${
      (listInfo.dropIndex - this.draggingIndex) * this.props.rowHeight
    }px`;

    setTimeout(() => {
      this.props.onChange(this.draggingIndex, listInfo.dropIndex);
      if (!this.draggingRow) return;
      this.draggingRow.style.zIndex = 'auto';
      this.draggingRow.classList.remove('moving-row');
    }, 200);
  }

  render() : JSX.Element {
    const html = this.props.rowList.map((row, index) => {
      return (
        <div
          data-row-index={index}
          className="drag-and-drop-house"
          style={{
            position: 'relative',
            height: this.props.rowHeight,
          }}>
          {this.props.rowGenerator(
            row,
            index,
            this.onMouseDownCapture,
            this.onMouseUpCapture,
          )}
        </div>
      );
    });
    return (
      <div
        className="drag-n-drop"
        style={{
          position: 'relative',
          backgroundColor: '#eee',
        }}
        ref={(dndRoot: HTMLDivElement) => this.dndRoot = dndRoot}>
        {html}
      </div>
    );
  }
}