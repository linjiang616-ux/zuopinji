const STORAGE_KEY = "jianglin-portfolio-editor-data-v1";
const ORIGINAL_DATA = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA));
let data = loadPortfolioData();
window.PORTFOLIO_DATA = data;

const grid = document.querySelector("#project-grid");
const filterRow = document.querySelector("#filter-row");
const tagCloud = document.querySelector("#tag-cloud");
const projectDialog = document.querySelector("#project-dialog");
const dialogBody = document.querySelector("#dialog-body");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const featuredButton = document.querySelector("[data-open-featured]");
const heroImage = document.querySelector("#hero-image");
const heroProductName = document.querySelector("#hero-product-name");
const heroProductEn = document.querySelector("#hero-product-en");
const heroCategoryOrbit = document.querySelector("#hero-category-orbit");
const marqueeLightbox = document.querySelector("#marquee-lightbox");
const marqueeLightboxImage = document.querySelector("#marquee-lightbox-image");
const marqueeLightboxCaption = document.querySelector("#marquee-lightbox-caption");

let activeCategory = "全部";
let activeHeroGroup = "all";
let heroSlideIndex = 0;
let heroCarouselTimer;
const editorState = {
  enabled: new URLSearchParams(window.location.search).has("edit"),
  open: false,
  projectIndex: 0
};

let lightboxImages = [];
let lightboxIndex = 0;
let marqueeLightboxIndex = 0;

function loadPortfolioData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return normalizePortfolioData(saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(ORIGINAL_DATA)));
  } catch (error) {
    console.warn("Portfolio editor data could not be loaded.", error);
    return normalizePortfolioData(JSON.parse(JSON.stringify(ORIGINAL_DATA)));
  }
}

function normalizePortfolioData(nextData) {
  nextData.categories = Array.isArray(nextData.categories) ? nextData.categories : [];
  nextData.tags = Array.isArray(nextData.tags) ? nextData.tags : [];
  nextData.projects = Array.isArray(nextData.projects) ? nextData.projects : [];

  nextData.projects.forEach((project, index) => {
    project.id = project.id || `project-${index + 1}`;
    project.title = project.title || "未命名项目";
    project.category = project.category || nextData.categories[1] || nextData.categories[0] || "作品";
    project.type = project.type || "项目类型";
    project.cover = project.cover || "";
    project.summary = project.summary || "";
    project.tools = Array.isArray(project.tools) ? project.tools : [];
    project.gallery = Array.isArray(project.gallery) ? project.gallery : [];
    project.narrative = Array.isArray(project.narrative) ? project.narrative : [];
  });

  const usedCategories = nextData.projects.map((project) => project.category).filter(Boolean);
  usedCategories.forEach((category) => {
    if (!nextData.categories.includes(category)) nextData.categories.push(category);
  });

  return nextData;
}

const heroGroups = {
  all: [
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/cover.webp",
      alt: "渔具压扁钳与双圈套装主图设计"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/cover.webp",
      alt: "珍珠手机腕带电商主图设计"
    },
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/cover.webp",
      alt: "新娘头饰电商主图设计"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/cover.webp",
      alt: "棒球毛绒玩具主图设计"
    }
  ],
  fishing: [
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/hero-loop/size.webp",
      alt: "渔具套装产品尺寸主图设计"
    },
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/hero-loop/features-8.webp",
      alt: "渔具套装八大卖点主图设计"
    },
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/hero-loop/function-5in1.webp",
      alt: "渔具套装五合一功能主图设计"
    },
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/hero-loop/secure-grip.webp",
      alt: "渔具套装户外使用场景主图设计"
    },
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/hero-loop/split-rings.webp",
      alt: "渔具双圈套装连接卖点主图设计"
    },
    {
      name: "渔具压扁钳双圈套装",
      en: "Fishing Split Rings Kit",
      src: "./assets/projects/fishing-split-rings/hero-loop/lifestyle.webp",
      alt: "渔具套装湖面生活方式主图设计"
    }
  ],
  pearl: [
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/color-set.webp",
      alt: "珍珠手机腕带多色套装主图"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/perfect-size-black.webp",
      alt: "珍珠手机腕带黑色款尺寸卖点主图"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/secure-fit-pink.webp",
      alt: "珍珠手机腕带粉色款安装方式主图"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/multiple-uses.webp",
      alt: "珍珠手机腕带多场景用途主图"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/drop-loss-white.webp",
      alt: "珍珠手机腕带防掉落卖点主图"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/fashion-gift-indoor.webp",
      alt: "珍珠手机腕带室内礼物场景主图"
    },
    {
      name: "珍珠手机腕带",
      en: "Pearl Phone Strap",
      src: "./assets/projects/pearl-phone-strap/hero-loop/fashion-gift-street.webp",
      alt: "珍珠手机腕带街景时尚礼物主图"
    }
  ],
  bridal: [
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/hero-loop/sunset-closeup.webp",
      alt: "新娘头饰夕阳佩戴场景主图"
    },
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/hero-loop/hero-title.webp",
      alt: "新娘头饰电商标题主图"
    },
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/hero-loop/product-size.webp",
      alt: "新娘头饰产品尺寸主图"
    },
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/hero-loop/outdoor-braid.webp",
      alt: "新娘头饰户外编发佩戴主图"
    },
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/hero-loop/warm-profile.webp",
      alt: "新娘头饰暖光侧脸佩戴主图"
    },
    {
      name: "新娘头饰",
      en: "Bridal Hair Accessories",
      src: "./assets/projects/bridal-hair/hero-loop/product-composition.webp",
      alt: "新娘头饰产品组合展示主图"
    }
  ],
  crochet: [
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/handmade-cover.webp",
      alt: "棒球毛绒玩具手作场景主图"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/family-study.webp",
      alt: "棒球毛绒玩具家庭学习场景主图"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/decor-uses.webp",
      alt: "棒球毛绒玩具多场景装饰主图"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/gift-moments.webp",
      alt: "棒球毛绒玩具礼物场景主图"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/quality-icons.webp",
      alt: "棒球毛绒玩具品质卖点主图"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/product-size.webp",
      alt: "棒球毛绒玩具产品尺寸主图"
    },
    {
      name: "棒球毛绒玩具",
      en: "Crochet Baseball Plush",
      src: "./assets/projects/crochet-baseball/hero-loop/product-closeup.webp",
      alt: "棒球毛绒玩具产品近景主图"
    }
  ]
};

