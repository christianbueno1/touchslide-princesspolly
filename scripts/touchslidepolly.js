const app = {
    init: function() {
        slide3.init();
    }
}

const slide3 = {
    init: function() {
        let innerTag = document.querySelector(".touchslide-inner");
        let slideTag = document.querySelector(".touchslide-slide");
        let slideArray = document.querySelectorAll(".touchslide-slide");
        let slidesTag = document.querySelector(".touchslide-slides");
        let isDraging;
        
        // Check resize of .slidetouch-inner
        const resizeObserver = new ResizeObserver(observeWidthChange);
        resizeObserver.observe(innerTag);
        resizeObserver.observe(slidesTag);
        slideArray.forEach( slide => {
            resizeObserver.observe(slide);
            console.log(slide);
        });

        // each time when .slidetouch-inner is resized this function is called
        function observeWidthChange() {

            let halfSpace;
            halfSpace = slide3.halfEmptySpace(innerTag, slideTag);
            console.log(innerTag.offsetWidth, slideTag.offsetWidth, halfSpace);

            // IntersectionObserver options
            let options = {
                root: document.querySelector(".touchslide-inner"),
                rootMargin: `0px ${-halfSpace - 10}px 0px ${-halfSpace - 10}px`,
                threshold: .45
            }
            let intersectionObserver = new IntersectionObserver( theFrame, options);
            function theFrame (entries, observer) {
                entries.forEach( slide => {
                    if (slide.isIntersecting) {
                        slide.target.classList.add("increase-size");
                    } else {
                        slide.target.classList.remove("increase-size");
                    }
                });
            }
            slideArray.forEach( slide => {
                intersectionObserver.observe(slide);
            });

            // Touch and Mouse event
            slidesTag.addEventListener("mousedown", dragStart);
            slidesTag.addEventListener("touchstart", dragStart);
            slidesTag.addEventListener("mouseup", dragEnd);
            slidesTag.addEventListener("mouseleave", dragEnd);
            slidesTag.addEventListener("touchend", dragEnd);
            slidesTag.addEventListener("mousemove", dragAction);
            slidesTag.addEventListener("touchmove", dragAction);

            // prevent dragging of the images with mouse
            let imageArray = document.querySelectorAll(".touchslide__img img");
            imageArray.forEach( img => {
                img.addEventListener("dragstart", e => e.preventDefault() );
            });

            // Disable context menu appears when hold left click
            window.oncontextmenu = function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            let initialPosition = 0;
            let finalPosition = 0;
            let displacement = 0;
            let translate = 0;
            let animationId;

            function dragStart(e) {
                isDraging = true;
                initialPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                console.log(initialPosition);

                // It is important for smooth movement of .slidetouch-slides
                animationId = requestAnimationFrame(slideAnimation);

            }
            function dragAction(e) {
                if (isDraging) {
                    finalPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
                    displacement = finalPosition - initialPosition;
                    translate = translate + displacement;
                    console.log("displacement", displacement, "translate", translate);
                    initialPosition = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;

                }
            }
            function dragEnd() {
                isDraging = false; 
                // stop animation, it is important stop animation when drag end
                cancelAnimationFrame(animationId);
            }
            function slideAnimation() {
                slidesTag.style.transform = `translateX(${translate}px)`;
                if (isDraging) requestAnimationFrame(slideAnimation);
            }

            

        }


    },
    halfEmptySpace: function(frameWith, widthElement) {
        // this function calculate the empty space there in .slidetouch-inner
        // substract .slidetouch-slide from .slidetouch-inner
        // and divide the result by 2
        let emptySpace = frameWith.offsetWidth - widthElement.offsetWidth;
        let halfEmptySpace = emptySpace / 2;
        return halfEmptySpace;
    }
}


document.addEventListener('DOMContentLoaded', app.init);