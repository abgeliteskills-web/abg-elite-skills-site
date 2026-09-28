const BLUEPRINT_ENDPOINT = "/api/blueprint-signup";
const BLUEPRINT_FALLBACK_ERROR =
  "We couldn't send the D1 Blueprint right now. Please try again, or email abgeliteskills@gmail.com and we'll send it directly.";

// Only messages written by our own signup function are shown to families; anything else
// (a dropped connection, a server error page) gets the friendly fallback instead.
const parseBlueprintResponse = async (response) => {
  const rawText = await response.text();

  try {
    return rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    return {};
  }
};

const setupBlueprintForm = () => {
  const form = document.querySelector("[data-blueprint-form]");
  if (!form) {
    return;
  }

  const notice = document.querySelector("[data-blueprint-notice]");
  const submitButton = form.querySelector('button[type="submit"]');
  const birthYearInput = form.elements["player-birth-year"];

  // Keep the optional birth year open to every age the guide covers, this year and every year after.
  if (birthYearInput) {
    birthYearInput.max = String(new Date().getFullYear() - 3);
  }
  const defaultButtonLabel = submitButton?.textContent || "Send Me The D1 Blueprint";

  const showNotice = (message, isError) => {
    if (!notice) {
      return;
    }
    notice.textContent = message;
    notice.classList.toggle("is-error", Boolean(isError));
    notice.removeAttribute("hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const payload = {
      parentName: form.elements["parent-name"]?.value.trim() || "",
      email: form.elements["email"]?.value.trim() || "",
      playerBirthYear: form.elements["player-birth-year"]?.value.trim() || "",
    };

    notice?.setAttribute("hidden", "");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Sending...";
    }

    let succeeded = false;

    try {
      const response = await fetch(BLUEPRINT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await parseBlueprintResponse(response);

      if (!response.ok || !result.ok) {
        showNotice(result.error || BLUEPRINT_FALLBACK_ERROR, true);
        return;
      }

      succeeded = true;
      window.abgTrackEvent?.("blueprint_signup_success", {
        page_path: window.location.pathname,
      });
      window.fbq?.("track", "Lead", { content_name: "D1 Blueprint" });

      showNotice(`Sent! Check ${payload.email} for the D1 Blueprint (and your junk folder, just in case).`, false);
      form.reset();
      if (submitButton) {
        submitButton.textContent = "Sent";
      }
    } catch (error) {
      showNotice(BLUEPRINT_FALLBACK_ERROR, true);
    } finally {
      if (submitButton) {
        submitButton.disabled = succeeded;
        submitButton.classList.remove("is-loading");
        submitButton.removeAttribute("aria-busy");
        if (!succeeded) {
          submitButton.textContent = defaultButtonLabel;
        }
      }
    }
  });
};

setupBlueprintForm();
