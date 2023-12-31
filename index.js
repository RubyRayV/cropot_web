//LENIS Smooth scroll
  let lenis;
if (Webflow.env("editor") === undefined) {
  lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    wheelMultiplier: 0.9,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
$("[data-lenis-start]").on("click", function () {
  lenis.start();
});
$("[data-lenis-stop]").on("click", function () {
  lenis.stop();
});
$("[data-lenis-toggle]").on("click", function () {
  $(this).toggleClass("stop-scroll");
  if ($(this).hasClass("stop-scroll")) {
    lenis.stop();
  } else {
    lenis.start();
  }
});
function connectToScrollTrigger() {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}
//LENIS Smooth scroll END
  
//Swiper script START
const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  slidesPerView: "auto",
  spaceBetween: "5%",
  loop: true,
  slideActiveClass: "is-active",
  slideDuplicateActiveClass: "is-active",
  centeredSlides: false,
  speed: 500,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  // Responsive breakpoints

  //pagination dots of slider
  pagination: {
    el: $(".slider-main_component").find(".swiper-bullet-wrapper")[0],
    bulletActiveClass: "is-active",
    bulletClass: "swiper-bullet",
    bulletElement: "button",
    clickable: true
  }
});
//Swiper script END


//Gsap infinite marquee

gsap.registerPlugin(ScrollTrigger);

let direction = 1; // 1 = forward, -1 = backward scroll

const roll1 = roll(".innercontmarque .marque_div", { duration: 24 }),
  roll2 = roll(".rollingText02", { duration: 24 }, true),
  scroll = ScrollTrigger.create({
    onUpdate(self) {
      if (self.direction !== direction) {
        direction *= -1;
        gsap.to([roll1, roll2], { timeScale: direction, overwrite: true });
      }
    }
  });

// helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
function roll(targets, vars, reverse) {
  vars = vars || {};
  vars.ease || (vars.ease = "none");
  const tl = gsap.timeline({
      repeat: -1,
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
      }
    }),
    elements = gsap.utils.toArray(targets),
    clones = elements.map((el) => {
      let clone = el.cloneNode(true);
      el.parentNode.appendChild(clone);
      return clone;
    }),
    positionClones = () =>
      elements.forEach((el, i) =>
        gsap.set(clones[i], {
          position: "absolute",
          overwrite: false,
          top: el.offsetTop,
          left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)
        })
      );
  positionClones();
  elements.forEach((el, i) =>
    tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0)
  );
  window.addEventListener("resize", () => {
    let time = tl.totalTime(); // record the current time
    tl.totalTime(0); // rewind and clear out the timeline
    positionClones(); // reposition
    tl.totalTime(time); // jump back to the proper time
  });
  return tl;
}
//Gsap infinite marque END

// Split text into spans
window.addEventListener("DOMContentLoaded", (event) => {
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 80%",
        end: "top 10%",
        scrub: true
      }
    });
    tl.from($(this).find(".word"), {
      opacity: 0.2,
      duration: 0.6,
      ease: "power1.out",
      stagger: { each: 0.4 }
    });
  });
  // Split text into spans END

  //Footer Logo animation
  $(".spacer").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $(
      ".letter_wrapper_1, .letter_wrapper_2, .letter_wrapper_3, .letter_wrapper_4, .letter_wrapper_5, .letter_wrapper_6"
    );

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        // trigger element - viewport
        start: "80% center",
        end: "140% center",
        scrub: 1,
        ease: "power2.out"
      }
    });
    tl.to(targetElement, {
      y: "0%",
      duration: 1
    });
  });
});
//Footer Logo animation END

