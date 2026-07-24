const registrationSiteData = window.siteData || {
  camps: [],
};

const registrationSlugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getRegistrationCampSlug = (camp) => registrationSlugify(camp.title);
const REGISTRATION_CAMP_DISPLAY_ORDER = [
  "high-performance-prep",
  "total-skill-integration",
  "body-contact-prep-camp",
  "position-specific-clinic",
];
const sortRegistrationCampsForDisplay = (camps) =>
  [...camps].sort((firstCamp, secondCamp) => {
    const firstIndex = REGISTRATION_CAMP_DISPLAY_ORDER.indexOf(getRegistrationCampSlug(firstCamp));
    const secondIndex = REGISTRATION_CAMP_DISPLAY_ORDER.indexOf(getRegistrationCampSlug(secondCamp));
    const firstRank = firstIndex === -1 ? Number.MAX_SAFE_INTEGER : firstIndex;
    const secondRank = secondIndex === -1 ? Number.MAX_SAFE_INTEGER : secondIndex;

    return firstRank - secondRank;
  });
const formatRegistrationCurrency = (value) =>
  `$${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2)}`;
const parseRegistrationCampPrice = (price) => Number(price.replace(/[^0-9.]/g, "")) || 0;
const REGISTRATION_ENDPOINT = "/api/register";
const REGISTRATION_COUNTS_ENDPOINT = "/api/registration-counts";

// Camps guarded by the live capacity check in functions/api/_capacity-config.js.
// Keep this in sync with that file's caps so the UI and the server agree.
const REGISTRATION_LIVE_CAPACITY = {
  "Total Skill Integration": {
    "2011-2013": { skaterCap: 23, goalieCap: 3 },
    "2014-2016": { skaterCap: 23, goalieCap: 3 },
    "2017-2019": { skaterCap: 18, goalieCap: 3 },
  },
};

let liveRegistrationCounts = {};

const getRegistrationKind = (capConfig, playerPosition) => {
  const position = String(playerPosition || "").toLowerCase();
  if (position.includes("goalie")) {
    return "goalie";
  }
  if ("forwardCap" in capConfig || "defenseCap" in capConfig) {
    return position.includes("defence") || position.includes("defense") ? "defense" : "forward";
  }
  return "skater";
};

const isLiveGroupFull = (camp, ageGroup, playerPosition) => {
  const capConfig = ageGroup ? REGISTRATION_LIVE_CAPACITY[camp.title]?.[ageGroup] : null;
  const counts = ageGroup ? liveRegistrationCounts[camp.title]?.[ageGroup] : null;
  if (!capConfig || !counts) {
    return false;
  }

  const kind = getRegistrationKind(capConfig, playerPosition);
  const cap = capConfig[`${kind}Cap`];
  const current = counts[kind] || 0;
  return current >= cap;
};

const isLiveCampClosed = (camp) => Boolean(liveRegistrationCounts[camp.title]?.closed);

const REGISTRATION_CAMP_NAMES = {
  "Summer Opener": "Summer Opener",
  "Total Skill Integration": "Total Skill Integration",
  "High-Performance Prep": "High Performance Week",
  "Body Contact Prep Camp": "Body Contact Prep Camp",
  "Position-Specific Clinic": "Position-Specific Clinic",
};

const REGISTRATION_PRICING = {
  "Summer Opener": { skater: 100, goalie: 50 },
  "Total Skill Integration": { skater: 250, goalie: 125 },
  "High-Performance Prep": { skater: 200, goalie: 100 },
  "Body Contact Prep Camp": { skater: 125, goalie: 50 },
  "Position-Specific Clinic": { skater: 90, goalie: 50 },
};

const REGISTRATION_CLOSED_GROUPS = {
  "Summer Opener": ["2017-2019"],
};

const REGISTRATION_BIRTH_YEAR_OPTIONAL_CAMPS = new Set(["Body Contact Prep Camp"]);

const getCampSubmissionName = (camp) => REGISTRATION_CAMP_NAMES[camp.title] || camp.title;

const renderRegistrationAvailability = (camp) =>
  camp.availability
    ? `<span class="registration-availability availability-badge availability-badge-${camp.availability.tone || "open"}">${camp.availability.label}</span>`
    : "";

const isRegistrationGroupClosed = (camp, ageGroup) =>
  Boolean(REGISTRATION_CLOSED_GROUPS[camp.title]?.includes(ageGroup));

