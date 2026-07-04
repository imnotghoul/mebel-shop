const splitTargets = document.querySelectorAll("[data-split]");

splitTargets.forEach((target) => {
  const words = target.textContent.trim().split(/\s+/);
  target.innerHTML = words
    .map((word, index) => `<span class="split-word" style="--word-index:${index}">${word}</span>`)
    .join(" ");
  target.classList.add("split-ready");
});

const revealItems = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".magnetic-card, .service-card, .project-card, .timeline-item, .proof-item").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

const counters = document.querySelectorAll(".hero-stats strong, .proof-item strong");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const text = element.textContent.trim();
      const match = text.match(/^(\d+)/);

      if (!match) {
        counterObserver.unobserve(element);
        return;
      }

      const target = Number(match[1]);
      const suffix = text.slice(match[1].length);
      let startTime = null;

      const tick = (timestamp) => {
        startTime ??= timestamp;
        const progress = Math.min((timestamp - startTime) / 1100, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const heroImage = document.querySelector(".hero-image");

window.addEventListener(
  "scroll",
  () => {
    if (!heroImage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const offset = Math.min(window.scrollY * 0.08, 42);
    heroImage.style.transform = `scale(1.04) translateY(${offset}px)`;
  },
  { passive: true }
);

const form = document.querySelector(".estimate-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = form.querySelector("button");
  const originalText = button.textContent;

  button.textContent = "Заявка подготовлена";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    form.reset();
  }, 2200);
});
