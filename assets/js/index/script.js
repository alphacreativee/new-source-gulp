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
