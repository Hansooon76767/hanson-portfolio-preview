const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const openingScreen = document.querySelector("[data-opening]");
const openingVideo = document.querySelector("[data-opening-video]");
const revealItems = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");
const spotlightItems = document.querySelectorAll(".spotlight");
const chips = document.querySelectorAll(".chip");
const splitTitle = document.querySelector("[data-split]");
const materialConsole = document.querySelector("[data-console]");
const materialDisplay = document.querySelector("[data-material-display]");
const veinField = document.querySelector("[data-vein-field]");
const counters = document.querySelectorAll("[data-count]");
const brandMarks = document.querySelectorAll(".brand-mark");
const productModal = document.querySelector("[data-product-modal]");
const productTriggers = document.querySelectorAll("[data-product]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const startAtTop = () => {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
};

startAtTop();
window.addEventListener("pageshow", startAtTop);

document.body.classList.add("is-loading");

const finishOpening = () => {
  if (!openingScreen?.classList.contains("is-hidden")) {
    openingScreen?.classList.add("is-hidden");
    window.setTimeout(() => {
      document.body.classList.remove("is-loading");
    }, reduceMotion ? 0 : 1800);
  }
};

if (openingScreen) {
  const fallbackDelay = reduceMotion ? 160 : 5600;
  const minimumDelay = reduceMotion ? 80 : 3900;
  let canFinish = false;

  const readyOpening = () => openingScreen.classList.add("is-ready");
  const finishWhenAllowed = () => {
    if (canFinish) {
      finishOpening();
      return;
    }
    window.setTimeout(finishOpening, minimumDelay);
  };

  window.setTimeout(() => {
    canFinish = true;
  }, minimumDelay);

  window.addEventListener("load", () => {
    readyOpening();

    if (reduceMotion) {
      openingVideo?.pause();
      finishOpening();
      return;
    }

    const playAttempt = openingVideo?.play();
    if (playAttempt) {
      playAttempt.catch(() => window.setTimeout(finishOpening, 900));
    }

    window.setTimeout(finishOpening, fallbackDelay);
  }, { once: true });

  openingVideo?.addEventListener("loadeddata", readyOpening, { once: true });
  openingVideo?.addEventListener("ended", finishWhenAllowed, { once: true });
  openingVideo?.addEventListener("error", () => window.setTimeout(finishOpening, 900), { once: true });
  openingScreen.addEventListener("click", finishOpening, { once: true });
} else {
  document.body.classList.remove("is-loading");
}

if (splitTitle) {
  const words = splitTitle.textContent.trim().split(/\s+/);
  splitTitle.innerHTML = words
    .map((word, index) => `<span class="word"><span style="--i:${index}">${word}</span></span>`)
    .join(" ");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 36);
};

const updateProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
};

const onScroll = () => {
  updateHeader();
  updateProgress();
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

spotlightItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((0.5 - y / rect.height)) * 8;
    item.style.setProperty("--mx", `${x}px`);
    item.style.setProperty("--my", `${y}px`);
    item.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.toggle("is-active", item === chip));
  });
});

const productData = {
  cup: {
    kicker: "Drinkware",
    title: "Morning Cup",
    price: "$38",
    image: "./assets/cup-v2.png",
    gallery: ["./assets/cup-v2.png", "./assets/hero-still-life-v2.png", "./assets/poster-v2.png"],
    copy: "A soft-grip daily cup with a raw mineral finish, built for morning light, warm hands, and quiet tables.",
    stock: "Ships in 2-4 days",
    options: ["Raw clay", "Oat glaze", "Warm stone"],
    material: "Speckled stoneware",
    touch: "soft / matte",
    use: "daily cup"
  },
  diffuser: {
    kicker: "Scent",
    title: "Rainwood Diffuser",
    price: "$64",
    image: "./assets/fragrance-v2.png",
    gallery: ["./assets/fragrance-v2.png", "./assets/store.png", "./assets/poster-v2.png"],
    copy: "Wood, linen, leaf, and mineral notes composed for rooms that should feel calm without feeling empty.",
    stock: "Small batch refillable scent",
    options: ["Hinoki leaf", "Rainwood", "Oat linen"],
    material: "Ceramic / reed / amber glass",
    touch: "warm / dry",
    use: "room scent"
  },
  vessel: {
    kicker: "Ceramic",
    title: "Quiet Vessel",
    price: "$82",
    image: "./assets/vessels-v2.png",
    gallery: ["./assets/vessels-v2.png", "./assets/hero-still-life-v2.png", "./assets/skincare-v2.png"],
    copy: "A low stoneware form for shelves, tables, and entryway rituals, designed to hold space rather than fill it.",
    stock: "Hand-finished object",
    options: ["Oat stone", "Leaf ash", "Warm clay"],
    material: "Matte stoneware",
    touch: "porous / grounded",
    use: "shelf object"
  },
  care: {
    kicker: "Care",
    title: "Botanical Care",
    price: "$56",
    image: "./assets/skincare-v2.png",
    gallery: ["./assets/skincare-v2.png", "./assets/cup-v2.png", "./assets/store.png"],
    copy: "Sink-side care objects with frosted glass, ceramic tray surfaces, and a restrained botanical ritual.",
    stock: "Refill set available",
    options: ["Hand wash", "Care duo", "Tray set"],
    material: "Frosted glass / ceramic",
    touch: "clean / soft",
    use: "sink ritual"
  }
};

