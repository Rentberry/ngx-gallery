import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[ng-image-placeholder]'
})
export class ImagesDirective {

    constructor(private _elem: ElementRef) {
    }

    @Input('ng-image-placeholder') secureSrc: string;
    @Input() src: string;
    @Input() placeholder: string;
    @HostBinding('style.opacity') opacity = 0.5;
    @HostBinding('style.transition-delay') transitionDelay = '0s';

    private _SUPPORTED_IMAGES_FORMAT: any = /jpg|png|ico|svg|jpeg/g;
    public currentElement: any;


    ngAfterViewInit() {
        const src = typeof this.src === 'string'
            ? this.src
            : this.secureSrc;
        this.currentElement = this._elem.nativeElement;
        this.transform(src);
    }

    transform(asset: string) {
        const fallbackImage = this.placeholder || '';
        if (!asset || asset === '') {
            return this.loadImage(fallbackImage);
        }
        if (!this._isImageAsset(asset)) {
            return this.loadImage(fallbackImage);
        }
        return this.loadImage(asset);
    }

    loadImage(image: string) {
        let counter = 0;
        const defaultImage = this.placeholder || '';
        this.currentElement.src = defaultImage;
        const img = new Image();
        const src = image || defaultImage;
        img.src = src;
        img.onload = () => {
            this.currentElement.src = img.src;
            this._styleUpdateAfterLoad();
        };
        img.onerror = () => {
            counter++;
            if (counter < 2) return setTimeout(() => img.src = src, 2000);
            this.currentElement.src = defaultImage;
            this._styleUpdateAfterLoad();
        };
    }

    private _styleUpdateAfterLoad() {
        this.transitionDelay = '0.5s';
        this.opacity = 1;
    }

    private _isImageAsset(name: string) {
        if (!name || name === null || name === '') {
            return false;
        }
        return this._SUPPORTED_IMAGES_FORMAT.test(name);
    }
}
