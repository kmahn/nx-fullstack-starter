import { DialogRef } from '@angular/cdk/dialog';
import { Directive, HostListener, OnInit } from '@angular/core';

@Directive()
export abstract class BaseDialogComponent implements OnInit {
  private _scrollX = 0;
  private _scrollY = 0;

  protected constructor(public dialogRef: DialogRef) {
  }

  @HostListener('wheel') handleWheel() {
    window.scrollTo(this._scrollX, this._scrollY);
  }

  @HostListener('touchmove') handleMousemove() {
    window.scrollTo(this._scrollX, this._scrollY);
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this._scrollX = window.scrollX;
    this._scrollY = window.scrollY;
  }
}