const projectCardVisuals = {
  "fishing-split-rings": "./assets/projects/fishing-split-rings/hero-loop/split-rings.webp",
  "pearl-phone-strap": "./assets/projects/pearl-phone-strap/hero-loop/color-set.webp",
  "bridal-hair-detail": "./assets/projects/bridal-hair/hero-loop/hero-title.webp",
  "crochet-baseball-toy": "./assets/projects/crochet-baseball/hero-loop/handmade-cover.webp",
  "catalog-excavator": "./assets/projects/catalog-excavator/cover.webp",
  "poster-light-space": "./assets/projects/poster-light-space/cover.webp",
  "ring-design": "./assets/projects/ring-design/concept.webp"
};

function init() {
  initHeroCarousel();
  initScrollMotion();
  initMarqueeLightbox();
  renderFilters();
  renderTags();
  renderProjects();
  bindGlobalEvents();
  initLightboxNavigation();
  initEditor();
}

function initHeroCarousel() {
  if (!heroImage || !heroProductName || !heroProductEn) return;

  Object.values(heroGroups).flat().forEach((slide) => {
    const image = new Image();
    image.src = slide.src;
  });

  const getActiveSlides = () => heroGroups[activeHeroGroup] ?? heroGroups.all;

  const showSlide = (nextIndex) => {
    const slides = getActiveSlides();
    heroSlideIndex = nextIndex;
    const slide = slides[nextIndex];
    heroImage.classList.add("is-switching");

    window.setTimeout(() => {
      heroImage.src = slide.src;
      heroImage.alt = slide.alt;
      heroProductName.textContent = slide.name;
      heroProductEn.textContent = slide.en;
      heroImage.classList.remove("is-switching");
      syncHeroNodeState();
    }, 180);
  };

  const startTimer = () => {
    window.clearInterval(heroCarouselTimer);
    heroCarouselTimer = window.setInterval(() => {
      const slides = getActiveSlides();
      if (slides.length <= 1) return;
      showSlide((heroSlideIndex + 1) % slides.length);
    }, 3600);
  };

  const activateGroup = (groupName) => {
    activeHeroGroup = heroGroups[groupName] ? groupName : "all";
    showSlide(0);
    startTimer();
  };

  if (heroCategoryOrbit) {
    heroCategoryOrbit.addEventListener("click", (event) => {
      const mainNode = event.target.closest("[data-hero-category='all']");
      const groupNode = event.target.closest("[data-hero-group]");

      if (mainNode) {
        const expanded = heroCategoryOrbit.classList.toggle("is-expanded");
        mainNode.setAttribute("aria-expanded", String(expanded));
        return;
      }

      if (groupNode) {
        activateGroup(groupNode.dataset.heroGroup);
      }
    });
  }

  syncHeroNodeState();
  startTimer();
}

function syncHeroNodeState() {
  if (!heroCategoryOrbit) return;

  heroCategoryOrbit.querySelectorAll("[data-hero-group]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.heroGroup === activeHeroGroup);
  });
}

