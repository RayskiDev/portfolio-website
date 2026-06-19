import * as THREE from "three";

/* ------------------------- Loading Screen ------------------------- */

// gsap fadein animation
const initializeWebsite = () => {
  const tl = gsap.timeline();
  tl.from("header", {
    y: -50,
    opacity: 0,
    duration: 2,
    delay: 1,
    ease: "power4.out",
  });

  tl.from(
    ".hero-left",
    {
      x: -30,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=0.6",
  );

  tl.from(
    ".hero-right",
    {
      x: 30,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=1",
  );

  tl.from(
    ".cta-buttons",
    {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power4.out",
    },
    "-=1",
  );
};

const logs = [
  "[OK] Initializing rendering engine...",
  "[OK] Allocating memory...",
  "[OK] Loading portfolio assets...",
  "[OK] Mounting virtual filesystem...",
  "[OK] Establishing secure channel...",
  "[OK] Verifying project database...",
  "[INFO] Caching resources...",
  "[WARN] Connection unstable...",
  "[OK] Re-establishing sync...",
  "[OK] Finalizing startup sequence...",
];

const loadingScreen = document.querySelector(".loading-screen");
const loadingContainer = document.getElementById("loading-container");

let activeLogs = [];
let currentIndex = 0;

function addLog() {
  const line = document.createElement("div");
  line.className = "log-line";

  const base = logs[currentIndex];
  const jitter = Math.random() > 0.85 ? " :: sync drift detected" : "";

  line.textContent = base + jitter;

  loadingContainer.appendChild(line);

  activeLogs.unshift(line);

  activeLogs.forEach((log, index) => {
    log.classList.remove("log-0", "log-1", "log-2", "log-3");

    if (index < 4) {
      log.classList.add(`log-${index}`);
    }
  });

  if (activeLogs.length > 4) {
    const old = activeLogs.pop();
    old.classList.add("log-remove");

    old.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName === "transform") {
          old.remove();
        }
      },
      { once: true },
    );
  }
  currentIndex = (currentIndex + 1) % logs.length;
}

addLog();
const interval = setInterval(addLog, 320);

window.addEventListener("load", () => {
  initializeWebsite();

  setTimeout(() => {
    clearInterval(interval);

    gsap.to(loadingScreen, {
      opacity: 0,
      filter: "blur(18px)",
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        loadingScreen.remove();
        document.body.classList.remove("loading");
      },
    });
  }, 500);
});

/* ------------------------- Toast Notifications ------------------------- */
const createToast = (type, title, text) => {
  const notifications = document.querySelector(".notifications");

  if (notifications.children.length > 2) return;

  let icon;
  switch (type) {
    case "success":
      icon = "fa-circle-check";
      break;
    case "error":
      icon = "fa-circle-exclamation";
      break;
    case "warning":
      icon = "fa-triangle-exclamation";
      break;
    case "info":
      icon = "fa-circle-info";
      break;
    default:
      icon = "fa-circle-info";
  }

  const newToast = document.createElement("div");
  newToast.classList.add("toast", type);

  const iconElement = document.createElement("i");
  iconElement.classList.add("fa-solid", icon);

  const content = document.createElement("div");
  content.className = "toast-content";

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const textElement = document.createElement("span");
  textElement.textContent = text;

  const closeButton = document.createElement("i");
  closeButton.className = "fa-solid fa-xmark";
  closeButton.addEventListener("click", () => {
    clearTimeout(newToast.timeOut);
    newToast.remove();
  });

  content.appendChild(titleElement);
  content.appendChild(textElement);
  newToast.appendChild(iconElement);
  newToast.appendChild(content);
  newToast.appendChild(closeButton);

  notifications.appendChild(newToast);

  newToast.timeOut = setTimeout(() => newToast.remove(), 5000);
};

/* ------------------------- Header scroll event ------------------------- */
const header = document.querySelector("header");
const classListToggler = () => {
  if (window.innerWidth > 768)
    header.classList.toggle("scrolled", window.scrollY > 300);
};
window.addEventListener("scroll", classListToggler);
window.addEventListener("DOMContentLoaded", classListToggler);

/* ------------------------- Burger Menu ------------------------ */
const burgerMenu = document.getElementById("burger-menu");
const navContainer = document.querySelector("nav");
const navLinks = document.querySelectorAll("header nav a");

const toggleMenu = () => {
  const isExpanded = burgerMenu.getAttribute("aria-expanded") === "true";
  burgerMenu.setAttribute("aria-expanded", !isExpanded);
  burgerMenu.classList.toggle("active");
  navContainer.classList.toggle("active");

  document.body.style.overflow = !isExpanded ? "hidden" : "";
};

burgerMenu.addEventListener("click", toggleMenu);
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navContainer.classList.contains("active")) {
      toggleMenu();
    }
  });
});