const isBirthYearOptionalCamp = (camp) => REGISTRATION_BIRTH_YEAR_OPTIONAL_CAMPS.has(camp.title);

const getCampPriceForPosition = (camp, playerPosition) => {
  const pricing = REGISTRATION_PRICING[camp.title];
  if (!pricing) {
    return parseRegistrationCampPrice(camp.price);
  }

  return String(playerPosition || "").toLowerCase().includes("goalie") ? pricing.goalie : pricing.skater;
};

const parseRegistrationResponse = async (response) => {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch (error) {
    throw new Error("ABG received the request, but the confirmation response could not be read.");
  }
};

const getMatchingCampGroup = (camp, birthYear) => {
  if (!birthYear) {
    return null;
  }

  for (const [index, ageGroup] of camp.ages.entries()) {
    // A hidden wider range can be matched against without changing the
    // publicly displayed age-group label (see data.js ageMatchOverrides).
    const matchAgainst = camp.ageMatchOverrides?.[index] || ageGroup;
    const rangeMatch = matchAgainst.match(/^(\d{4})-(\d{4})$/);
    if (rangeMatch) {
      const startYear = Number(rangeMatch[1]);
      const endYear = Number(rangeMatch[2]);

      if (birthYear >= startYear && birthYear <= endYear) {
        return {
          ageGroup,
          schedule: camp.schedule[index] || "Contact ABG",
        };
      }
      continue;
    }

    const plusMatch = ageGroup.match(/^(\d{4})\+$/);
    if (plusMatch) {
      const oldestIncludedYear = Number(plusMatch[1]);

      if (birthYear <= oldestIncludedYear) {
        return {
          ageGroup,
          schedule: camp.schedule[index] || "Contact ABG",
        };
      }
      continue;
    }

    const exactMatch = ageGroup.match(/^(\d{4})$/);
    if (exactMatch && birthYear === Number(exactMatch[1])) {
      return {
        ageGroup,
        schedule: camp.schedule[index] || "Contact ABG",
      };
    }
  }

  return null;
};

const getRegistrationCampAssignment = (camp, birthYear) => {
  const match = getMatchingCampGroup(camp, birthYear);

  if (match) {
    return {
      ...match,
      displayText: `${match.ageGroup}: ${match.schedule}`,
    };
  }

  if (Number.isFinite(birthYear) && isBirthYearOptionalCamp(camp)) {
    const schedule = camp.schedule[0] || "Contact ABG";

    return {
      ageGroup: "Open",
      schedule,
      displayText: schedule,
    };
  }

  return null;
};

