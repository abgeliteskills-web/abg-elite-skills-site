import { siteData } from "./data.js?v=6";

const campTargets = document.querySelectorAll("[data-camp-grid]");
const coachTargets = document.querySelectorAll("[data-coach-grid]");
const testimonialTargets = document.querySelectorAll("[data-testimonial-slider]");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

const renderCampCard = (camp) => {
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
    <article class="camp-card">
      <div class="camp-card-media">
        <img src="${camp.image}" alt="${camp.title} camp photo"${imageStyles ? ` style="${imageStyles}"` : ""} />
      </div>
      <div class="camp-card-body">
        <div class="camp-card-top">
          <div>
            <p class="program-month camp-card-date-line">
              <span class="camp-card-dates">${camp.dates}</span>
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
        <details class="camp-more">
          <summary>More Camp Details</summary>
          <p class="camp-description">${camp.fullDescription}</p>
        </details>
        <div class="camp-schedule-block">
          <p class="camp-schedule-label">Age Groups & Ice Times</p>
          <ul class="age-list">${ageItems}</ul>
        </div>
        <a class="button" href="${camp.registrationUrl}" target="_blank" rel="noreferrer">Register</a>
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
          <img src="${coach.headshot}" alt="${coach.name} headshot" />
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
  const camps = mode === "featured" ? siteData.camps.filter((camp) => camp.featured) : siteData.camps;
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

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

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
