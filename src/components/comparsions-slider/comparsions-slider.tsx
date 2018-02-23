import { Component, Prop, Element } from '@stencil/core';
import 'hammerjs/hammer';

@Component({
  tag: 'comparsions-slider',
  styleUrl: 'comparsions-slider.css'
})
export class ComparsionsSlider {

    @Prop() first: string;
    @Prop() last: string;
    @Prop() before: string;
    @Prop() after: string;

    @Element() comparsionsSliderContainer: HTMLElement;

    componentDidLoad() {

        let dragging = false,
            scrolling = false,
            resizing = false;

        console.log(dragging);
        console.log(scrolling);
        console.log(resizing);

        const imageComparisonContainers = [].slice.call(this.comparsionsSliderContainer.querySelectorAll('.comparsions__slider-container'));

        console.log(imageComparisonContainers);

        window.addEventListener('scroll', function() {
            console.log('scrolling');
        });

        imageComparisonContainers.forEach(function (imageComparisonContainer) {
            const actual = imageComparisonContainer;
            drags(
                actual.querySelector('.comparsions__slider-handle'),
                actual.querySelector('.comparsions__slider-resize-img'),
                actual.querySelector('.comparsions__slider-image-label[data-type="original"]'),
                actual.querySelector('.comparsions__slider-image-label[data-type="modified"]'),
                'test'
            )
        });

        window.addEventListener("resize", function () {
            if(!resizing) {
                resizing = true;
                ( !window.requestAnimationFrame )
                    ? setTimeout(function(){checkLabel(imageComparisonContainers);}, 100)
                    : requestAnimationFrame(function(){checkLabel(imageComparisonContainers);});
            }

            console.log('resizing');
        }, false);

        function checkLabel(container) {
           console.log(container);
        }

        function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
            console.log(dragElement);
            console.log(resizeElement);
            console.log(container);
            console.log(labelContainer);

            const handle = document.getElementById('comparsions__slider-handle');

            const handleHammer = new Hammer.Manager(handle);
            const pan = new Hammer.Pan();
            handleHammer.add(pan);

            handleHammer.on('panstart', function(el){

                //console.log(el);

                dragElement.classList.add('draggable');
                resizeElement.classList.add('resizable');

                let dragElementOffsets = dragElement.getBoundingClientRect();
                let containerOffsets = container.getBoundingClientRect();

                let dragWidth = dragElement.clientWidth,
                    xPosition = dragElementOffsets.left + document.body.scrollLeft + dragWidth - el.center.x,
                    containerOffset = containerOffsets.left + document.body.scrollLeft,
                    containerWidth = container.clientWidth,
                    minLeft = containerOffset + 10,
                    maxLeft = containerOffset + containerWidth - dragWidth - 10;

                handleHammer.on('panmove', function(el){

                    if( !dragging) {
                        dragging =  true;
                        ( !window.requestAnimationFrame )
                            ? setTimeout(function(){animateDraggedHandle(el.center.x, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);}, 100)
                            : requestAnimationFrame(function(){animateDraggedHandle(el.center.x, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);});
                    }
                });

            });
        }

        function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement) {
            let leftValue = e + xPosition - dragWidth;
            //constrain the draggable element to move inside his container
            if(leftValue < minLeft ) {
                leftValue = minLeft;
            } else if ( leftValue > maxLeft) {
                leftValue = maxLeft;
            }

            const widthValue = (leftValue + dragWidth / 2 - containerOffset ) * 100 / containerWidth + '%';

            console.log(widthValue);
            console.log(resizeElement);
            console.log(labelContainer);
            console.log(labelResizeElement);

            const draggables = document.getElementsByClassName('draggable') as HTMLCollectionOf<HTMLElement>;
            const resizables = document.getElementsByClassName('resizable') as HTMLCollectionOf<HTMLElement>;

            draggables[0].style.left = widthValue;

            resizables[0].style.width = widthValue;

        }

        /*
        function checkPosition(container) {

        }

        function checkLabel() {

        }

        function drags() {

        }

        function updateLabel() {

        }
        */
    }

  render() {
    return (
      <div class="comparsions">
        <div class="comparsions__wrapper">
            <div class="comparsions__slider">
                <figure class="comparsions__slider-container">
                    <img src={ this.after } alt="After Image" />
                    <span class="comparsions__slider-image-label" data-type="original">After</span>

                    <div class="comparsions__slider-resize-img">
                        <img src={ this.before } alt="Before Image" />
                          <span class="comparsions__slider-image-label" data-type="modified">Before</span>
                    </div>

                    <span class="comparsions__slider-handle" id="comparsions__slider-handle"> </span>
                </figure>
            </div>
        </div>
        Hello, World! I'm {this.first} {this.last}
      </div>
    );
  }
}
