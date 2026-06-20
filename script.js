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

const loadGoogleAnalytics = () => {
  if (!ABG_GA_MEASUREMENT_ID || window.gtag) {
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

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const campDisplayOrder = [
  "total-skill-integration",
  "position-specific-clinic",
  "body-contact-prep-camp",
  "high-performance-prep",
  "private-sessions",
];

const sortCampsForDisplay = (camps) =>
  [...camps].sort((firstCamp, secondCamp) => {
    const firstIndex = campDisplayOrder.indexOf(slugify(firstCamp.title));
    const secondIndex = campDisplayOrder.indexOf(slugify(secondCamp.title));
    const firstRank = firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex;
    const secondRank = secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex;

    return firstRank - secondRank;
  });

const activeCamps = sortCampsForDisplay(siteData.camps.filter((camp) => !camp.isPast));
const publicCamps = activeCamps.filter((camp) => camp.status !== "Private");
const campLineup = activeCamps.filter((camp) => camp.featured || camp.status === "Private");

const getCampRegistrationUrl = (camp) => `./register.html?camp=${encodeURIComponent(slugify(camp.title))}`;

const getCampCtaLabel = (camp) => {
  if (camp.status === "Private") {
    return "Ask About Private Or Team Coaching";
  }

  if (camp.title === "Position-Specific Clinic") {
    return "Register Position-Specific";
  }

  if (camp.title === "Body Contact Prep Camp") {
    return "Register Body Contact";
  }

  return `Register for ${camp.dates}`;
};

const getCampCtaUrl = (camp) =>
  camp.status === "Private" ? camp.registrationUrl : getCampRegistrationUrl(camp);

const getCampScheduleLabel = (camp) =>
  camp.status === "Private" ? "Options & Availability" : "Age Groups & Ice Times";

const renderAvailabilityBadge = (camp) =>
  camp.availability
    ? `<span class="availability-badge availability-badge-${camp.availability.tone || "open"}">${camp.availability.label}</span>`
    : "";

const renderCampCard = (camp) => {
  const campSlug = slugify(camp.title);
  const imageStyles = [
    camp.imagePosition ? `object-position: ${camp.imagePosition};` : "",
    camp.imageScale ? `transform: scale(${camp.imageScale});` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const ageItems = camp.ages
    .map(
      (ageGroup, index) => `
        <li>
          <span class="camp-slot-group">${ageGroup}</span>
          <span class="camp-slot-time">${camp.schedule[index]}</span>
        </li>
      `
    )
    .join("");

  return `
    <article class="camp-card" id="${campSlug}">
      <div class="camp-card-media">
        <img src="${camp.image}" alt="${camp.title} camp photo"${imageStyles ? ` style="${imageStyles}"` : ""} />
        <span class="camp-status">${camp.status}</span>
      </div>
      <div class="camp-card-body">
        <div class="camp-card-top">
          <div>
            <p class="program-month camp-card-date-line">
              <span class="camp-card-dates">${camp.dates}</span>
              ${renderAvailabilityBadge(camp)}
            </p>
            <h3>${camp.title}</h3>
          </div>
          <p class="camp-price-pill">${camp.price}</p>
        </div>
        <p class="camp-lead">${camp.shortDescription}</p>
        <div class="camp-meta-row">
          <span>${camp.ratio}</span>
        </div>
        <p class="camp-location">
          <a href="${camp.locationUrl}" target="_blank" rel="noreferrer">${camp.location}</a>
        </p>
        <a
          class="button"
          href="${getCampCtaUrl(camp)}"
          data-track-event="camp_card_register_click"
          data-track-camp="${campSlug}"
          data-track-label="${camp.title}"
        >${getCampCtaLabel(camp)}</a>
        <div class="camp-schedule-block">
          <p class="camp-schedule-label">${getCampScheduleLabel(camp)}</p>
          <ul class="age-list">${ageItems}</ul>
        </div>
        <details class="camp-more">
          <summary>More Camp Details</summary>
          <p class="camp-description">${camp.fullDescription}</p>
        </details>
      </div>
    </article>
  `;
};

const renderCoachCard = (coach, mode = "preview") => {
  const highlights = coach.highlights.map((item) => `<li>${item}</li>`).join("");
  const previewOrigin = coach.role.replace(" Minor Hockey", "<br />Minor Hockey");
  const previewTeamLine = `
    <span class="coach-position">${coach.position}</span>
    <span class="coach-teamline">${coach.currentTeam} (${coach.currentLevel})</span>
  `;

  if (mode === "full") {
    const pathway = (coach.pathway || [])
      .map(
        (stop) => `
          <article class="coach-pathway-card">
            <div class="coach-pathway-media">
              <img src="${stop.image}" alt="${stop.imageAlt}" />
            </div>
            <div class="coach-pathway-body">
              <p class="program-month">Pathway</p>
              <h4>${stop.title}</h4>
              <ul class="coach-pathway-points">
                ${stop.bullets.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          </article>
        `
      )
      .join("");

    return `
      <article class="coach-profile">
        <div class="coach-profile-top">
          <img
            src="${coach.headshot}"
            alt="${coach.name} headshot"
            style="--coach-profile-position: ${coach.mobilePreviewPosition || coach.previewPosition || "center top"};"
          />
          <div class="coach-profile-intro">
            <p class="program-month">${coach.role}</p>
            <h3>${coach.name}</h3>
            <p class="coach-role">${coach.position} • ${coach.currentTeam} (${coach.currentLevel})</p>
            <p class="coach-location">${coach.location}</p>
            <p class="coach-summary">${coach.summary}</p>
            <ul class="coach-highlights">${highlights}</ul>
          </div>
        </div>
        <div class="coach-profile-copy">
          <p>${coach.bio}</p>
          <p>${coach.detailedBio || ""}</p>
        </div>
        <div class="coach-pathway-grid">
          ${pathway}
        </div>
      </article>
    `;
  }

  return `
    <article class="coach-card">
      <div class="coach-card-media">
        <img
          src="${coach.headshot}"
          alt="${coach.name} headshot"
          style="--coach-preview-position: ${coach.previewPosition || "center top"}; --coach-preview-mobile-position: ${coach.mobilePreviewPosition || coach.previewPosition || "center top"};"
        />
      </div>
      <div class="coach-card-body">
        <p class="program-month coach-origin">${previewOrigin}</p>
        <h3 class="coach-name">${coach.name}</h3>
        <p class="coach-role">${previewTeamLine}</p>
        <p class="coach-summary">${coach.summary}</p>
      </div>
    </article>
  `;
};

const renderTestimonialSlider = (testimonials) => {
  const slides = testimonials
    .map(
      (testimonial, index) => `
        <article class="testimonial-slide" data-testimonial-slide="${index}">
          <div class="testimonial-slide-image">
            <img src="${testimonial.image}" alt="${testimonial.name} testimonial background" />
          </div>
          <div class="testimonial-slide-panel">
            <blockquote>${testimonial.quote}</blockquote>
            <div class="testimonial-attribution">
              <p class="quote-credit">${testimonial.name}</p>
              <p class="testimonial-meta">${testimonial.roleLabel} • ${testimonial.team}</p>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  const dots = testimonials
    .map(
      (_, index) => `
        <button
          class="testimonial-dot${index === 0 ? " is-active" : ""}"
          type="button"
          aria-label="Show testimonial ${index + 1}"
          data-testimonial-dot="${index}"
        ></button>
      `
    )
    .join("");

  return `
    <div class="testimonial-carousel">
      <div class="testimonial-track" data-testimonial-track>
        ${slides}
      </div>
      <div class="testimonial-controls">
        <button class="testimonial-arrow" type="button" data-testimonial-arrow="prev" aria-label="Previous testimonial">Prev</button>
        <div class="testimonial-dots">${dots}</div>
        <button class="testimonial-arrow" type="button" data-testimonial-arrow="next" aria-label="Next testimonial">Next</button>
      </div>
    </div>
  `;
};

for (const target of campTargets) {
  const mode = target.dataset.campGrid;
  const camps = mode === "featured" ? publicCamps.filter((camp) => camp.featured) : campLineup;
  target.innerHTML = camps.map(renderCampCard).join("");
}

for (const target of coachTargets) {
  const mode = target.dataset.coachGrid;
  const coaches = mode === "featured" ? siteData.coaches.filter((coach) => coach.featured) : siteData.coaches;
  const view = mode === "all" ? "full" : "preview";
  target.innerHTML = coaches.map((coach) => renderCoachCard(coach, view)).join("");
}

for (const target of testimonialTargets) {
  const testimonials = siteData.testimonials.filter((testimonial) => testimonial.featured);
  target.innerHTML = renderTestimonialSlider(testimonials);

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

  window.addEventListener(
    "touchstart",
    (event) => {
      if (!isMobileViewport()) {
        return;
      }

      touchStartY = event.touches[0]?.clientY ?? 0;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!isMobileViewport()) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;

      if (Math.abs(deltaY) < 2) {
        return;
      }

      event.preventDefault();
      getScroller().scrollTop += deltaY;
      touchStartY = currentY;
    },
    { passive: false }
  );
};

const setupMobileConversionBar = () => {
  const heroCopy = document.querySelector(".hero-copy");
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
