import { customDropdown, createFilterTab } from "../../main/js/global.min.js";
("use strict");
$ = jQuery;

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// $('input[name="date"]').daterangepicker(
//   {
//     opens: "left",
//     autoApply: true,
//     startDate: moment().startOf("hour"),
//     endDate: moment().startOf("hour").add(24, "hour"),
//     locale: {
//       format: "DD/MM/YYYY",
//       separator: " - ",
//       applyLabel: "Áp dụng",
//       cancelLabel: "Huỷ",
//       fromLabel: "Từ",
//       toLabel: "Đến",
//       customRangeLabel: "Tuỳ chỉnh",
//       weekLabel: "T",
//       daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
//       monthNames: [
//         "Tháng 1",
//         "Tháng 2",
//         "Tháng 3",
//         "Tháng 4",
//         "Tháng 5",
//         "Tháng 6",
//         "Tháng 7",
//         "Tháng 8",
//         "Tháng 9",
//         "Tháng 10",
//         "Tháng 11",
//         "Tháng 12",
//       ],
//       firstDay: 1,
//     },
//   },
//   function (start, end) {
//     $(this).val(start.format("DD/MM/YYYY") + " - " + end.format("DD/MM/YYYY"));
//     console.log(
//       "A new date selection was made: " +
//         start.format("YYYY-MM-DD") +
//         " to " +
//         end.format("YYYY-MM-DD"),
//     );
//   },
// );
//---------------------initParallaxSwiper----------------------
function initParallaxSwiper(swiperEl, options = {}) {
  const interleaveOffset = 0.8;

  return new Swiper(swiperEl, {
    slidesPerView: 1,
    loop: true,
    speed: 1500,
    watchSlidesProgress: true,
    grabCursor: true,
    ...options,
    on: {
      progress(swiper) {
        swiper.slides.forEach((slide) => {
          const slideProgress = slide.progress || 0;
          const innerOffset = swiper.width * interleaveOffset;
          const innerTranslate = slideProgress * innerOffset;

          if (!isNaN(innerTranslate)) {
            const image = slide.querySelector(".image");
            if (image) {
              image.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        });
      },
      touchStart(swiper) {
        swiper.slides.forEach((slide) => {
          slide.style.transition = "";
        });
      },
      setTransition(swiper, speed) {
        const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
        swiper.slides.forEach((slide) => {
          slide.style.transition = `${speed}ms ${easing}`;
          const image = slide.querySelector(".image");
          if (image) {
            image.style.transition = `${speed}ms ${easing}`;
          }
        });
      },
      ...(options.on || {}),
    },
  });
}

// cách dùng
const swiperEl = document.querySelector(".swiper-el");
swiperParallax = initParallaxSwiper(swiperEl, {
  navigation: {
    nextEl: document.querySelector(".swiper-button-next"),
    prevEl: document.querySelector(".swiper-button-prev"),
  },
});
// ---------------code------------------------------------------------
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  createFilterTab();
};
document.addEventListener("DOMContentLoaded", () => {
  init();
});

// event click element a
let isLinkClicked = false;

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (
    link?.href &&
    !link.href.startsWith("#") &&
    !link.href.startsWith("javascript:")
  ) {
    isLinkClicked = true;
  }
});

window.addEventListener("beforeunload", () => {
  if (!isLinkClicked) window.scrollTo(0, 0);
  isLinkClicked = false;
});