// Mobile Menu Animation
$(".nav_bar--main_pad").each(function () {
  let hamburgerEl = $(this).find(".nav_ham_wrap");
  let navLineEl = $(this).find(".nav_ham_line");
  let flipItemEl = $(this).find(".nav_ham_base");
  let menuContainEl = $(this).find(".menu_contain");
  let menuWrapEl = $(this).find(".menu_wrap");
  let menuBaseEl = $(this).find(".menu_base");
  let menuLinkEl = $(this).find(".menu_links_wrap, .menu_name_wrap");

  let flipDuration = 0.3;

  function flip(forwards) {
    let state = Flip.getState(flipItemEl);
    if (forwards) {
      flipItemEl.appendTo(menuContainEl);
    } else {
      flipItemEl.appendTo(hamburgerEl);
    }
    Flip.from(state, { duration: flipDuration, ease: "power2.Out" });
  }

  let tl = gsap.timeline({ paused: true });
  tl.set(menuWrapEl, { display: "flex" });
  tl.from(menuBaseEl, {
    opacity: 0,
    duration: flipDuration,
    ease: "power2.Out",
    onStart: () => {
      flip(true);
    }
  });
  tl.to(
    navLineEl.eq(0),
    {
      y: 4,
      rotate: -45,
      duration: flipDuration,
      ease: "power2.Out"
    },
    0
  );
  tl.to(
    navLineEl.eq(1),
    {
      y: -4,
      rotate: 45,
      duration: flipDuration,
      ease: "power2.Out"
    },
    0
  );
  tl.from(
    menuLinkEl,
    {
      delay: 0.2,
      opacity: 0,
      duration: flipDuration,
      ease: "power2.Out",
      onReverseComplete: () => {
        flip(false);
      }
    },
    0
  );
  tl.to(
    hamburgerEl,
    {
      y: 10,
      x: -10,
      duration: flipDuration
    },
    0
  );

  function openMenu(open) {
    if (!tl.isActive()) {
      if (open) {
        tl.play();
        hamburgerEl.addClass("nav-open");
      } else {
        tl.reverse();
        hamburgerEl.removeClass("nav-open");
      }
    }
  }

  hamburgerEl.on("click", function () {
    if ($(this).hasClass("nav-open")) {
      openMenu(false);
    } else {
      openMenu(true);
    }
  });

  menuBaseEl.on("click", function () {
    // Trigger a click event on the .nav_ham_wrap element
    hamburgerEl.click();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      hamburgerEl.click();
    }
  });
});
// Mobile Menu Animation END

//Navbar animation hide

$(".page_wrapper").each(function (index) {
  let triggerElement = $(this);
  let targetLogo = $(".logo_link_div");
  let targetLink = $(".idv_nav_link");
  let hamNav = $(".nav_ham_wrap");
  let navContainer = $(".nav_menu_container");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      // trigger element - viewport
      start: "1% top",
      end: "1% top",
      scrub: 1.1
    }
  });

  tl.to(
    targetLogo,
    {
      y: "-102%",
      ease: "power2.out"
    },
    0.1
  );

  tl.to(
    targetLink.eq(0),
    {
      y: "-102%",
      ease: "power2.out"
    },
    0.2
  );
  tl.to(
    targetLink.eq(1),
    {
      y: "-102%",
      ease: "power2.out"
    },
    0.3
  );
  tl.to(targetLink.eq(2), {
    y: "-102%",
    ease: "power2.out"
  });

  if ($(window).width() <= 991) {
    //i'll make it
  } else {
    tl.to(
      hamNav,
      {
        scale: 1,
        ease: "power2.out"
      },
      ">"
    );
  }
});

//Navbar animation hide

//Hover Links Effect

// Mouseenter function
function enterAnimation(link, e, index) {
  link.tl.tweenFromTo(0, "midway");
}

// Mouseleave function
function leaveAnimation(link, e) {
  link.tl.play();
}

// Get all links
let workLinks = document.querySelectorAll(".js-hover-link");

let defaulDuration = 0.4;
let defaultMagic = "power3.inOut";

workLinks.forEach((link, index, value) => {
  let underline = link.querySelector(".underline");
  link.tl = gsap.timeline({ paused: true });

  link.tl.fromTo(
    underline,
    {
      width: "0%",
      left: "0%"
    },
    {
      width: "100%",
      ease: defaultMagic,
      duration: 0.4
    }
  );

  link.tl.add("midway");

  link.tl.fromTo(
    underline,
    {
      width: "100%",
      left: "0%"
    },
    {
      width: "0%",
      left: "100%",
      duration: 0.2,
      ease: defaultMagic,
      immediateRender: false
    }
  );

  // Mouseenter
  link.addEventListener("mouseenter", (e) => {
    enterAnimation(link, e, index);
  });

  // Mouseleave
  link.addEventListener("mouseleave", (e) => {
    leaveAnimation(link, e);
  });
});

//Hover Links Effect END


//Local time script START
document.addEventListener("DOMContentLoaded", function () {
  const timeSpan = document.querySelector("#timeSpan");

  const optionsTime = {
    timeZone: "Europe/Kyiv",
    hour12: true,
    hour: "numeric",
    minute: "numeric"
  };

  const formatter = new Intl.DateTimeFormat([], optionsTime);
  updateTime();
  setInterval(updateTime, 1000);

  function updateTime() {
    const dateTime = new Date();
    const formattedDateTime = formatter.format(dateTime);
    timeSpan.textContent = formattedDateTime;
  }
});
//Local time script For contact page

//Local time(seconds) script  START
document.addEventListener("DOMContentLoaded", function () {
  const timeSpansecond = document.querySelector("#timeSpansecond");

  const optionsTime = {
    timeZone: "Europe/Kyiv",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };

  const formatter = new Intl.DateTimeFormat([], optionsTime);
  updateTime();
  setInterval(updateTime, 1000);

  function updateTime() {
    const dateTime = new Date();
    const formattedDateTime = formatter.format(dateTime);
    timeSpansecond.textContent = formattedDateTime;
  }
});
//Local time(seconds) script END