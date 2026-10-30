(function () {
  "use strict";

  const config = window.SURAKSHA_CONFIG;
  if (!config) {
    console.error("Cyber Suraksha configuration did not load.");
    return;
  }

  const timeFields = document.querySelectorAll("[data-event-time]");
  timeFields.forEach(function (element) {
    element.textContent = config.event.timeConfirmed
      ? config.event.timeDisplay
      : "To be confirmed by the organizer";
  });
  document.querySelectorAll("[data-event-date]").forEach(function (element) {
    element.textContent = config.event.dateDisplay;
  });
  document.querySelectorAll("[data-event-venue]").forEach(function (element) {
    element.textContent = config.event.venue;
  });

  document.querySelectorAll("[data-portrait]").forEach(function (image) {
    image.addEventListener("error", function () {
      const fallback = document.createElement("div");
      fallback.className = "photo-fallback";
      fallback.textContent = "Portrait unavailable";
      image.replaceWith(fallback);
    }, { once: true });
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".letter-card, .portrait-frame, .detail-tile, .letterhead, .invitation-film .promo-video-card")
      .forEach(function (surface) {
        surface.addEventListener("pointermove", function (event) {
          const bounds = surface.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          const tilt = surface.matches(".letter-card") ? 2 : 4;
          surface.style.setProperty("--mx", (x * 100) + "%");
          surface.style.setProperty("--my", (y * 100) + "%");
          surface.style.transform = "perspective(1200px) rotateX(" + ((.5 - y) * tilt) + "deg) rotateY(" + ((x - .5) * tilt) + "deg) translateY(-1px)";
        });
        surface.addEventListener("pointerleave", function () {
          surface.style.transform = "";
        });
      });
  }

  document.querySelectorAll("[data-print]").forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });

  config.events.forEach(function (event) {
    const calendarButton = document.querySelector('[data-calendar-event="' + event.id + '"]');
    if (!calendarButton) {
      return;
    }
    calendarButton.addEventListener("click", function () {
      window.open(googleCalendarUrl(event), "_blank", "noopener,noreferrer");
      showStatus("Review the event details in Google Calendar and save it there to add it.");
    });
  });

  const status = document.querySelector("[data-action-status]");
  const shareButton = document.querySelector("[data-share]");
  const manualShare = document.querySelector("[data-manual-share]");
  const manualLink = document.querySelector("[data-manual-link]");

  function showStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function currentPageUrl() {
    const url = new URL(window.location.href);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Sharing is available when this invitation is hosted on a website.");
    }
    url.hash = "";
    return url.href;
  }

  async function shareInvitation() {
    let url;
    try {
      url = currentPageUrl();
    } catch (error) {
      showStatus(error.message);
      return;
    }
    const title = document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title: title, text: "Cyber Suraksha invitation", url: url });
        showStatus("Invitation shared.");
        return;
      } catch (error) {
        if (error.name === "AbortError") {
          showStatus("Sharing cancelled.");
          return;
        }
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        showStatus("Invitation link copied to clipboard.");
        return;
      } catch (error) {
        showStatus("Clipboard access was unavailable. Select and copy the link below.");
      }
    } else {
      showStatus("Select and copy the invitation link below.");
    }
    if (manualShare && manualLink) {
      manualLink.value = url;
      manualShare.classList.add("visible");
      manualLink.focus();
      manualLink.select();
    }
  }

  if (shareButton) {
    shareButton.addEventListener("click", shareInvitation);
  }

  function googleCalendarUrl(event) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: calendarDateTime(event.date, event.timeStart) + "/" + calendarDateTime(event.date, event.timeEnd),
      ctz: event.timeZone,
      location: event.venue + ", " + event.location,
      details: event.description
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function calendarDateTime(date, time) {
    return date.replace(/-/g, "") + "T" + time.replace(":", "") + "00";
  }
}());
