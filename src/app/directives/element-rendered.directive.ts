import { AfterContentInit, Directive, ElementRef, EventEmitter,Output } from '@angular/core';

@Directive({
  selector: '[appElementRendered]',
  standalone: true
})
export class ElementRenderedDirective implements AfterContentInit{
  @Output() appElementRendered = new EventEmitter<HTMLElement>();

  constructor(
    private elRef: ElementRef,
  ) {}

  public async ngAfterContentInit(){
    const element = await this.elRef.nativeElement;
    this.appElementRendered.emit(element);
  }

}
