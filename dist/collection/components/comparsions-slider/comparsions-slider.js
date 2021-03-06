import 'hammerjs/hammer';
export class ComparsionsSlider {
    componentDidLoad() {
        let dragging = false, scrolling = false, resizing = false;
        const imageComparisonContainers = [].slice.call(this.comparsionsSliderContainer.querySelectorAll('.comparsions__slider-container'));
        window.addEventListener('scroll', function () {
            if (!scrolling) {
                scrolling = true;
                (!window.requestAnimationFrame)
                    ? setTimeout(function () { checkPosition(imageComparisonContainers); }, 100)
                    : requestAnimationFrame(function () { checkPosition(imageComparisonContainers); });
            }
        });
        imageComparisonContainers.forEach(function (imageComparisonContainer) {
            const actual = imageComparisonContainer;
            const actualHandle = actual.querySelector('.comparsions__slider-handle');
            const actualHandleId = actualHandle.getAttribute('data-handle-id');
            actualHandle.setAttribute('id', 'comparsions__slider-handle-' + actualHandleId);
            drags(actual.querySelector('.comparsions__slider-handle'), actual.querySelector('.comparsions__slider-resize-img'), actual, actual.querySelector('.comparsions__slider-image-label[data-type="original"]'), actual.querySelector('.comparsions__slider-image-label[data-type="modified"]'), actualHandleId);
        });
        window.addEventListener("resize", function () {
            if (!resizing) {
                resizing = true;
                (!window.requestAnimationFrame)
                    ? setTimeout(function () { checkLabel(imageComparisonContainers); }, 100)
                    : requestAnimationFrame(function () { checkLabel(imageComparisonContainers); });
            }
        }, false);
        function checkPosition(container) {
            container.forEach(function (actualContainer) {
                let actualContainerViewportOffset = actualContainer.getBoundingClientRect();
                if (actualContainerViewportOffset.top <= 350) {
                    actualContainer.classList.add('is-visible');
                }
            });
            scrolling = false;
        }
        function checkLabel(containers) {
            containers.forEach(function (container) {
                const actual = container;
                updateLabel(actual.querySelector('.comparsions__slider-image-label[data-type="modified"]'), actual.querySelector('.comparsions__slider-resize-img'), 'left');
                updateLabel(actual.querySelector('.comparsions__slider-image-label[data-type="original"]'), actual.querySelector('.comparsions__slider-resize-img'), 'right');
            });
            resizing = false;
        }
        function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement, index) {
            const handle = document.getElementById('comparsions__slider-handle-' + index);
            const handleHammer = new Hammer.Manager(handle);
            const pan = new Hammer.Pan();
            handleHammer.add(pan);
            handleHammer.on('panstart', function (el) {
                handle.classList.add('draggable');
                handle.classList.add('draggable-' + index);
                resizeElement.classList.add('resizable');
                resizeElement.classList.add('resizable-' + index);
                let dragElementOffsets = handle.getBoundingClientRect();
                let containerOffsets = container.getBoundingClientRect();
                let dragWidth = handle.clientWidth, xPosition = dragElementOffsets.left + document.body.scrollLeft + dragWidth - el.center.x, containerOffset = containerOffsets.left + document.body.scrollLeft, containerWidth = container.clientWidth, minLeft = containerOffset + 10, maxLeft = containerOffset + containerWidth - dragWidth - 10;
                handleHammer.on('panmove', function (el) {
                    if (!dragging) {
                        dragging = true;
                        (!window.requestAnimationFrame)
                            ? setTimeout(function () { animateDraggedHandle(el.center.x, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement, index); }, 100)
                            : requestAnimationFrame(function () { animateDraggedHandle(el.center.x, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement, index); });
                    }
                });
            });
            handleHammer.on('panend', function () {
                dragElement.classList.remove('draggable');
                resizeElement.classList.remove('resizable');
            });
        }
        function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement, index) {
            let leftValue = e + xPosition - dragWidth;
            //constrain the draggable element to move inside his container
            if (leftValue < minLeft) {
                leftValue = minLeft;
            }
            else if (leftValue > maxLeft) {
                leftValue = maxLeft;
            }
            const widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
            const draggables = document.getElementsByClassName('draggable-' + index);
            const resizables = document.getElementsByClassName('resizable-' + index);
            draggables[0].style.left = widthValue;
            draggables[0].addEventListener("mouseup vmouseup", function () {
                this.classList.remove('draggable');
                this.classList.remove('draggable-' + index);
                resizeElement.classList.remove('resizable');
                resizeElement.classList.remove('resizable-' + index);
            });
            resizables[0].style.width = widthValue;
            updateLabel(labelResizeElement, resizeElement, 'left');
            updateLabel(labelContainer, resizeElement, 'right');
            dragging = false;
        }
        function updateLabel(label, resizeElement, position) {
            if (position === 'left') {
                (getOffsetLeft(label) + label.clientWidth < getOffsetLeft(resizeElement) + resizeElement.clientWidth) ? label.classList.remove('is-hidden') : label.classList.add('is-hidden');
            }
            else {
                (getOffsetLeft(label) > getOffsetLeft(resizeElement) + resizeElement.clientWidth) ? label.classList.remove('is-hidden') : label.classList.add('is-hidden');
            }
        }
        function getOffsetLeft(elem) {
            let offsetLeft = 0;
            do {
                if (!isNaN(elem.offsetLeft)) {
                    offsetLeft += elem.offsetLeft;
                }
            } while (elem = elem.offsetParent);
            return offsetLeft;
        }
    }
    render() {
        return (h("div", { class: "comparsions" },
            h("div", { class: "comparsions__wrapper" },
                h("div", { class: "comparsions__slider" },
                    h("figure", { class: "comparsions__slider-container is-visible" },
                        h("img", { src: this.after, alt: "After Image" }),
                        h("span", { class: "comparsions__slider-image-label", "data-type": "original" }, "After"),
                        h("div", { class: "comparsions__slider-resize-img" },
                            h("img", { src: this.before, alt: "Before Image" }),
                            h("span", { class: "comparsions__slider-image-label", "data-type": "modified" }, "Before")),
                        h("span", { class: "comparsions__slider-handle", id: "comparsions__slider-handle", "data-handle-id": this.id },
                            h("svg", { version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", width: "32px", height: "32px", viewBox: "0 0 32 32", "enable-background": "new 0 0 32 32" },
                                h("polygon", { fill: "#FFFFFF", points: "13,21 8,16 13,11 " }),
                                h("polygon", { fill: "#FFFFFF", points: "19,11 24,16 19,21 " }))))))));
    }
    static get is() { return "comparsions-slider"; }
    static get properties() { return { "after": { "type": String, "attr": "after" }, "before": { "type": String, "attr": "before" }, "comparsionsSliderContainer": { "elementRef": true }, "id": { "type": String, "attr": "id" } }; }
    static get style() { return "/**style-placeholder:comparsions-slider:**/"; }
}
