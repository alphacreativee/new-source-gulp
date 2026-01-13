export function customDropdown() {
  const dropdowns = document.querySelectorAll(
    ".dropdown-custom, .dropdown-custom-select"
  );

  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");
    const displayText = dropdown.querySelector(".dropdown-custom-text");

    const isSelectType = dropdown.classList.contains("dropdown-custom-select");

    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        if (isSelectType) {
          const optionText = item.textContent;
          displayText.textContent = optionText;
          dropdown.classList.add("selected");
        } else {
          const currentImgEl = valueSelect.querySelector("img");
          const currentImg = currentImgEl ? currentImgEl.src : "";
          const currentText = valueSelect.querySelector("span").textContent;
          const clickedHtml = item.innerHTML;

          valueSelect.innerHTML = clickedHtml;

          const isSelectTime = currentText.trim() === "Time";

          if (!isSelectTime) {
            if (currentImg) {
              item.innerHTML = `<span>${currentText}</span><img src="${currentImg}" alt="" />`;
            } else {
              item.innerHTML = `<span>${currentText}</span>`;
            }
          }
        }

        closeAllDropdowns();
      });
    });

    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}
export function headerScroll() {
  const header = document.getElementById("header");
  if (!header) return null;

  let lastScroll = 0;

  const trigger = ScrollTrigger.create({
    start: "top top",
    end: 9999,
    onUpdate: (self) => {
      const currentScroll = self.scroll();

      if (currentScroll <= 0) {
        header.classList.remove("scrolled");
      } else if (currentScroll > lastScroll) {
        // Scroll down
        header.classList.add("scrolled");
      } else {
        // Scroll up
        header.classList.remove("scrolled");
      }

      lastScroll = currentScroll;
    },
  });

  return trigger;
}

export function createFilterTab() {
  const filterSections = document.querySelectorAll(".filter-section");
  if (!filterSections) return;
  filterSections.forEach(function (filterSection) {
    const resultContainer = filterSection.nextElementSibling;
    if (
      !resultContainer ||
      !resultContainer.classList.contains("filter-section-result")
    )
      return;

    const filterButtons = filterSection.querySelectorAll(
      ".filter-button[data-type]"
    );

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filterType = this.dataset.type;
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        gsap.to(resultContainer, {
          autoAlpha: 0,
          duration: 0.5,
          onComplete: () => {
            const resultItems = resultContainer.querySelectorAll(
              ".filter-item[data-filter]"
            );
            if (filterType === "all") {
              resultItems.forEach((item) => (item.style.display = ""));
            } else {
              resultContainer
                .querySelectorAll(".filter-item")
                .forEach((item) => {
                  item.style.display = "none";
                });

              resultContainer
                .querySelectorAll(`.filter-item[data-filter='${filterType}']`)
                .forEach((item) => {
                  item.style.display = "";
                });
            }
          },
        });

        gsap.to(resultContainer, {
          autoAlpha: 1,
          duration: 0.5,
        });
      });
    });
  });
}
