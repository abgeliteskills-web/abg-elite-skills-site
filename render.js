// Shared markup builders for camps, coaches, and testimonials.
// Loaded before script.js in the browser, and by tools/prerender.mjs, which writes the same
// markup straight into the HTML so crawlers that don't run JavaScript (most AI bots) can read it.

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const campDisplayOrder = [
  "summer-opener",
  "high-performance-prep",
  "total-skill-integration",
  "body-contact-prep-camp",
  "position-specific-clinic",
];

const sortCampsForDisplay = (camps) =>
  [...camps].sort((firstCamp, secondCamp) => {
    const firstIndex = campDisplayOrder.indexOf(slugify(firstCamp.title));
    const secondIndex = campDisplayOrder.indexOf(slugify(secondCamp.title));
    const firstRank = firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex;
    const secondRank = secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex;

    return firstRank - secondRank;
  });

// Which records each [data-*] section shows. Used by the browser and the prerender tool alike.
const selectCampsForGrid = (data) =>
  sortCampsForDisplay(data.camps.filter((camp) => !camp.isPast)).filter((camp) => camp.featured);

const selectCoachesForGrid = (data, mode) =>
  mode === "featured" ? data.coaches.filter((coach) => coach.featured) : data.coaches;

const selectTestimonials = (data) => data.testimonials.filter((testimonial) => testimonial.featured);

const renderCampCard = (camp) => {
  const campSlug = slugify(camp.title);
  const imageStyles = [
    camp.imagePosition ? `object-position: ${camp.imagePosition};` : "",
    camp.imageScale ? `transform: scale(${camp.imageScale});` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const media = camp.video
    ? `<video src="${camp.video}" poster="${camp.image}" muted loop playsinline preload="none" class="lazy-video" aria-label="${camp.title} recap video"></video>`
    : `<img src="${camp.image}" alt="${camp.title} camp photo" loading="lazy" decoding="async"${imageStyles ? ` style="${imageStyles}"` : ""} />`;

  return `
    <article class="camp-card" id="${campSlug}">
      <div class="camp-card-media">
        ${media}
        <span class="camp-status">${camp.status}</span>
      </div>
      <div class="camp-card-body">
        <h3>${camp.title}</h3>
        <p class="camp-lead">${camp.shortDescription}</p>
        <details class="camp-more">
          <summary>More Camp Details</summary>
          <p class="camp-description">${camp.fullDescription}</p>
        </details>
      </div>
    </article>
  `;
};

// "Current team · where they played college" when set in data.js, otherwise "Team (Level)".
const getCoachTeamLine = (coach) =>
  coach.teamLine || (coach.currentLevel ? `${coach.currentTeam} (${coach.currentLevel})` : coach.currentTeam);

const renderCoachCard = (coach, mode = "preview") => {
  const highlights = coach.highlights.map((item) => `<li>${item}</li>`).join("");
  const previewOrigin = coach.role.replace(" Minor Hockey", "<br />Minor Hockey");
  const previewTeamLine = `
    <span class="coach-position">${coach.position}</span>
    <span class="coach-teamline">${getCoachTeamLine(coach)}</span>
  `;

  if (mode === "full") {
    const pathway = (coach.pathway || [])
      .map(
        (stop) => `
          <article class="coach-pathway-card">
            <div class="coach-pathway-media">
              <img src="${stop.image}" alt="${stop.imageAlt}" loading="lazy" decoding="async" />
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
      <article class="coach-profile" id="${slugify(coach.name)}">
        <div class="coach-profile-top">
          <img
            src="${coach.headshot}"
            alt="${coach.name} headshot"
            loading="lazy"
            decoding="async"
            style="--coach-profile-position: ${coach.mobilePreviewPosition || coach.previewPosition || "center top"};"
          />
          <div class="coach-profile-intro">
            <p class="program-month coach-origin-line">
              ${coach.minorHockeyLogo ? `<img class="coach-minor-logo" src="${coach.minorHockeyLogo}" alt="" loading="lazy" decoding="async" />` : ""}
              <span>${coach.role}</span>
            </p>
            <h3>${coach.name}</h3>
            <p class="coach-role">${coach.position} • ${getCoachTeamLine(coach)}</p>
            <p class="coach-location">${coach.location}</p>
            <p class="coach-summary">${coach.summary}</p>
            <ul class="coach-highlights">${highlights}</ul>
          </div>
        </div>
        <div class="coach-profile-copy">
          <p>${coach.bio}</p>
          ${
            coach.detailedBio
              ? `<details class="camp-more coach-more">
                  <summary>Read Full Bio</summary>
                  <p class="camp-description">${coach.detailedBio}</p>
                </details>`
              : ""
          }
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
          loading="lazy"
          decoding="async"
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
            <img src="${testimonial.image}" alt="${testimonial.name} testimonial background"${index === 0 ? "" : ' loading="lazy"'} decoding="async" />
          </div>
          <div class="testimonial-slide-panel">
            <blockquote>${testimonial.quote}</blockquote>
            <div class="testimonial-attribution">
              <p class="quote-credit">${testimonial.name}</p>
              <p class="testimonial-meta">${[testimonial.roleLabel, testimonial.team].filter(Boolean).join(" • ")}</p>
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

const renderCampGrid = (data) => selectCampsForGrid(data).map(renderCampCard).join("");

const renderCoachGrid = (data, mode) =>
  selectCoachesForGrid(data, mode)
    .map((coach) => renderCoachCard(coach, mode === "all" ? "full" : "preview"))
    .join("");

const renderTestimonials = (data) => renderTestimonialSlider(selectTestimonials(data));
