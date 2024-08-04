import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  OnInit,
  Renderer2,
  Inject,
} from '@angular/core';

import { constants } from './favorite-icon.constants';

/**
 * FavoriteIconDirective
 * =====================
 * The FavoriteIconDirective takes in a boolean and applies a star depending
 * to the element depending on whether the boolean is true or false. If the
 * boolean is false, when the element is rolled over a outlined star appears,
 * otherwise a star with the primary color will show up. The default primary
 * color is gold. You can set the primary star color by specifying the second
 * optional color parameter.
 *
 * Usage:
 * <element [appFavoriteIcon]="expression"></element>
 *
 * Example:
 * <i [appFavoriteIcon]="contact.favorite"></i>
 *
 *
 * Color (optional)
 * ---------------------------------
 * The second parameter is the color of the star.
 *
 * Usage:
 * <element [appFavoriteIcon]="expression" [color]="'color'"></element>
 *
 * Example:
 * <i [appFavoriteIcon]="contact.favorite" [color]="'blue'></i>
 */

@Directive({
  selector: '[appFavoriteIcon]',
  standalone: true,
})
export class FavoriteIconDirective implements OnInit {
  private element: HTMLElement;
  private Renderer2: Renderer2;
  private _primaryColor = 'gold';
  private _starClasses: any = constants.classes;

  // @Input('appFavoriteIcon') isFavorite!: boolean;
  @Input('appFavoriteIcon') isFavorite: any;

  @Input() set color(primaryColorName: string) {
    if (primaryColorName) {
      this._primaryColor = primaryColorName.toLowerCase();
      this.setSolidColoredStar();
    }
  }

  constructor(
    @Inject(ElementRef) element: ElementRef,
    @Inject(Renderer2) Renderer2: Renderer2
  ) {
    this.element = element.nativeElement;
    this.Renderer2 = Renderer2;
  }

  public ngOnInit(): void {
    // console.log("this.isFavorite: ", this.isFavorite)
    if (this.isFavorite) {
      this.setSolidColoredStar();
    } else {
      this.setWhiteSolidStar();
    }
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    if (!this.isFavorite) {
      this.setBlackOulineStar();
    }
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    if (!this.isFavorite) {
      this.setWhiteSolidStar();
    }
  }

  @HostListener('click')
  public onClick(): void {
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      this.setSolidColoredStar();
    } else {
      this.setBlackOulineStar();
    }
  }

  private setBlackOulineStar(): void {
    this.setStarColor('black');
    this.setStarClass('outline');
  }

  private setSolidColoredStar(): void {
    this.setStarColor(this._primaryColor);
    this.setStarClass('solid');
  }

  private setWhiteSolidStar(): void {
    this.setStarColor('white');
    this.setStarClass('solid');
  }

  private setStarClass(starType: string): void {
    const className: string = this.getStarClasses(starType);
    // this.Renderer2.setElementAttribute(this.element, 'class', className);
    this.Renderer2.setAttribute(this.element, 'class', className);
  }

  private setStarColor(color: string): void {
    // this.Renderer2.setElementStyle(this.element, 'color', color);
    this.Renderer2.setStyle(this.element, 'color', color);
  }

  private getStarClasses(starType: string): string {
    let classNames = '';

    switch (starType) {
      case 'solid':
        classNames = this._starClasses.SOLID_STAR;
        break;
      case 'outline':
        classNames = this._starClasses.OUTLINE_STAR;
        break;
      default:
        classNames = this._starClasses.SOLID_STAR;
    }

    return classNames;
  }
}
