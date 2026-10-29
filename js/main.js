(function () {
  "use strict";

  const config = window.SURAKSHA_CONFIG;
  if (!config) {
    console.error("Cyber Suraksha configuration did not load.");
    return;
  }

  const navToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-navigation");
  if (navToggle && nav) {
    document.body.classList.add("nav-ready");
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-event-date]").forEach(function (element) {
    element.textContent = config.event.dateDisplay;
  });
  document.querySelectorAll("[data-event-time]").forEach(function (element) {
    element.textContent = config.event.timeDisplay;
  });
  document.querySelectorAll("[data-event-venue]").forEach(function (element) {
    element.textContent = config.event.venue;
  });

  const eventGrid = document.getElementById("event-listings");
  if (eventGrid) {
    config.events.forEach(function (event) {
      const card = document.createElement("article");
      card.className = "event-detail event-listing";
      card.dataset.reveal = "";

      const heading = document.createElement("h3");
      heading.textContent = event.title;
      const description = document.createElement("p");
      description.textContent = event.description;
      const facts = document.createElement("div");
      facts.className = "event-facts";
      facts.append(
        createEventFact("Date", event.dateDisplay),
        createEventFact("Time", event.timeDisplay + " (" + event.timeZone + ")"),
        createEventFact("Venue", event.venue + " · " + event.location)
      );
      const calendarLink = document.createElement("a");
      calendarLink.className = "button button-primary";
      calendarLink.href = googleCalendarUrl(event);
      calendarLink.target = "_blank";
      calendarLink.rel = "noopener noreferrer";
      calendarLink.textContent = "Add to Google Calendar";
      calendarLink.setAttribute("aria-label", "Open Google Calendar to review " + event.title);
      const reviewNote = document.createElement("small");
      reviewNote.className = "calendar-review-note";
      reviewNote.textContent = "Review the event details and save it in Google Calendar.";
      card.append(heading, description, facts, calendarLink, reviewNote);
      eventGrid.appendChild(card);
    });
  }

  function createEventFact(label, value) {
    const fact = document.createElement("div");
    fact.className = "event-fact";
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = value;
    fact.append(labelElement, valueElement);
    return fact;
  }

  const inviteeGrid = document.getElementById("invitee-grid");
  if (inviteeGrid) {
    config.invitees.forEach(function (invitee) {
      const card = document.createElement("article");
      card.className = "guest-card";
      card.dataset.reveal = "";

      const photoFrame = document.createElement("div");
      photoFrame.className = "guest-photo-frame";
      const photo = document.createElement("img");
      photo.className = "guest-photo";
      photo.src = invitee.photo;
      photo.alt = "Photograph of " + invitee.name;
      photo.loading = "lazy";
      photo.addEventListener("error", function () {
        photo.remove();
        const fallback = document.createElement("div");
        fallback.className = "photo-fallback";
        fallback.textContent = "Portrait unavailable";
        photoFrame.appendChild(fallback);
      }, { once: true });
      photoFrame.appendChild(photo);

      const content = document.createElement("div");
      content.className = "guest-content";
      const role = document.createElement("span");
      role.className = "role-pill";
      role.textContent = invitee.role;
      const name = document.createElement("h3");
      name.textContent = invitee.name;
      const link = document.createElement("a");
      link.className = "button button-light";
      link.href = "invitations/" + encodeURIComponent(invitee.id) + ".html";
      link.textContent = "View Invitation";
      content.append(role, name, link);
      card.append(photoFrame, content);
      inviteeGrid.appendChild(card);
    });
  }

  const speakerGrid = document.getElementById("speaker-grid");
  if (speakerGrid) {
    config.speakers.forEach(function (speaker) {
      const card = document.createElement("article");
      card.className = "speaker-card";
      card.dataset.reveal = "";
      const photoFrame = document.createElement("div");
      photoFrame.className = "guest-photo-frame";
      const photo = document.createElement("img");
      photo.className = "guest-photo";
      photo.src = speaker.photo;
      photo.alt = "Photograph of " + speaker.name;
      photo.loading = "lazy";
      photo.referrerPolicy = "no-referrer";
      photo.addEventListener("error", function () {
        photo.remove();
        const fallback = document.createElement("div");
        fallback.className = "photo-fallback";
        fallback.textContent = "Portrait unavailable";
        photoFrame.appendChild(fallback);
      }, { once: true });
      photoFrame.appendChild(photo);
      const content = document.createElement("div");
      content.className = "guest-content";
      const role = document.createElement("span");
      role.className = "role-pill";
      role.textContent = speaker.role;
      const name = document.createElement("h3");
      name.textContent = speaker.name;
      const designation = document.createElement("p");
      designation.className = "speaker-title";
      designation.textContent = speaker.designation;
      content.append(role, name, designation);
      card.append(photoFrame, content);
      speakerGrid.appendChild(card);
    });
  }

  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".guest-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--mx", (x * 100) + "%");
        card.style.setProperty("--my", (y * 100) + "%");
        card.style.transform = "rotateX(" + ((.5 - y) * 5) + "deg) rotateY(" + ((x - .5) * 6) + "deg) translateY(-3px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll("[data-reveal]").forEach(function (element) {
      observer.observe(element);
    });
  }

  const shield = document.querySelector(".shield-card");
  if (shield && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const stage = shield.closest(".shield-stage");
    if (stage) {
      stage.addEventListener("pointermove", function (event) {
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      shield.style.animation = "none";
      shield.style.transform = "rotateY(" + (-12 + (x - .5) * 10) + "deg) rotateX(" + (5 + (.5 - y) * 8) + "deg) translateY(-4px)";
      });
      stage.addEventListener("pointerleave", function () {
        shield.style.transform = "";
        shield.style.animation = "";
      });
    }
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