/* -------------------------- GSAP Animations --------------------------- */
// GSAP Parallax Animation for Hero Section
gsap.registerPlugin(ScrollTrigger);

if (window.innerWidth >= 768) {
  gsap.to("#hero", {
    opacity: 0,
    scale: 0.95,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "center center",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      scrub: true,
    },
  });
} else {
  gsap.to("#hero", {
    opacity: 0,
    scale: 0.95,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      scrub: true,
    },
  });
}

/* -------- Gsap for about section --------- */

// GSAP height animation for the dossier axis line
gsap.to(".dossier-axis-line", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".dossier-body",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
});

// GSAP reveal on scroll for about section
const dataSegments = document.querySelectorAll(".data-segment");
dataSegments.forEach((segment, index) => {
  gsap.from(segment, {
    opacity: 0,
    x: -50,
    ease: "power1.out",
    scrollTrigger: {
      trigger: segment,
      start: "top center",
      end:
        index !== dataSegments.length - 1 ? "bottom center" : "center center",
      scrub: true,
    },
  });
});

gsap.from(".bg-glow-circle", {
  y: 720,
  ease: "none",
  scrollTrigger: {
    trigger: "#about",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

/* -------------------------- Projects Animations ---------------------------- */
const shakeTrigger = document.querySelector(".monolith-blur-overlay");
const shakeElement = document.querySelector(".confidential-center-badge");
shakeTrigger.addEventListener("click", () => {
  shakeElement.classList.add("shake");
  createToast(
    "error",
    "Confidential",
    "This project is confidential and cannot be displayed.",
  );
  setTimeout(() => {
    shakeElement.classList.remove("shake");
  }, 500);
});

const indicator = document.querySelector(".clearance-indicator");
const indicatorPulse = document.querySelector(".indicator-pulse");
const indicatorText = document.querySelector(".indicator-text");

const loaderFrames = [".  ", ".. ", "...", ".. "];
const loaderState = { frameIndex: 0 };
let loaderTween = null;
let promptBlinkTween = null;

const randomBypassToken = Math.floor(1000 + Math.random() * 9000);

const promptElement = document.getElementById("terminalPrompt");
const bootTerminalSequence = () => {
  const projectTerminal = document.getElementById("projectTerminal");
  const bypassTokenSpan = document.getElementById("bypassToken");

  if (bypassTokenSpan) {
    bypassTokenSpan.textContent = randomBypassToken;
  }

  gsap.set(projectTerminal, { display: "flex", opacity: 1 });

  promptBlinkTween = gsap.timeline({ repeat: -1 });
  promptBlinkTween
    .to(promptElement, { textContent: "> ", duration: 0.4, ease: "none" })
    .to(promptElement, { textContent: ">_", duration: 0.4, ease: "none" });
};

const expandTerminalBody = () => {
  const bodyWrapper = document.querySelector(".terminal-body-wrapper");

  gsap.set("#projectTerminal", { display: "flex", opacity: 1 });

  if (promptBlinkTween) {
    promptBlinkTween.kill();
    promptElement.textContent = ">_";
  }

  gsap.to(bodyWrapper, {
    maxHeight: "600px",
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => {
      bodyWrapper.style.maxHeight = "none";
      bodyWrapper.style.overflow = "visible";
      document.getElementById("terminalKeyInput")?.focus();
    },
  });
};

const handleTerminalAuth = () => {
  const keyInput = document.getElementById("terminalKeyInput");
  const btnSubmit = document.getElementById("btnTermSubmit");
  const btnSkip = document.getElementById("btnTermSkip");
  const overlay = document.querySelector(".monolith-blur-overlay");
  const userValue = keyInput.value.trim();

  if (btnSubmit.disabled) return;

  if (userValue !== randomBypassToken.toString()) {
    createToast(
      "error",
      "Błąd autoryzacji",
      "Wprowadzony klucz BYPASS_KEY jest nieprawidłowy.",
    );
    keyInput.value = "";
    keyInput.focus();
    return;
  }

  keyInput.disabled = true;
  btnSubmit.disabled = true;
  btnSkip.disabled = true;

  document.querySelector(".terminal-gate").style.borderColor =
    "rgba(10, 191, 48, 0.4)";

  setTimeout(() => {
    createToast(
      "info",
      "Uwierzytelnianie",
      "Nawiązywanie połączenia z SECURE_CORE...",
    );
  }, 400);

  setTimeout(() => {
    createToast(
      "success",
      "Status: OK",
      "Baza danych serwera odpowiada poprawnie.",
    );
  }, 1400);

  setTimeout(() => {
    createToast(
      "info",
      "Deszyfrowanie",
      "Pobieranie struktury repozytoriów poziomu 5...",
    );
  }, 2400);

  setTimeout(() => {
    const activeToasts = document.querySelectorAll(".notifications .toast");
    activeToasts.forEach((toast) => toast.remove());

    createToast(
      "error",
      "ACCESS DENIED",
      "Brak wystarczających uprawnień programisty poziomu 5.",
    );

    document.querySelector(".terminal-gate").style.borderColor = "#f24d4c";

    gsap.to("#projectTerminal", {
      opacity: 0,
      y: -20,
      duration: 0.8,
      delay: 0.5,
      onComplete: () => {
        document.getElementById("projectTerminal").style.display = "none";
      },
    });
  }, 4000);
};

document
  .getElementById("btnTermSubmit")
  ?.addEventListener("click", handleTerminalAuth);

document
  .getElementById("terminalKeyInput")
  ?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleTerminalAuth();
  });

document.getElementById("btnTermSkip")?.addEventListener("click", () => {
  const keyInput = document.getElementById("terminalKeyInput");
  if (keyInput) {
    keyInput.value = randomBypassToken;
    keyInput.disabled = true;
    handleTerminalAuth();
  }
});

ScrollTrigger.create({
  trigger: "#projects",
  start: "top bottom",
  end: "top center-=100px",
  once: true,
  invalidateOnRefresh: true,
  onEnter: (self) => {
    if (window.scrollY > self.end) {
      indicator.classList.add("restricted");
      indicatorPulse.classList.add("restricted");
      indicatorText.classList.add("restricted");
      indicatorText.innerText = "LEVEL 5 CLEARANCE REQUIRED";
      indicatorPulse.innerText = "";
      bootTerminalSequence();
      return;
    }

    loaderTween = gsap.to(loaderState, {
      frameIndex: loaderFrames.length - 0.01,
      duration: 1.2,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        const currentFrame =
          Math.floor(loaderState.frameIndex) % loaderFrames.length;
        indicatorPulse.innerText = loaderFrames[currentFrame];
      },
    });
  },
  onLeave: () => {
    if (loaderTween) {
      loaderTween.kill();
    }

    indicator.classList.add("restricted");
    indicatorPulse.classList.add("restricted");
    indicatorText.classList.add("restricted");

    indicatorText.innerText = "LEVEL 5 CLEARANCE REQUIRED";
    indicatorPulse.innerText = "";

    bootTerminalSequence();
  },
});

