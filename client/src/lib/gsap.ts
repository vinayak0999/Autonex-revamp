import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, Flip, Draggable);

// Custom eases used across the site
export const EASE_SPRING = "elastic.out(1, 0.5)";
export const EASE_EXPO = "expo.out";
export const EASE_BACK = "back.out(1.7)";
export const EASE_POWER4 = "power4.out";
export const EASE_CIRC = "circ.out";

// Brand colors
export const BRAND_BLUE = "#62AADE";
export const BRAND_DARK_BLUE = "#163791";
export const BRAND_BG = "#060d1f";

/**
 * Split a string into individual character spans for letter animations.
 * Returns an array of span elements as an HTML string.
 */
export function splitTextToChars(text: string, className = ""): string {
  return text
    .split("")
    .map((char) =>
      char === " "
        ? `<span class="inline-block">&nbsp;</span>`
        : `<span class="inline-block overflow-hidden"><span class="inline-block char ${className}">${char}</span></span>`
    )
    .join("");
}

/**
 * Split a string into individual word spans.
 */
export function splitTextToWords(text: string, className = ""): string {
  return text
    .split(" ")
    .map(
      (word) =>
        `<span class="inline-block overflow-hidden"><span class="inline-block word ${className}">${word}</span></span>`
    )
    .join(" ");
}

/**
 * Animate chars inside a container element (after splitTextToChars).
 */
export function animateChars(
  container: Element,
  vars: gsap.TweenVars = {},
  stagger = 0.04
) {
  const chars = container.querySelectorAll(".char");
  return gsap.from(chars, {
    y: "110%",
    opacity: 0,
    duration: 0.7,
    ease: EASE_POWER4,
    stagger,
    ...vars,
  });
}

/**
 * Animate words inside a container element (after splitTextToWords).
 */
export function animateWords(
  container: Element,
  vars: gsap.TweenVars = {},
  stagger = 0.06
) {
  const words = container.querySelectorAll(".word");
  return gsap.from(words, {
    y: "105%",
    opacity: 0,
    duration: 0.8,
    ease: EASE_POWER4,
    stagger,
    ...vars,
  });
}

export { gsap, ScrollTrigger, Flip, Draggable };