let activeProduct = productData.cup;
let activeQuantity = 1;

const setButtonState = (buttons, activeButton) => {
  buttons.forEach((button) => button.classList.toggle("is-active", button === activeButton));
};

const renderProductModal = (productKey) => {
  if (!productModal) return;
  const product = productData[productKey] || productData.cup;
  activeProduct = product;
  activeQuantity = 1;

  const image = productModal.querySelector("[data-modal-image]");
  const kicker = productModal.querySelector("[data-modal-kicker]");
  const title = productModal.querySelector("[data-modal-title]");
  const copy = productModal.querySelector("[data-modal-copy]");
  const price = productModal.querySelector("[data-modal-price]");
  const stock = productModal.querySelector("[data-modal-stock]");
  const material = productModal.querySelector("[data-modal-material]");
  const touch = productModal.querySelector("[data-modal-touch]");
  const use = productModal.querySelector("[data-modal-use]");
  const qty = productModal.querySelector("[data-qty]");
  const finishOptions = productModal.querySelector("[data-finish-options]");
  const buy = productModal.querySelector("[data-modal-buy]");
  const thumbs = productModal.querySelectorAll("[data-modal-thumb]");

  if (image) {
    image.src = product.image;
    image.alt = `${product.title} product image`;
  }
  if (kicker) kicker.textContent = product.kicker;
  if (title) title.textContent = product.title;
  if (copy) copy.textContent = product.copy;
  if (price) price.textContent = product.price;
  if (stock) stock.textContent = product.stock;
  if (material) material.textContent = product.material;
  if (touch) touch.textContent = product.touch;
  if (use) use.textContent = product.use;
  if (qty) qty.textContent = activeQuantity;
  if (buy) buy.textContent = `Add ${product.title} to bag`;

  if (finishOptions) {
    finishOptions.innerHTML = product.options
      .map((option, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button">${option}</button>`)
      .join("");
    finishOptions.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => setButtonState(finishOptions.querySelectorAll("button"), button));
    });
  }

  thumbs.forEach((thumb, index) => {
    const src = product.gallery[index] || product.image;
    thumb.style.setProperty("--thumb-image", `url("${src}")`);
    thumb.classList.toggle("is-active", index === 0);
    thumb.onclick = () => {
      if (image) image.src = src;
      setButtonState(thumbs, thumb);
    };
  });
};

const openProductModal = (productKey) => {
  if (!productModal) return;
  renderProductModal(productKey);
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  productModal.querySelector(".modal-close")?.focus();
};

const closeProductModal = () => {
  if (!productModal) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

productTriggers.forEach((trigger) => {
  const open = () => openProductModal(trigger.dataset.product);
  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

if (productModal) {
  productModal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeProductModal);
  });

  productModal.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
    activeQuantity = Math.max(1, activeQuantity - 1);
    productModal.querySelector("[data-qty]").textContent = activeQuantity;
  });

  productModal.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
    activeQuantity = Math.min(9, activeQuantity + 1);
    productModal.querySelector("[data-qty]").textContent = activeQuantity;
  });

  productModal.querySelector("[data-modal-buy]")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    button.textContent = `Added ${activeQuantity} to bag`;
    window.setTimeout(() => {
      button.textContent = `Add ${activeProduct.title} to bag`;
    }, 1400);
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal?.classList.contains("is-open")) {
    closeProductModal();
  }
});