ScrollTrigger.create({
  trigger: "#projects",
  start: "top top",
  once: true,
  invalidateOnRefresh: true,
  onEnter: () => {
    expandTerminalBody();
  },
  onRefresh: (self) => {
    if (self.progress > 0) {
      expandTerminalBody();
    }
  },
});

/* -------------------------- Globe Animation ---------------------------- */
const globeRotation = Math.PI / 6;
const globePosition = [2, 0, -2];

const container = document.querySelector(".globe");
const customCanvas = document.querySelector("#globeCanvas");

let width = container.clientWidth;
let height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: customCanvas,
  alpha: true,
  antialias: true,
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.SphereGeometry(3, 24, 24);

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("./imagesEarth/color.webp");
const emissionTexture = textureLoader.load("./imagesEarth/emission.webp");

colorTexture.colorSpace = THREE.SRGBColorSpace;
emissionTexture.colorSpace = THREE.SRGBColorSpace;

const backMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,
  transparent: true,
  alphaMap: colorTexture,

  emissive: new THREE.Color("#550055"),
  emissiveMap: emissionTexture,
  emissiveIntensity: 0.8,

  roughness: 0.4,
  metalness: 0.1,
  side: THREE.BackSide,
});
const backGlobe = new THREE.Mesh(geometry, backMaterial);
backGlobe.position.set(...globePosition);
backGlobe.rotation.z = globeRotation;
scene.add(backGlobe);

const frontMaterial = new THREE.MeshStandardMaterial({
  map: colorTexture,

  transparent: true,
  alphaMap: colorTexture,

  emissive: new THREE.Color("#ff00ff"),
  emissiveMap: emissionTexture,
  emissiveIntensity: 4,

  roughness: 0.1,
  roughnessMap: colorTexture,
  metalness: 0.4,
  side: THREE.FrontSide,
});

const frontGlobe = new THREE.Mesh(geometry, frontMaterial);
frontGlobe.position.set(...globePosition);
frontGlobe.rotation.z = globeRotation;
scene.add(frontGlobe);

const ambientLight = new THREE.AmbientLight(0xff00ff, 0.8);
scene.add(ambientLight);

window.addEventListener("resize", function () {
  width = container.clientWidth;
  height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (window.innerWidth <= 768) {
    camera.position.z = 12;
    frontGlobe.position.set(0, 0, 0);
    backGlobe.position.set(0, 0, 0);
  } else {
    camera.position.z = 5;
    frontGlobe.position.set(...globePosition);
    backGlobe.position.set(...globePosition);
  }

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.dispatchEvent(new Event("resize"));

function animate() {
  requestAnimationFrame(animate);

  frontGlobe.rotateY(0.0012);
  backGlobe.rotateY(0.0012);

  renderer.render(scene, camera);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
animate();
