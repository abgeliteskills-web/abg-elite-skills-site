const siteData = window.siteData || {
  camps: [],
  coaches: [],
  testimonials: [],
};

const campTargets = document.querySelectorAll("[data-camp-grid]");
const coachTargets = document.querySelectorAll("[data-coach-grid]");
const testimonialTargets = document.querySelectorAll("[data-testimonial-slider]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const ABG_GA_MEASUREMENT_ID = "G-ESNEFQVEWK";

window.dataLayer = window.dataLayer || [];

const IS_PRODUCTION_HOST = /(^|\.)abgeliteskills\.com$/.test(window.location.hostname);

const loadGoogleAnalytics = () => {
  if (!IS_PRODUCTION_HOST || !ABG_GA_MEASUREMENT_ID || window.gtag) {
    return;
  }

  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ABG_GA_MEASUREMENT_ID)}`;
  document.head.append(analyticsScript);

  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", ABG_GA_MEASUREMENT_ID, {
    transport_type: "beacon",
  });
};

const trackSiteEvent = (eventName, eventParams = {}) => {
  if (!eventName) {
    return;
  }

  const cleanedParams = Object.fromEntries(
    Object.entries(eventParams).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
  const analyticsParams = {
    transport_type: "beacon",
    ...cleanedParams,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, analyticsParams);
    return;
  }

  window.dataLayer.push({
    event: eventName,
    ...analyticsParams,
  });
};

window.abgTrackEvent = trackSiteEvent;
loadGoogleAnalytics();




for (const target of campTargets) {
  target.innerHTML = renderCampGrid(siteData);
}

const setupLazyVideos = () => {
  const lazyVideos = document.querySelectorAll("video.lazy-video");

  if (!lazyVideos.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    for (const video of lazyVideos) {
      video.play().catch(() => {});
    }
    return;
  }

  const videoObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      }
    },
    { threshold: 0.25 }
  );

  for (const video of lazyVideos) {
    videoObserver.observe(video);
  }
};

setupLazyVideos();

for (const target of coachTargets) {
  target.innerHTML = renderCoachGrid(siteData, target.dataset.coachGrid);
}

for (const target of testimonialTargets) {
  target.innerHTML = renderTestimonials(siteData);

  const slides = Array.from(target.querySelectorAll(".testimonial-slide"));
  const track = target.querySelector("[data-testimonial-track]");
  const carousel = target.querySelector(".testimonial-carousel");
  const dots = Array.from(target.querySelectorAll("[data-testimonial-dot]"));
  let activeIndex = 0;
  let autoAdvanceId;
  let touchStartX = 0;
  let touchEndX = 0;

  const setActiveSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    // Later slides load lazily; warm up the current and next photo so a slide never appears blank.
    [activeIndex, (activeIndex + 1) % slides.length].forEach((slideIndex) => {
      const image = slides[slideIndex]?.querySelector("img");
      if (image?.loading === "lazy") {
        image.loading = "eager";
      }
    });

    if (track) {
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
    }

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-pressed", String(dotIndex === activeIndex));
    });
  };

  const restartAutoAdvance = () => {
    window.clearInterval(autoAdvanceId);
    autoAdvanceId = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, 8000);
  };

  target.querySelector('[data-testimonial-arrow="prev"]')?.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1);
    restartAutoAdvance();
  });

  target.querySelector('[data-testimonial-arrow="next"]')?.addEventListener("click", () => {
    setActiveSlide(activeIndex + 1);
    restartAutoAdvance();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index);
      restartAutoAdvance();
    });
  });

  carousel?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });

  carousel?.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0]?.clientX ?? 0;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    setActiveSlide(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
    restartAutoAdvance();
  }, { passive: true });

  setActiveSlide(0);
  restartAutoAdvance();
}

document.addEventListener("click", (event) => {
  const trackedElement = event.target.closest("[data-track-event]");

  if (!trackedElement) {
    return;
  }

  trackSiteEvent(trackedElement.dataset.trackEvent, {
    link_text: trackedElement.textContent.trim().replace(/\s+/g, " "),
    link_url: trackedElement.href || trackedElement.getAttribute("href"),
    page_path: window.location.pathname,
    camp_slug: trackedElement.dataset.trackCamp,
    event_label: trackedElement.dataset.trackLabel,
    placement: trackedElement.dataset.trackPlacement,
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

const setupMobileShellScrollFallback = () => {
  if (!["camps", "register"].includes(document.body.dataset.page)) {
    return;
  }

  const isMobileViewport = () => window.matchMedia("(max-width: 860px)").matches;
  const getScroller = () => {
    const pageShell = document.querySelector(".page-shell");

    if (isMobileViewport() && pageShell) {
      return pageShell;
    }

    return document.scrollingElement || document.documentElement;
  };
  let touchStartY = 0;

  window.addEventListener(
    "wheel",
    (event) => {
      if (!isMobileViewport()) {
        return;
      }

      const scroller = getScroller();

      if (scroller.scrollHeight <= scroller.clientHeight) {
        return;
      }

      event.preventDefault();
      scroller.scrollTop += event.deltaY;
    },
    { passive: false }
  );

};

const setupMobileConversionBar = () => {
  const heroCopy = document.querySelector(".home-hero-copy, .hero-copy");
  const mobileConversionBar = document.querySelector(".mobile-conversion-bar");

  if (!heroCopy || !mobileConversionBar || document.body.dataset.page !== "home") {
    return;
  }

  const updateMobileConversionBar = () => {
    const shouldShow = heroCopy.getBoundingClientRect().bottom < 90;
    document.body.classList.toggle("is-mobile-cta-visible", shouldShow);
  };

  updateMobileConversionBar();
  window.addEventListener("scroll", updateMobileConversionBar, { passive: true });
  window.addEventListener("resize", updateMobileConversionBar);
};

setupMobileShellScrollFallback();
setupMobileConversionBar();

const revealItems = document.querySelectorAll(".reveal");
const revealAllItems = () => {
  for (const item of revealItems) {
    item.classList.remove("is-pending");
    item.classList.add("is-visible");
  }
};

const markInitialRevealState = () => {
  const viewportCutoff = window.innerHeight * 0.9;

  for (const item of revealItems) {
    if (item.getBoundingClientRect().top > viewportCutoff) {
      item.classList.add("is-pending");
      continue;
    }

    item.classList.add("is-visible");
  }
};

markInitialRevealState();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.remove("is-pending");
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.16,
    }
  );

  for (const item of revealItems) {
    if (!item.classList.contains("is-pending")) {
      continue;
    }

    observer.observe(item);
  }

  // Fallback for browsers that support IntersectionObserver but fail to
  // report initial intersections consistently on static pages.
  window.setTimeout(() => {
    revealAllItems();
  }, 700);
} else {
  revealAllItems();
}

// The homepage hero video is ambient: hold on the poster frame for reduced motion or Data Saver.
const heroVideo = document.querySelector(".home-hero-video");
const prefersLessData = Boolean(navigator.connection?.saveData);
if (heroVideo && (prefersLessData || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.preload = "none";
  heroVideo.pause();
}