const materialData = {
  leaf: {
    number: "01",
    title: "Leaf Shadow",
    text: "Deep green contrast, low gloss, and vein-like rhythm for shadowed surfaces.",
    bg: "#172018",
    hue: "#172018",
    touch: "dry / cool",
    use: "hero shade"
  },
  walnut: {
    number: "02",
    title: "Walnut Grain",
    text: "Warm brown depth, visible movement, and enough weight to anchor pale ceramics.",
    bg: "#5b341f",
    hue: "#6b4226",
    touch: "warm / satin",
    use: "retail tables"
  },
  linen: {
    number: "03",
    title: "Oat Linen",
    text: "Soft woven light for quiet negative space, packaging, and editorial surfaces.",
    bg: "#bca98d",
    hue: "#eee5d6",
    touch: "soft / woven",
    use: "page canvas"
  },
  clay: {
    number: "04",
    title: "Raw Clay",
    text: "Matte mineral tactility for cups, vessels, and objects that ask to be held.",
    bg: "#9d8062",
    hue: "#b89b78",
    touch: "porous / matte",
    use: "product finish"
  }
};

if (materialConsole && materialDisplay) {
  const tabs = materialConsole.querySelectorAll("[data-material]");
  const hue = document.querySelector("[data-spec-hue]");
  const touch = document.querySelector("[data-spec-touch]");
  const use = document.querySelector("[data-spec-use]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.material;
      const data = materialData[key];
      if (!data) return;

      tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      materialConsole.style.setProperty("--console-bg", data.bg);
      materialConsole.style.setProperty("--scan-x", `${18 + [...tabs].indexOf(tab) * 20}%`);
      materialDisplay.innerHTML = `<span>${data.number}</span><h3>${data.title}</h3><p>${data.text}</p>`;
      if (hue) hue.textContent = data.hue;
      if (touch) touch.textContent = data.touch;
      if (use) use.textContent = data.use;
    });
  });
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    const duration = 1100;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased)).padStart(2, "0");
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach((counter) => countObserver.observe(counter));

brandMarks.forEach((mark) => {
  if (mark.querySelector("img") || !mark.textContent.trim()) return;

  const original = mark.textContent;
  const glyphs = "MORA";
  let frame = 0;
  let timer;

  mark.addEventListener("mouseenter", () => {
    clearInterval(timer);
    frame = 0;
    timer = setInterval(() => {
      mark.textContent = original
        .split("")
        .map((char, index) => (index < frame ? char : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join("");
      frame += 1;
      if (frame > original.length) {
        clearInterval(timer);
        mark.textContent = original;
      }
    }, 42);
  });
});

if (veinField) {
  const ctx = veinField.getContext("2d");
  const branches = Array.from({ length: 18 }, (_, index) => ({
    seed: index * 43,
    offset: Math.random() * Math.PI * 2,
    speed: 0.00018 + Math.random() * 0.00016,
    y: 0.08 + Math.random() * 0.84
  }));

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    veinField.width = Math.floor(veinField.clientWidth * ratio);
    veinField.height = Math.floor(veinField.clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time) => {
    const width = veinField.clientWidth;
    const height = veinField.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";

    branches.forEach((branch, index) => {
      const drift = Math.sin(time * branch.speed + branch.offset) * 34;
      const startX = width * (0.04 + (index % 4) * 0.22) + drift;
      const startY = height * branch.y;
      const endX = width * (0.74 + Math.sin(branch.offset) * 0.08);
      const endY = startY + Math.cos(time * branch.speed + branch.offset) * 120;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(width * 0.28, startY - 90, width * 0.48, endY + 70, endX, endY);
      ctx.strokeStyle = `rgba(238, 229, 214, ${0.06 + (index % 5) * 0.012})`;
      ctx.lineWidth = 0.7 + (index % 3) * 0.35;
      ctx.stroke();

      if (index % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo((startX + endX) / 2, (startY + endY) / 2);
        ctx.lineTo((startX + endX) / 2 + 80, (startY + endY) / 2 - 42);
        ctx.strokeStyle = "rgba(238, 229, 214, 0.045)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(draw);
}
