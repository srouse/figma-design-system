import React, { MouseEvent, MouseEventHandler } from "react";
import "./dragAndDropList.css";
import "./dsysList.css";
import "./dsysRow.css";

export type DnDProps = {
  rowHeight: number,
  rowList: any[],
  // DONT PUT THIS BACK!!! 
  // WE DO NOT WANT ROWS TO DYNAMICALLY UPDATE..INDEX IS RIGHT ANSWER
  // rowKeyGenerator: (rowData: any) => string,
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

  dndRootRect: any;
  draggingRowHouse?: HTMLElement;
  draggingRow?: HTMLElement;
  draggingRowFirst?: HTMLElement;
  draggingRowLast?: HTMLElement;
  draggingRowLastRect?: any;
  draggingIndex: number = -1;
  startScrollTop: number = 0;
  startYInit: number = 0;
  startY: number = 0;
  startYTopOffset: number = 0;
  maxY: number = 0;
  minY: number = 0;
  scrollParent? : HTMLElement | null;
  scrollParentRect? : any;
  lastMouseMove?: MouseEvent;

  onMouseDownCapture(evt: MouseEvent) {
    if (!evt.target || !this.dndRoot ) return;

    // ESTABLISH DOM ELEMENTS
    let target = ( evt.target as HTMLElement );
    let parent: HTMLElement | null = target.parentElement;
    while (parent && parent !== this.dndRoot) {
      target = parent;
      parent = parent.parentElement;
    }
    this.dndRootRect = this.dndRoot.getBoundingClientRect();
    this.draggingRowHouse = target as HTMLElement;
    this.draggingRow = target.firstChild as HTMLElement;
    this.draggingRow.classList.add('moving-row');
    this.draggingIndex = parseInt(
      this.draggingRowHouse.getAttribute('data-row-index') || '-1'
    );
    this.draggingRowFirst = this.dndRoot.children[0] as HTMLElement;
    this.draggingRowLast = this.dndRoot.children[
      this.dndRoot.children.length-1
    ] as HTMLElement;
    this.draggingRowLastRect = this.draggingRowLast.getBoundingClientRect();

    // ABSOLUTE MOUSE LOCATION
    this.startY = evt.clientY;
    this.startYInit = this.startY;
    this.startYTopOffset = this.startY - 
      this.draggingRow.getBoundingClientRect().top;

    // ESTABLISH BOUNDS TO DRAGGING
    this.minY = this.draggingRowFirst.getBoundingClientRect().top + 
      this.startYTopOffset;
    this.maxY = this.draggingRowLastRect.top + 
      this.startYTopOffset;

    // INIT DRAGGING ROW
    this.draggingRow.style.zIndex = draggingRowZIndex;
    this.draggingRow.style.transition = `box-shadow 0.3s`;

    // ESTABLISH EVENTS
    this.dndRoot.classList.add('moving');
    document.addEventListener('mousemove', this.onMouseMoveCapture as any);
    document.addEventListener('mouseup', this.onMouseUpCapture as any);

    // RESET OTHER ROWS
    [...this.dndRoot.childNodes].map((rowHouse, index) => {
      const row = rowHouse.firstChild as HTMLDivElement;
      if (row === this.draggingRow ) return;
      row.style.transition = `top 0.3s, left 0.3s, right 0.3s`;
    });

    // ESTABLISH SCROLL LISTENING...(SCROLL EVENTS HAPPEN AT DIFFERENT RATE)
    this.lastMouseMove = evt;
    this.scrollParent = this.dndRoot.parentElement;
    this.scrollParentRect = this.scrollParent?.getBoundingClientRect();
    this.scrollParent?.addEventListener('scroll', this._scrollParentListener);
    this.startScrollTop = this.scrollParent?.scrollTop || 0;
  }

  _scrollParentListener() {
    if (!this.lastMouseMove) return;
      this.onMouseMoveCapture(this.lastMouseMove);
  }

  _getListPositionInfo(evt: MouseEvent) {
    const cursorY = evt.clientY;

    // FIND DROP INDEX (VIA ACTUAL METRICS)
    let dropIndex = 0;
    if (this.dndRoot) {
      const dropChild = [...this.dndRoot.children].find(child => {
        const childRect = child.getBoundingClientRect();
        return cursorY >= childRect.top &&
          cursorY <= childRect.bottom;
      });
      if (dropChild) {
        dropIndex = parseInt(dropChild.getAttribute('data-row-index') || '');
      } else if (cursorY > this.draggingRowLastRect.top) {
        dropIndex = this.dndRoot.children.length - 1;
      }
    }

    // DON'T LET IT OUT OF THE SCROLLER RANGE
    let dragY = cursorY;
    if (this.scrollParentRect) {
      dragY = Math.max(
        this.scrollParentRect.top + this.startYTopOffset,
        Math.min(
          this.scrollParentRect.bottom - this.props.rowHeight + this.startYTopOffset, 
          cursorY
        ),
      );
    }

    return {
      dragY: dragY,
      dropIndex,
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

    // SCROLLING STATUS
    let scrollOffset = 0;
    let isScrolling = false;
    const dragYHouseTop = listInfo.dragY - this.startYTopOffset;
    const dragYHouseBottom = dragYHouseTop + this.props.rowHeight;
    if (dragYHouseBottom >= this.scrollParentRect.bottom) {// BOTTOM
      scrollOffset = scrollPixelIncrement;
      isScrolling = true;
    }else if (dragYHouseTop <= this.scrollParentRect.top) {// TOP
      scrollOffset = -scrollPixelIncrement;
      isScrolling = true;
    }

    // SCROLL ACTION
    if (isScrolling) {
      this.scrollParent.scrollTo(
        {top: this.scrollParent.scrollTop + scrollOffset}
      );
    }

    // ADJUST STARTY RELATIVE TO SCROLLTOP
    this.startY = this.startYInit + 
      (this.startScrollTop - this.scrollParent.scrollTop);
    
    // MOVE DRAGGING ROW
    this.draggingRow.style.top = `${listInfo.dragY - this.startY}px`;

    // MOVE OTHER ROWS
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
    });
  }

  onMouseUpCapture(evt: MouseEvent) {
    if (
      !this.draggingRow ||
      !this.dndRoot ||
      !this.draggingRowHouse ||
      !this.scrollParent
    ) return;
    // GET FINAL INDEXES
    const listInfo = this._getListPositionInfo(evt);

    // UNDO ALL LISTENERS
    this.dndRoot.classList.remove('moving');
    document.removeEventListener('mousemove', this.onMouseMoveCapture as any);
    document.removeEventListener('mouseup', this.onMouseUpCapture as any);
    this.scrollParent.removeEventListener('scroll', this._scrollParentListener);

    // DROP DRAGGING INTO PLACE
    const targetRow = this.dndRoot.children[listInfo.dropIndex] as HTMLElement;
    const finalY = targetRow.getBoundingClientRect().top -
      this.draggingRowHouse.getBoundingClientRect().top;
    
    const topDiff = Math.abs(this.draggingRow.offsetTop - finalY);
    this.draggingRow.style.transition = `top ${
      topDiff < 8 ? 
        '0.0' : 
        topDiff < 15 ? 
          '0.1' : '0.3'
    }s`;
    this.draggingRow.style.top = `${finalY}px`;

    setTimeout(() => {
      this.props.onChange(this.draggingIndex, listInfo.dropIndex);
      if (!this.draggingRow) return;
      this.draggingRow.style.zIndex = 'auto';
      this.draggingRow.classList.remove('moving-row');
    }, 200);
  }

  render() : JSX.Element {
    const html = this.props.rowList.map((row, index) => {
      // const key = this.props.rowKeyGenerator(row);
      const key = index;
      return (
        <div
          key={`dnd-row-${key}`}
          data-key={`dnd-row-${key}`}
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