const marqueeLightboxImages = Array.from({ length: 9 }, (_, index) => {
  const number = index + 1;
  return {
    src: `./assets/marquee-dynamic/${number}.webp`,
    caption: `${number} / 9`
  };
});

function getMarqueeImageIndex(src) {
  const match = src?.match(/marquee-dynamic\/(\d+)\.(?:webp)$/i);
  if (!match) return -1;
  const index = Number(match[1]) - 1;
  return index >= 0 && index < marqueeLightboxImages.length ? index : -1;
}

function initMarqueeLightbox() {
  const section = document.querySelector(".marquee-section");
  if (!section || !marqueeLightbox || !marqueeLightboxImage || !marqueeLightboxCaption) return;

  section.querySelectorAll(".marquee-row img").forEach((image) => {
    const index = getMarqueeImageIndex(image.getAttribute("src"));
    if (index < 0) return;
    image.dataset.marqueeLightboxIndex = String(index);
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-label", `打开动态作品流大图 ${index + 1} / 9`);
  });

  section.addEventListener("click", (event) => {
    const image = event.target.closest("[data-marquee-lightbox-index]");
    if (!image) return;
    openMarqueeLightbox(Number(image.dataset.marqueeLightboxIndex));
  });

  section.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const image = event.target.closest("[data-marquee-lightbox-index]");
    if (!image) return;
    event.preventDefault();
    openMarqueeLightbox(Number(image.dataset.marqueeLightboxIndex));
  });

  marqueeLightbox.querySelector(".marquee-lightbox-close")?.addEventListener("click", () => {
    marqueeLightbox.close();
  });
  marqueeLightbox.querySelector("[data-marquee-prev]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    navigateMarqueeLightbox(-1);
  });
  marqueeLightbox.querySelector("[data-marquee-next]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    navigateMarqueeLightbox(1);
  });
  marqueeLightbox.addEventListener("click", (event) => {
    if (event.target === marqueeLightbox) marqueeLightbox.close();
  });

  window.addEventListener("keydown", (event) => {
    if (!marqueeLightbox.open) return;
    if (event.key === "ArrowLeft") navigateMarqueeLightbox(-1);
    if (event.key === "ArrowRight") navigateMarqueeLightbox(1);
  });
}

function openMarqueeLightbox(index) {
  marqueeLightboxIndex = normalizeMarqueeLightboxIndex(index);
  renderMarqueeLightboxImage();
  if (!marqueeLightbox.open) marqueeLightbox.showModal();
}

function normalizeMarqueeLightboxIndex(index) {
  return (index + marqueeLightboxImages.length) % marqueeLightboxImages.length;
}

function renderMarqueeLightboxImage() {
  const image = marqueeLightboxImages[marqueeLightboxIndex];
  if (!image) return;
  marqueeLightboxImage.src = image.src;
  marqueeLightboxImage.alt = `Dynamic stream poster ${marqueeLightboxIndex + 1}`;
  marqueeLightboxCaption.textContent = image.caption;
}

function navigateMarqueeLightbox(direction) {
  if (!marqueeLightbox.open) return;
  marqueeLightboxIndex = normalizeMarqueeLightboxIndex(marqueeLightboxIndex + direction);
  renderMarqueeLightboxImage();
}
function initScrollMotion() {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const marqueeTracks = document.querySelectorAll(".marquee-track");

  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (marqueeTracks.length === 0) return;

  let ticking = false;
  const updateMarquee = () => {
    marqueeTracks.forEach((track) => {
      const rect = track.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.32;
      track.style.setProperty("--marquee-offset", Math.round(offset));
    });
    ticking = false;
  };

  const requestMarqueeUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateMarquee);
  };

  updateMarquee();
  window.addEventListener("scroll", requestMarqueeUpdate, { passive: true });
  window.addEventListener("resize", requestMarqueeUpdate);
}

