import React, { MouseEvent, MouseEventHandler } from "react";
import "./dragAndDropList.css";

export type DnDProps = {
  rowHeight: number,
  rowList: any[],
  rowGenerator: (
    rowData: any,
    index: number,
    onMouseDown: MouseEventHandler<HTMLDivElement>,
    onMouseUp: MouseEventHandler<HTMLDivElement>
  ) => JSX.Element,
}

export default class DragAndDropList extends React.Component<DnDProps> {

  constructor(props: DnDProps) {
    super(props);
    this.onMouseDownCapture = this.onMouseDownCapture.bind(this);
    this.onMouseMoveCapture = this.onMouseMoveCapture.bind(this);
    this.onMouseUpCapture = this.onMouseUpCapture.bind(this);
  }

  dndRoot? : HTMLDivElement;
  mouseMoveId? : number;

  draggingRowHouse?: HTMLElement;
  draggingRow?: HTMLElement;
  draggingIndex: number = -1;
  startY: number = 0;
  maxY: number = 0;
  minY: number = 0;

  onMouseDownCapture(evt: MouseEvent) {
    if (!evt.target || !this.dndRoot) return;
    let target = ( evt.target as HTMLElement );
    let parent: HTMLElement | null = target.parentElement;
    while (parent && parent !== this.dndRoot) {
      target = parent;
      parent = parent.parentElement;
    }
    this.draggingRowHouse = target as HTMLElement;
    this.draggingRow = target.firstChild as HTMLElement;
    this.draggingIndex = parseInt(
      this.draggingRowHouse.getAttribute('data-row-index') || '-1'
    );
    this.startY = evt.clientY;
    this.minY = 0 - this.draggingRowHouse.offsetTop;
    this.maxY = this.minY + this.dndRoot.offsetHeight - this.props.rowHeight;

    this.dndRoot.classList.add('moving');
    document.addEventListener('mousemove', this.onMouseMoveCapture as any);
    document.addEventListener('mouseup', this.onMouseUpCapture as any);

    this.draggingRow.style.zIndex = `10000000`;
    this.draggingRow.style.transition = `box-shadow 0.3s`;
    this.draggingRow.style.boxShadow = `0px 0px 10px rgba(0, 0, 0, 0.25)`;

    [...this.dndRoot.childNodes].map((rowHouse, index) => {
      const row = rowHouse.firstChild as HTMLDivElement;
      if (row === this.draggingRow ) return;
      row.style.transition = `top 0.3s, left 0.3s, right 0.3s`;
    })
  }

  onMouseMoveCapture(evt: MouseEvent) {
    if (!this.draggingRow || !this.dndRoot) return;
    const newY = Math.max(
      this.minY,
      Math.min(
        this.maxY, 
        (evt.clientY - this.startY)
      ),
    );
    this.draggingRow.style.top = `${newY}px`;

    const dropIndex = Math.floor(
      (( newY - this.minY ) / this.props.rowHeight )
    );
  
    // Move rows around the drop area
    [...this.dndRoot.childNodes].map((rowHouse, index) => {
      const row = rowHouse.firstChild as HTMLDivElement;
      if (row === this.draggingRow ) return;
      if (
        this.draggingIndex > index && 
        dropIndex <= index
      ) {
        row.style.top = `${this.props.rowHeight}px`;
        row.style.zIndex = `1000000`;
      }else if (
        this.draggingIndex < index && 
        dropIndex >= index
      ) {
        row.style.top = `-${this.props.rowHeight}px`;
        row.style.zIndex = `1000000`;
      }else{
        row.style.top = `0px`;
        row.style.zIndex = `auto`;
      }
    })
  }

  onMouseUpCapture(evt: MouseEvent) {
    if (!this.draggingRow || !this.dndRoot) return;
    this.draggingRow.style.top = `0px`;
    this.draggingRow.style.transition = `top 0.3s, box-shadow 0.3s`;

    setTimeout(() => {
      if (!this.draggingRow) return;
      this.draggingRow.style.zIndex = `auto`;
      this.draggingRow.style.boxShadow = `none`;
    }, 300);

    this.dndRoot.classList.remove('moving');
    document.removeEventListener('mousemove', this.onMouseMoveCapture as any);
    document.removeEventListener('mouseup', this.onMouseUpCapture as any);

    [...this.dndRoot.childNodes].map((rowHouse, index) => {
      const row = rowHouse.firstChild as HTMLDivElement;
      row.style.top = `0px`;
      if (row === this.draggingRow ) return;
      row.style.zIndex = `auto`;
    })
  }

  render() : JSX.Element {
    const html = this.props.rowList.map((row, index) => {
      return (
        <div
          data-row-index={index}
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