const setupRegistrationPage = () => {
  if (document.body.dataset.page !== "register") {
    return;
  }

  const registrationCampTarget = document.querySelector("[data-registration-camps]");
  const selectedCampSummaryTarget = document.querySelector("[data-summary-camps]");
  const totalSummaryTarget = document.querySelector("[data-summary-total]");
  const registerForm = document.querySelector("[data-register-form]");
  const registrationNotice = document.querySelector("[data-registration-notice]");
  const campError = document.querySelector("[data-camp-error]");
  const birthYearInput = document.querySelector('input[name="player-birth-year"]');
  const playerPositionInput = document.querySelector('[name="player-position"]');
  const submitButton = registerForm?.querySelector('button[type="submit"]');
  const registrationSummaryNote = registerForm?.querySelector(".registration-summary-note");
  const publicCamps = sortRegistrationCampsForDisplay(
    registrationSiteData.camps.filter(
      (camp) => camp.status !== "Private" && camp.status !== "Sold Out" && !camp.isPast
    )
  );
  const selectedSlug = new URLSearchParams(window.location.search).get("camp");

  if (!registrationCampTarget || !selectedCampSummaryTarget || !totalSummaryTarget) {
    return;
  }

  registrationCampTarget.innerHTML = publicCamps
    .map((camp) => {
      const slug = getRegistrationCampSlug(camp);
      const soldOut = camp.status === "Sold Out";
      const isSelected = !soldOut && slug === selectedSlug;

      return `
        <label class="registration-camp-option${isSelected ? " is-selected" : ""}${soldOut ? " is-disabled" : ""}">
          <input type="checkbox" name="selected-camps" value="${slug}" ${isSelected ? "checked" : ""} ${soldOut ? "disabled" : ""} />
          <span class="registration-camp-option-card">
            <span class="registration-camp-option-selector" aria-hidden="true"></span>
            <span class="registration-camp-option-main">
              <span class="registration-camp-option-top">
                <span class="registration-camp-option-title">${camp.title}</span>
                <span class="registration-camp-option-price" data-camp-price="${slug}">${camp.price}</span>
              </span>
              ${renderRegistrationAvailability(camp)}
              <span class="registration-camp-option-meta">${camp.dates} • ${camp.location}</span>
              <span class="registration-camp-option-time${soldOut ? " is-unavailable" : ""}" data-camp-slot-info="${slug}">
                ${
                  soldOut
                    ? 'Sold out for summer 2026 — thank you Edmonton! <a href="./register.html?camp=position-specific-clinic">Check out the Position-Specific Clinic</a>, still open.'
                    : "Birth year needed for ice time."
                }
              </span>
            </span>
          </span>
        </label>
      `;
    })
    .join("");

  const campInputs = Array.from(registrationCampTarget.querySelectorAll('input[name="selected-camps"]'));
  const campSlotTargets = Array.from(registrationCampTarget.querySelectorAll("[data-camp-slot-info]"));
  const campPriceTargets = Array.from(registrationCampTarget.querySelectorAll("[data-camp-price]"));

  const updateCampSelectionStyles = () => {
    for (const input of campInputs) {
      const option = input.closest(".registration-camp-option");
      option?.classList.toggle("is-selected", input.checked);
      option?.classList.toggle("is-disabled", input.disabled);
    }
  };

  const getSelectedCamps = () =>
    campInputs
      .filter((input) => input.checked)
      .map((input) => publicCamps.find((camp) => getRegistrationCampSlug(camp) === input.value))
      .filter(Boolean);

  const updateCampPricePreviews = () => {
    const playerPosition = playerPositionInput?.value || "";

    for (const target of campPriceTargets) {
      const camp = publicCamps.find((item) => getRegistrationCampSlug(item) === target.dataset.campPrice);

      if (camp) {
        target.textContent = formatRegistrationCurrency(getCampPriceForPosition(camp, playerPosition));
      }
    }
  };

  const updateCampTimePreviews = () => {
    const birthYear = Number.parseInt(birthYearInput?.value || "", 10);
    const playerPosition = playerPositionInput?.value || "";

    for (const [index, target] of campSlotTargets.entries()) {
      const camp = publicCamps.find((item) => getRegistrationCampSlug(item) === target.dataset.campSlotInfo);
      const input = campInputs[index];

      if (!camp) {
        continue;
      }

      if (camp.status === "Sold Out" || isLiveCampClosed(camp)) {
        target.innerHTML =
          'Sold out for summer 2026 — thank you Edmonton! <a href="./register.html?camp=position-specific-clinic">Check out the Position-Specific Clinic</a>, still open.';
        target.classList.add("is-unavailable");
        if (input) {
          input.checked = false;
          input.disabled = true;
        }
        continue;
      }

      if (!Number.isFinite(birthYear)) {
        target.textContent = "Birth year needed for ice time.";
        target.classList.remove("is-unavailable");
        if (input) {
          input.disabled = false;
        }
        continue;
      }

      const match = getRegistrationCampAssignment(camp, birthYear);

      if (
        match &&
        (isRegistrationGroupClosed(camp, match.ageGroup) || isLiveGroupFull(camp, match.ageGroup, playerPosition))
      ) {
        const capConfig = REGISTRATION_LIVE_CAPACITY[camp.title]?.[match.ageGroup];
        const kindLabels = { goalie: "Goalie", forward: "Forward", defense: "Defenseman" };
        const kindLabel = capConfig ? kindLabels[getRegistrationKind(capConfig, playerPosition)] : null;
        target.textContent = kindLabel
          ? `${kindLabel} spots are full for this camp.`
          : "No more available spots.";
        target.classList.add("is-unavailable");
        if (input) {
          input.checked = false;
          input.disabled = true;
        }
      } else if (match) {
        target.textContent = match.displayText;
        target.classList.remove("is-unavailable");
        if (input) {
          input.disabled = false;
        }
      } else {
        target.textContent = "This camp is not available for this birth year.";
        target.classList.add("is-unavailable");
        if (input) {
          input.checked = false;
          input.disabled = true;
        }
      }
    }

    updateCampSelectionStyles();
  };

  const updateRegistrationSummary = () => {
    updateCampPricePreviews();

    const selectedCamps = getSelectedCamps();
    const playerPosition = playerPositionInput?.value || "";
    const total = selectedCamps.reduce((sum, camp) => sum + getCampPriceForPosition(camp, playerPosition), 0);
    const birthYear = Number.parseInt(birthYearInput?.value || "", 10);

    selectedCampSummaryTarget.innerHTML = selectedCamps.length
      ? selectedCamps
          .map(
            (camp) => {
              const match = Number.isFinite(birthYear) ? getRegistrationCampAssignment(camp, birthYear) : null;
              const scheduleText = match ? ` • ${match.schedule}` : "";
              const displayPrice = formatRegistrationCurrency(getCampPriceForPosition(camp, playerPosition));

              return `
              <li>
                <strong>${camp.title}</strong>
                <span>${camp.dates} • ${camp.location}${scheduleText} • ${displayPrice}</span>
              </li>
            `;
            }
          )
          .join("")
      : '<li><strong>No camps selected yet.</strong><span>Choose one or more camps to begin.</span></li>';

    totalSummaryTarget.textContent = selectedCamps.length ? formatRegistrationCurrency(total) : "$0";

    updateCampSelectionStyles();
  };

  for (const input of campInputs) {
    input.addEventListener("change", updateRegistrationSummary);
  }

  birthYearInput?.addEventListener("input", () => {
    updateCampTimePreviews();
    updateRegistrationSummary();
  });
  playerPositionInput?.addEventListener("change", () => {
    updateCampTimePreviews();
    updateRegistrationSummary();
  });

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedCamps = getSelectedCamps();
    const birthYear = Number.parseInt(birthYearInput?.value || "", 10);

    if (!selectedCamps.length) {
      campError?.removeAttribute("hidden");
      campError.textContent = "Choose at least one camp that matches this player's birth year.";
      registrationNotice?.classList.remove("is-visible");
      registrationCampTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    if (!registerForm.reportValidity()) {
      registrationNotice?.classList.remove("is-visible");
      return;
    }

    campError?.setAttribute("hidden", "");

    const playerPositionForPricing = registerForm.elements["player-position"]?.value.trim() || "";
    const campsPayload = selectedCamps.map((camp) => {
      const match = Number.isFinite(birthYear) ? getRegistrationCampAssignment(camp, birthYear) : null;
      const campPrice = getCampPriceForPosition(camp, playerPositionForPricing);

      return {
        campName: getCampSubmissionName(camp),
        ageGroup: match?.ageGroup || "",
        timeSlot: match?.schedule || "",
        price: formatRegistrationCurrency(campPrice),
        priceAmount: campPrice,
      };
    });

    if (selectedCamps.some((camp) => camp.status === "Sold Out" || isLiveCampClosed(camp))) {
      campError?.removeAttribute("hidden");
      campError.textContent = "One or more selected camps is sold out for summer 2026.";
      registrationNotice?.classList.remove("is-visible");
      registrationCampTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    if (
      Number.isFinite(birthYear) &&
      selectedCamps.some((camp) => {
        const assignment = getRegistrationCampAssignment(camp, birthYear);
        return (
          !assignment?.ageGroup ||
          !assignment?.schedule ||
          isRegistrationGroupClosed(camp, assignment.ageGroup) ||
          isLiveGroupFull(camp, assignment.ageGroup, playerPositionForPricing)
        );
      })
    ) {
      campError?.removeAttribute("hidden");
      campError.textContent = "One or more selected camps has no more available spots for this birth year.";
      registrationNotice?.classList.remove("is-visible");
      registrationCampTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const payload = {
      playerFullName: registerForm.elements["player-name"]?.value.trim() || "",
      playerPosition: registerForm.elements["player-position"]?.value.trim() || "",
      playerBirthYear: registerForm.elements["player-birth-year"]?.value.trim() || "",
      parent1FullName: registerForm.elements["parent-1-name"]?.value.trim() || "",
      parent1PhoneNumber: registerForm.elements["parent-1-phone"]?.value.trim() || "",
      parent1Email: registerForm.elements["parent-1-email"]?.value.trim() || "",
      parent2FullName: registerForm.elements["parent-2-name"]?.value.trim() || "",
      parent2PhoneNumber: registerForm.elements["parent-2-phone"]?.value.trim() || "",
      parent2Email: registerForm.elements["parent-2-email"]?.value.trim() || "",
      hearAboutUs: registerForm.elements["heard-about"]?.value.trim() || "",
      currentTeamAndOrganization: registerForm.elements["current-team"]?.value.trim() || "",
      referredBy: registerForm.elements["referred-by"]?.value.trim() || "",
      skillToLevelUp: registerForm.elements["player-goal"]?.value.trim() || "",
      camps: campsPayload,
      totalCampCost: formatRegistrationCurrency(
        selectedCamps.reduce((sum, camp) => sum + getCampPriceForPosition(camp, playerPositionForPricing), 0)
      ),
    };

    registrationNotice?.classList.remove("is-visible", "is-error");
    registrationNotice?.removeAttribute("tabindex");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Submitting...";
    }
    if (registrationSummaryNote) {
      registrationSummaryNote.textContent = "Submitting your registration...";
    }

    let submissionSucceeded = false;

    try {
      const response = await fetch(REGISTRATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const result = await parseRegistrationResponse(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Registration could not be submitted.");
      }

      submissionSucceeded = true;
      window.abgTrackEvent?.("register_submit_success", {
        camp_count: selectedCamps.length,
        camp_slugs: selectedCamps.map((camp) => getRegistrationCampSlug(camp)).join(","),
        camp_names: selectedCamps.map((camp) => getCampSubmissionName(camp)).join(","),
        value: selectedCamps.reduce((sum, camp) => sum + getCampPriceForPosition(camp, playerPositionForPricing), 0),
        currency: "CAD",
        page_path: window.location.pathname,
      });
      window.fbq?.("track", "Lead", {
        currency: "CAD",
        value: selectedCamps.reduce((sum, camp) => sum + getCampPriceForPosition(camp, playerPositionForPricing), 0),
        content_name: selectedCamps.map((camp) => getCampSubmissionName(camp)).join(","),
      });
      registrationNotice.innerHTML = `
        <span class="registration-notice-kicker">Registration submitted</span>
        <strong>Check your email</strong>
        <p>
          Your registration was received. Confirmation and e-transfer details will be sent to
          <b>${payload.parent1Email}</b>.
        </p>
        <div class="registration-notice-actions">
          <span class="registration-notice-next">Next step: check your inbox and junk folder.</span>
          <a href="mailto:abgeliteskills@gmail.com">Email ABG</a>
          <a href="./camps.html">Back to Camps</a>
          <a href="./index.html">Home</a>
        </div>
      `;
      registrationNotice?.setAttribute("tabindex", "-1");
      registrationNotice?.classList.add("is-visible");
      registrationNotice?.focus({ preventScroll: true });
      registerForm.reset();
      updateCampTimePreviews();
      updateRegistrationSummary();
      registrationNotice?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      registrationNotice.innerHTML = `
        <span class="registration-notice-kicker">Submission not sent</span>
        <strong>Something went wrong.</strong>
        <p>
          ${error.message || "Your registration could not be submitted right now."}
        </p>
        <span class="registration-notice-next">Please try again or email abgeliteskills@gmail.com.</span>
      `;
      registrationNotice?.setAttribute("tabindex", "-1");
      registrationNotice?.classList.add("is-visible", "is-error");
      registrationNotice?.focus({ preventScroll: true });
      registrationNotice?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } finally {
      if (submitButton) {
        submitButton.disabled = submissionSucceeded;
        submitButton.classList.remove("is-loading");
        submitButton.removeAttribute("aria-busy");
        submitButton.textContent = submissionSucceeded ? "Registration Sent" : "Submit Registration";
      }
      if (registrationSummaryNote) {
        registrationSummaryNote.textContent = submissionSucceeded
          ? "Registration submitted. Check your email for confirmation and e-transfer details."
          : "Please review the selected camps, ice times, and total before submitting.";
      }
    }
  });

  updateCampTimePreviews();
  updateRegistrationSummary();

  fetch(REGISTRATION_COUNTS_ENDPOINT)
    .then((response) => (response.ok ? response.json() : null))
    .then((counts) => {
      if (counts) {
        liveRegistrationCounts = counts;
        updateCampTimePreviews();
        updateRegistrationSummary();
      }
    })
    .catch(() => {
      // Fail open: if live counts can't be fetched, the server-side check on
      // submit is still authoritative, so the UI just won't pre-disable full groups.
    });
};

setupRegistrationPage();