function renderFilters() {
  filterRow.innerHTML = data.categories
    .map(
      (category) => `
        <button class="filter-button ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");
}

function renderTags() {
  tagCloud.innerHTML = data.tags.map((tag) => `<span class="pill">${tag}</span>`).join("");
}

function renderProjects() {
  const projects = getVisibleProjects();
  grid.innerHTML = projects
    .map(
      (project, index) => {
        const cardVisual = project.cardVisual || projectCardVisuals[project.id] || project.cover;

        return `
        <div class="project-card-stage" style="--card-index: ${index}">
          <article class="project-card ${project.featured ? "featured" : ""}" tabindex="0" role="button" data-project-id="${project.id}" aria-label="打开 ${project.title}">
            <img class="project-card-visual" src="${cardVisual}" alt="${project.title}" loading="lazy" />
            <div class="project-content">
              <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
              <span class="card-meta">${project.type} / ${project.category}</span>
              <h3>${project.title}</h3>
              <p>${project.summary}</p>
              <div class="pill-row">${project.tools.map((tool) => `<span class="pill">${tool}</span>`).join("")}</div>
              <span class="card-action">查看案例</span>
            </div>
          </article>
        </div>
      `;
      }
    )
    .join("");
}

function getVisibleProjects() {
  if (activeCategory === "全部") {
    return data.projects;
  }

  return data.projects.filter((project) => project.category === activeCategory);
}

function openProject(projectId) {
  const project = data.projects.find((item) => item.id === projectId);
  if (!project) return;

  dialogBody.innerHTML = createProjectDetail(project);
  projectDialog.showModal();
  bindDialogEvents(project);
}

function createProjectDetail(project) {
  const compareSection = createCompareSection(project);
  const gallerySection = createGallerySection(project);

  return `
    <section class="case-hero">
      <img src="${project.cover}" alt="${project.title}" />
      <div class="case-title">
        <span class="case-kicker">${project.type} / ${project.category}</span>
        <h2>${project.title}</h2>
        <p>${project.summary}</p>
        <div class="pill-row">${project.tools.map((tool) => `<span class="pill">${tool}</span>`).join("")}</div>
      </div>
    </section>
    ${compareSection}
    <section class="case-section">
      <span class="case-kicker">DESIGN NOTES</span>
      <h3>项目亮点</h3>
      <div class="flow-grid">
        ${project.narrative.map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><p>${item}</p></article>`).join("")}
      </div>
    </section>
    ${gallerySection}
  `;
}

function createCompareSection(project) {
  const comparisons = Array.isArray(project.comparisons) && project.comparisons.length > 0
    ? project.comparisons
    : project.comparison
      ? [project.comparison]
      : [];

  if (comparisons.length === 0) return "";

  const isGrouped = comparisons.length > 1;
  const compareItems = comparisons
    .map(
      (comparison, index) => `
        <article class="compare-card">
          ${isGrouped ? `<h4>${comparison.heading ?? `对比 ${index + 1}`}</h4>` : ""}
          <div class="compare" data-compare>
            <img src="${comparison.before}" alt="${comparison.beforeLabel}" />
            <div class="compare-after" data-compare-after>
              <img src="${comparison.after}" alt="${comparison.afterLabel}" />
            </div>
            <div class="compare-divider" data-compare-divider aria-hidden="true"></div>
            <div class="compare-labels">
              <span>${comparison.beforeLabel}</span>
              <span>${comparison.afterLabel}</span>
            </div>
            <input type="range" min="5" max="95" value="50" aria-label="拖动查看对比" data-compare-range />
          </div>
        </article>
      `
    )
    .join("");

  return `
    <section class="case-section">
      <span class="case-kicker">BEFORE / AFTER</span>
      <h3>${isGrouped ? "产品精修" : comparisons[0].heading ?? "素材图与商业图对比"}</h3>
      <div class="${isGrouped ? "compare-grid" : ""}">
        ${compareItems}
      </div>
    </section>
  `;
}

function createGallerySection(project) {
  const groups = Array.isArray(project.galleryGroups) && project.galleryGroups.length > 0
    ? project.galleryGroups
    : [{ title: "", images: project.gallery }];

  let imageIndex = 0;
  const groupedGallery = groups
    .map((group) => {
      const images = Array.isArray(group.images) ? group.images : [];
      if (images.length === 0) return "";

      const title = group.title ? `<h4 class="gallery-group-title">${group.title}</h4>` : "";
      const items = images
        .map((image) => {
          const currentIndex = imageIndex;
          imageIndex += 1;
          return `
            <button type="button" data-lightbox-index="${currentIndex}" aria-label="查看 ${image.caption}">
              <img src="${image.src}" alt="${image.caption}" loading="lazy" />
              <span>${image.caption}</span>
            </button>
          `;
        })
        .join("");

      return `
        <div class="gallery-group">
          ${title}
          <div class="gallery">
            ${items}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <section class="case-section">
      <span class="case-kicker">GALLERY</span>
      <h3>项目亮点</h3>
      ${groupedGallery}
    </section>
  `;
}
function bindDialogEvents(project) {
  const galleryImages = Array.isArray(project.galleryGroups) && project.galleryGroups.length > 0
    ? project.galleryGroups.flatMap((group) => Array.isArray(group.images) ? group.images : [])
    : project.gallery;

  dialogBody.querySelectorAll("[data-compare]").forEach((compare) => {
    const compareRange = compare.querySelector("[data-compare-range]");
    const compareAfter = compare.querySelector("[data-compare-after]");
    const compareDivider = compare.querySelector("[data-compare-divider]");
    if (!compareRange || !compareAfter) return;

    const afterImage = compareAfter.querySelector("img");
    const setComparePosition = (value) => {
      const clamped = Math.min(95, Math.max(5, Number(value)));
      compareRange.value = String(clamped);
      compareAfter.style.width = `${clamped}%`;
      if (compareDivider) compareDivider.style.left = `${clamped}%`;
    };
    const syncCompareImageWidth = () => {
      afterImage.style.width = `${compare.getBoundingClientRect().width}px`;
    };
    const updateFromPointer = (clientX) => {
      const rect = compare.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setComparePosition(percent);
    };

    syncCompareImageWidth();
    setComparePosition(compareRange.value);
    window.addEventListener("resize", syncCompareImageWidth);
    compareRange.addEventListener("input", () => setComparePosition(compareRange.value));
    compare.addEventListener("pointerdown", (event) => {
      if (event.target === compareRange) return;
      compare.setPointerCapture(event.pointerId);
      updateFromPointer(event.clientX);
    });
    compare.addEventListener("pointermove", (event) => {
      if (!compare.hasPointerCapture(event.pointerId)) return;
      updateFromPointer(event.clientX);
    });
    compare.addEventListener("pointerup", (event) => {
      if (compare.hasPointerCapture(event.pointerId)) compare.releasePointerCapture(event.pointerId);
    });
  });

  dialogBody.querySelectorAll("[data-lightbox-index]").forEach((button) => {
    button.addEventListener("click", () => {
      openLightbox(galleryImages, Number(button.dataset.lightboxIndex));
    });
  });
}
function openLightbox(images, index = 0) {
  lightboxImages = Array.isArray(images) ? images.filter(Boolean) : [images].filter(Boolean);
  if (lightboxImages.length === 0) return;
  lightboxIndex = normalizeLightboxIndex(index);
  renderLightboxImage();
  lightbox.showModal();
}

function normalizeLightboxIndex(index) {
  return (index + lightboxImages.length) % lightboxImages.length;
}

function renderLightboxImage() {
  const image = lightboxImages[lightboxIndex];
  if (!image) return;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.caption;
  lightboxCaption.textContent = image.caption;
}

function navigateLightbox(direction) {
  if (!lightbox.open || lightboxImages.length <= 1) return;
  lightboxIndex = normalizeLightboxIndex(lightboxIndex + direction);
  renderLightboxImage();
}

function initLightboxNavigation() {
  if (!lightbox || lightbox.dataset.navigationReady === "true") return;
  lightbox.dataset.navigationReady = "true";
  lightbox.insertAdjacentHTML(
    "beforeend",
    `
      <button class="lightbox-nav lightbox-nav-prev" type="button" aria-label="\u4e0a\u4e00\u5f20" data-lightbox-prev></button>
      <button class="lightbox-nav lightbox-nav-next" type="button" aria-label="\u4e0b\u4e00\u5f20" data-lightbox-next></button>
    `
  );
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", (event) => {
    event.stopPropagation();
    navigateLightbox(-1);
  });
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", (event) => {
    event.stopPropagation();
    navigateLightbox(1);
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  window.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") navigateLightbox(-1);
    if (event.key === "ArrowRight") navigateLightbox(1);
  });
}
function initEditor() {
  if (!editorState.enabled) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button class="editor-toggle" type="button" data-editor-toggle>编辑作品</button>
      <aside class="portfolio-editor" id="portfolio-editor" aria-hidden="true">
        <div class="editor-head">
          <div>
            <span>LOCAL EDIT MODE</span>
            <h2>作品内容编辑器</h2>
          </div>
          <button type="button" class="editor-icon-button" data-editor-close aria-label="关闭编辑器">×</button>
        </div>
        <div class="editor-actions">
          <button type="button" data-editor-add-project>新增项目</button>
          <button type="button" data-editor-save>保存草稿</button>
          <button type="button" data-editor-export>导出 projects.js</button>
          <button type="button" data-editor-reset>恢复原始</button>
        </div>
        <p class="editor-note">你在这里改的是本地草稿。别人正常打开网页仍然只能浏览；要长期生效，请导出 projects.js 并替换 data 文件。</p>
        <div class="editor-project-picker">
          <label for="editor-project-select">当前项目</label>
          <select id="editor-project-select" data-editor-project-select></select>
        </div>
        <div class="editor-body" data-editor-body></div>
      </aside>
    `
  );

  renderEditor();
  bindEditorEvents();
}

function bindEditorEvents() {
  const panel = document.querySelector("#portfolio-editor");
  const toggle = document.querySelector("[data-editor-toggle]");
  const close = document.querySelector("[data-editor-close]");

  toggle.addEventListener("click", () => setEditorOpen(true));
  close.addEventListener("click", () => setEditorOpen(false));

  panel.addEventListener("input", (event) => {
    if (
      event.target.matches("[data-editor-field]") ||
      event.target.matches("[data-gallery-field]") ||
      event.target.matches("[data-note-field]") ||
      event.target.matches("[data-compare-field]")
    ) {
      syncEditorForm();
    }
  });

  panel.addEventListener("change", (event) => {
    if (event.target.matches("[data-editor-project-select]")) {
      syncEditorForm(false);
      editorState.projectIndex = Number(event.target.value);
      renderEditorForm();
      return;
    }

    if (event.target.matches("[data-editor-field]")) {
      syncEditorForm();
      return;
    }

    if (event.target.matches("[data-gallery-file]")) {
      importGalleryFile(event.target);
    }
  });

  panel.addEventListener("click", (event) => {
    const action = event.target.closest("[data-editor-action]");
    if (action) {
      runEditorAction(action.dataset.editorAction, action);
    }
  });

  panel.querySelector("[data-editor-add-project]").addEventListener("click", addEditorProject);
  panel.querySelector("[data-editor-save]").addEventListener("click", saveEditorDraft);
  panel.querySelector("[data-editor-export]").addEventListener("click", exportEditorData);
  panel.querySelector("[data-editor-reset]").addEventListener("click", resetEditorData);
}

function setEditorOpen(open) {
  const panel = document.querySelector("#portfolio-editor");
  editorState.open = open;
  panel.classList.toggle("is-open", open);
  panel.setAttribute("aria-hidden", String(!open));
}

function renderEditor() {
  renderEditorProjectSelect();
  renderEditorForm();
}

function renderEditorProjectSelect() {
  const select = document.querySelector("[data-editor-project-select]");
  if (!select) return;

  if (editorState.projectIndex >= data.projects.length) editorState.projectIndex = Math.max(0, data.projects.length - 1);
  select.innerHTML = data.projects
    .map((project, index) => `<option value="${index}" ${index === editorState.projectIndex ? "selected" : ""}>${escapeHtml(project.title)}</option>`)
    .join("");
}

function renderEditorForm() {
  const body = document.querySelector("[data-editor-body]");
  if (!body) return;

  const project = data.projects[editorState.projectIndex];
  if (!project) {
    body.innerHTML = `<div class="editor-empty">还没有项目，点击“新增项目”开始。</div>`;
    return;
  }

  body.innerHTML = `
    <section class="editor-section">
      <div class="editor-section-title">
        <span>PROJECT</span>
        <button type="button" data-editor-action="delete-project">删除项目</button>
      </div>
      <div class="editor-grid">
        ${editorInput("标题", "title", project.title)}
        ${editorInput("项目 ID", "id", project.id)}
        ${editorCategoryInput(project)}
        ${editorInput("产品类型", "type", project.type)}
        ${editorInput("封面图路径", "cover", project.cover)}
        ${editorInput("大卡视觉路径", "cardVisual", project.cardVisual || "")}
        ${editorInput("工具标签", "tools", project.tools.join(" / "))}
      </div>
      <label class="editor-check">
        <input type="checkbox" data-editor-field="featured" ${project.featured ? "checked" : ""} />
        首页精选案例
      </label>
      ${editorTextarea("项目简介", "summary", project.summary)}
    </section>

    <section class="editor-section">
      <div class="editor-section-title">
        <span>COMPARISON</span>
        <button type="button" data-editor-action="toggle-comparison">${project.comparison ? "移除对比" : "添加对比"}</button>
      </div>
      ${project.comparison ? editorComparison(project.comparison) : `<p class="editor-note compact">这个项目暂时没有前后对比模块。</p>`}
    </section>

    <section class="editor-section">
      <div class="editor-section-title">
        <span>DESIGN NOTES</span>
        <button type="button" data-editor-action="add-note">增加文字</button>
      </div>
      <div class="editor-list">
        ${project.narrative.map((item, index) => editorNoteItem(item, index)).join("")}
      </div>
    </section>

    <section class="editor-section">
      <div class="editor-section-title">
        <span>GALLERY</span>
        <button type="button" data-editor-action="add-gallery">增加图片</button>
      </div>
      <div class="editor-gallery-list">
        ${project.gallery.map((image, index) => editorGalleryItem(image, index)).join("")}
      </div>
    </section>
  `;
}

function editorInput(label, field, value) {
  return `
    <label class="editor-field">
      <span>${label}</span>
      <input type="text" value="${escapeAttribute(value ?? "")}" data-editor-field="${field}" />
    </label>
  `;
}

function editorTextarea(label, field, value) {
  return `
    <label class="editor-field editor-field-wide">
      <span>${label}</span>
      <textarea rows="4" data-editor-field="${field}">${escapeHtml(value ?? "")}</textarea>
    </label>
  `;
}

function editorCategoryInput(project) {
  return `
    <label class="editor-field">
      <span>作品分类</span>
      <select data-editor-field="category">
        ${data.categories.map((category) => `<option value="${escapeAttribute(category)}" ${category === project.category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
      </select>
    </label>
    <button class="editor-inline-button" type="button" data-editor-action="add-category">新增分类/产品类型</button>
  `;
}

function editorComparison(comparison) {
  return `
    <div class="editor-grid">
      ${editorCompareInput("标题", "heading", comparison.heading || "")}
      ${editorCompareInput("前图路径", "before", comparison.before || "")}
      ${editorCompareInput("后图路径", "after", comparison.after || "")}
      ${editorCompareInput("前图标签", "beforeLabel", comparison.beforeLabel || "")}
      ${editorCompareInput("后图标签", "afterLabel", comparison.afterLabel || "")}
    </div>
  `;
}

function editorCompareInput(label, field, value) {
  return `
    <label class="editor-field">
      <span>${label}</span>
      <input type="text" value="${escapeAttribute(value)}" data-compare-field="${field}" />
    </label>
  `;
}

function editorNoteItem(item, index) {
  return `
    <article class="editor-list-item" data-note-index="${index}">
      <textarea rows="3" data-note-field>${escapeHtml(item)}</textarea>
      <div class="editor-mini-actions">
        <button type="button" data-editor-action="note-up" data-index="${index}">上移</button>
        <button type="button" data-editor-action="note-down" data-index="${index}">下移</button>
        <button type="button" data-editor-action="note-delete" data-index="${index}">删除</button>
      </div>
    </article>
  `;
}

function editorGalleryItem(image, index) {
  return `
    <article class="editor-gallery-item" data-gallery-index="${index}">
      <img src="${escapeAttribute(image.src || "")}" alt="" loading="lazy" />
      <label>
        <span>图片路径</span>
        <input type="text" value="${escapeAttribute(image.src || "")}" data-gallery-field="src" />
      </label>
      <label>
        <span>说明文字</span>
        <textarea rows="2" data-gallery-field="caption">${escapeHtml(image.caption || "")}</textarea>
      </label>
      <label class="editor-file">
        <span>选择本机图片</span>
        <input type="file" accept="image/*" data-gallery-file="${index}" />
      </label>
      <div class="editor-mini-actions">
        <button type="button" data-editor-action="gallery-up" data-index="${index}">上移</button>
        <button type="button" data-editor-action="gallery-down" data-index="${index}">下移</button>
        <button type="button" data-editor-action="gallery-delete" data-index="${index}">删除</button>
      </div>
    </article>
  `;
}

function syncEditorForm(refresh = true) {
  const panel = document.querySelector("#portfolio-editor");
  const project = data.projects[editorState.projectIndex];
  if (!panel || !project) return;

  panel.querySelectorAll("[data-editor-field]").forEach((field) => {
    const key = field.dataset.editorField;
    if (field.type === "checkbox") {
      project[key] = field.checked;
      return;
    }
    if (key === "tools") {
      project.tools = field.value
        .split(/[\/,，、]+/)
        .map((item) => item.trim())
        .filter(Boolean);
      return;
    }
    project[key] = field.value.trim();
  });

  if (project.comparison) {
    panel.querySelectorAll("[data-compare-field]").forEach((field) => {
      project.comparison[field.dataset.compareField] = field.value.trim();
    });
  }

  panel.querySelectorAll("[data-note-index]").forEach((item) => {
    const index = Number(item.dataset.noteIndex);
    const textarea = item.querySelector("[data-note-field]");
    project.narrative[index] = textarea.value.trim();
  });

  panel.querySelectorAll("[data-gallery-index]").forEach((item) => {
    const index = Number(item.dataset.galleryIndex);
    const src = item.querySelector('[data-gallery-field="src"]').value.trim();
    const caption = item.querySelector('[data-gallery-field="caption"]').value.trim();
    project.gallery[index] = { src, caption };
  });

  normalizePortfolioData(data);
  if (!data.categories.includes(activeCategory)) activeCategory = data.categories[0] || activeCategory;
  if (refresh) refreshPortfolioView();
}

function runEditorAction(action, button) {
  const project = data.projects[editorState.projectIndex];
  if (!project) return;

  syncEditorForm(false);

  const index = Number(button.dataset.index);
  if (action === "delete-project") deleteEditorProject();
  if (action === "add-category") addEditorCategory();
  if (action === "toggle-comparison") toggleEditorComparison();
  if (action === "add-note") project.narrative.push("新的项目说明文字");
  if (action === "note-delete") project.narrative.splice(index, 1);
  if (action === "note-up") moveArrayItem(project.narrative, index, index - 1);
  if (action === "note-down") moveArrayItem(project.narrative, index, index + 1);
  if (action === "add-gallery") project.gallery.push({ src: project.cover || "", caption: "新的图片说明" });
  if (action === "gallery-delete") project.gallery.splice(index, 1);
  if (action === "gallery-up") moveArrayItem(project.gallery, index, index - 1);
  if (action === "gallery-down") moveArrayItem(project.gallery, index, index + 1);

  refreshPortfolioView();
  renderEditor();
}

function addEditorProject() {
  syncEditorForm(false);
  const fallbackCategory = data.categories.find((category) => category !== data.categories[0]) || "电商设计";
  const project = {
    id: `project-${Date.now()}`,
    title: "新作品项目",
    category: fallbackCategory,
    type: "新产品类型",
    cover: "",
    cardVisual: "",
    summary: "在这里填写这个项目的设计目标、视觉亮点和你的工作内容。",
    tools: ["Photoshop"],
    featured: false,
    gallery: [],
    narrative: ["在这里填写项目亮点。"]
  };

  data.projects.unshift(project);
  if (!data.categories.includes(project.category)) data.categories.push(project.category);
  editorState.projectIndex = 0;
  refreshPortfolioView();
  renderEditor();
  setEditorOpen(true);
}

function deleteEditorProject() {
  const project = data.projects[editorState.projectIndex];
  if (!project || !window.confirm(`确定删除“${project.title}”吗？`)) return;
  data.projects.splice(editorState.projectIndex, 1);
  editorState.projectIndex = Math.max(0, editorState.projectIndex - 1);
}

function addEditorCategory() {
  const category = window.prompt("输入新的作品分类或产品类型");
  if (!category) return;
  const trimmed = category.trim();
  if (!trimmed) return;
  if (!data.categories.includes(trimmed)) data.categories.push(trimmed);
  const project = data.projects[editorState.projectIndex];
  if (project) project.category = trimmed;
}

function toggleEditorComparison() {
  const project = data.projects[editorState.projectIndex];
  if (!project) return;
  if (project.comparison) {
    delete project.comparison;
    return;
  }
  project.comparison = {
    heading: "前后对比",
    before: "",
    after: "",
    beforeLabel: "修改前",
    afterLabel: "修改后"
  };
}

function importGalleryFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  const index = Number(input.dataset.galleryFile);
  const reader = new FileReader();
  reader.onload = () => {
    const project = data.projects[editorState.projectIndex];
    if (!project || !project.gallery[index]) return;
    project.gallery[index].src = reader.result;
    if (!project.gallery[index].caption) project.gallery[index].caption = file.name;
    refreshPortfolioView();
    renderEditor();
  };
  reader.readAsDataURL(file);
}

function saveEditorDraft() {
  syncEditorForm(false);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    refreshPortfolioView();
    renderEditorProjectSelect();
    window.alert("已保存到本地草稿。");
  } catch (error) {
    window.alert("保存失败：图片数据可能太大。建议把图片放到 assets 文件夹，再在图片路径里填写相对路径。");
    console.warn(error);
  }
}

function exportEditorData() {
  syncEditorForm(false);
  const source = `window.PORTFOLIO_DATA = ${JSON.stringify(data, null, 2).replace(/</g, "\\u003c")};\n`;
  const blob = new Blob([source], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "projects.js";
  link.click();
  URL.revokeObjectURL(url);
}

function resetEditorData() {
  if (!window.confirm("确定恢复到原始 projects.js 数据吗？本地草稿会被删除。")) return;
  window.localStorage.removeItem(STORAGE_KEY);
  data = normalizePortfolioData(JSON.parse(JSON.stringify(ORIGINAL_DATA)));
  window.PORTFOLIO_DATA = data;
  editorState.projectIndex = 0;
  activeCategory = data.categories[0] || activeCategory;
  refreshPortfolioView();
  renderEditor();
}

function refreshPortfolioView() {
  renderFilters();
  renderTags();
  renderProjects();
}

function moveArrayItem(array, from, to) {
  if (to < 0 || to >= array.length || from < 0 || from >= array.length) return;
  const [item] = array.splice(from, 1);
  array.splice(to, 0, item);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function bindGlobalEvents() {
  filterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderProjects();
  });

  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-project-id]");
    if (card) openProject(card.dataset.projectId);
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest("[data-project-id]");
    if (!card) return;
    event.preventDefault();
    openProject(card.dataset.projectId);
  });

  document.querySelector(".close-dialog").addEventListener("click", () => projectDialog.close());
  document.querySelector(".close-lightbox").addEventListener("click", () => lightbox.close());

  featuredButton.addEventListener("click", () => {
    const featured = data.projects.find((project) => project.featured) ?? data.projects[0];
    openProject(featured.id);
  });
}

init();
