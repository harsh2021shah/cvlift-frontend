import "../scss/main.scss";
import "./headerAnimation";

import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import lottie from "lottie-web";

import mq from "./mediaQuery";

// ? ------------  setup GSAP/Plugins  & Lenis smooth scrolling ------------

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// initialize lenis smooth scrolling
const lenis = new Lenis({
	lerp: 0.07, // animation smoothness (between 0 & 1)
	wheelMultiplier: 0.7, // scrolling speed for mouse wheel
	touchMultiplier: 0.7, // scrolling speed for touch events
	smoothWheel: true, // smooth scrolling for while events
	smoothTouch: true, // smooth scrolling for touche events
	orientation: "vertical", // orientation of the scrolling (vertical/horizontal)
	gestureOrientation: "vertical", // orientation of the gestures (vertical/horizontal)
	normalizeWheel: false, // Normalize wheel inputs
	infinite: false, // infinite scroll
	autoResize: true,
});

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Using Gsap ScrollTrigger with lenis
function connectToScrollTrigger() {
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add(function (time) {
		lenis.raf(time * 1000);
	});
}
connectToScrollTrigger();

// ? ------------  GSAP on Scroll animations  ------------

// the scroll animation only fires in desktop >= 991px
let xmdG = gsap.matchMedia();
xmdG.add(mq.xMedium, () => {
	// Setup Lottie's animation
	// see : https://airbnb.io/lottie/#/web
	const lottieContainer = document.querySelector(".ai__mockup");

	if (lottieContainer) {
		let playhead = { frame: 0 },
			mockupLottieAnimation = lottie.loadAnimation({
				container: lottieContainer, // the dom element that will contain the animation
				renderer: "svg", // Use 'svg' as animation format rendered in the container (svg || canvas|| html )
				loop: !!+lottieContainer.dataset.loop, // true/false
				autoplay: !!+lottieContainer.dataset.autoplay, // true/false
				path: lottieContainer.dataset.src, // the path to the animation json
				// name: "Hello World", // Name for future reference.
			});

		// Optionally set animation speed and other properties
		lottie.setSpeed(20);
		// mockupLottieAnimation.addEventListener("DOMLoaded", function () {
		//! important : scroll triggers must be in order ,
		//! the first section is the one which triggers the first scrollTrigger first  in this code (tlHero)

		let scrollTriggerHero = {
			trigger: ".hero",
			pin: true,
			// pinSpacing: "margin",
			// pinType: "transform",
			// pinReparent: true,
			// anticipatePin: .2, // may help avoid jump
			start: "top 2.5%", // when the top of the trigger hits the top of the viewport
			end: "4000px",
			scrub: 1,
			// markers: true,
		};
		let tlHero = gsap.timeline({
			scrollTrigger: scrollTriggerHero,
		});

		let scrollTriggerAi = {
			trigger: ".ai__main",
			pin: true,
			start: "top top", // when the top of the trigger hits the top of the viewport
			end: "+=4000",
			scrub: 1,
			// markers: true,
		};
		let tlAi = gsap.timeline({
			scrollTrigger: scrollTriggerAi,
		});

		//?  -------- Hero section animation ------------
		const hero = document.querySelector(".hero");
		const heroMockupContainer = document.querySelector(".hero__mockup-container");
		const heroLines = document.querySelector(".hero__lines");
		const heroMockup = document.querySelector(".hero__mockup");
		const heroMockupImg = document.querySelector(".hero__mockup-img");
		const heroMockupVideo = document.querySelector(".hero__mockup-container video");
		const heroVideoDesc = document.querySelector(".hero__video-desc");

		if (hero && heroMockupContainer) {
			tlHero
				.to(heroMockupContainer, { yPercent: "-40", transformOrigin: "center 21%" })
				.to(heroMockupContainer, { scale: 6 })
				.to([heroLines, heroMockup, heroMockupImg], { autoAlpha: 0 })
				.to(heroMockupContainer, { scale: 1 })
				.to(heroMockupContainer, { width: "100%", height: "100%", top: "50%", yPercent: "-50", xPercent: "-50" }, "<")
				//.to(heroMockupVideo, { top: 0, left: 0, height: "100%", width: "100%", borderRadius: "3rem", ease: "linear" }, "<")
				.to(hero, { backgroundPosition: "100% 0, 0", backgroundSize: "cover" }, "<")
				.fromTo(heroVideoDesc, { yPercent: "100", autoAlpha: 0 }, { yPercent: "-15", autoAlpha: 1 });
		}

		//?  -------- AI section animation ------------

		//  select elements
		const descContentAi = [
			{
				title: "Smart Customization",
				paragraph: "AI tailors your resume to match your experience level—whether you're a fresh graduate or a senior professional.",
			},
			{
				title: "Job-Perfect Matching",
				paragraph: "Every resume is optimized for the specific role. Keywords, skills, and tone aligned perfectly with job requirements.",
			},
			{
				title: "ATS-Optimized Templates",
				paragraph: "10 professional templates designed to pass Applicant Tracking Systems and get your resume seen by recruiters.",
			},
			{
				title: "Any Format You Need",
				paragraph: "Export your resume as PDF, DOCX, or TXT. Fully compatible with every job portal and application system.",
			},
		];
		const progressBarsAi = document.querySelectorAll(".ai__progress-bar");
		const mockupImagesAi = document.querySelectorAll(".ai__mockup-images img");
		const descAi = document.querySelectorAll(".ai__desc");
		const descTitleAi = document.querySelectorAll(".ai__desc-title");
		const descParagraphAi = document.querySelectorAll(".ai__desc-paragraph");
		const muckupBackupAi = document.querySelector(".mockup__backup");
		const imgBackupAi = document.querySelector(".img__backup");

		// use Lottie's animation with scrolltrigger

		// add lottie's animation in the first second of the timeline when its loaded
		mockupLottieAnimation.addEventListener("DOMLoaded", () => {
			if (muckupBackupAi && imgBackupAi) {
				muckupBackupAi.style.opacity = "0";
				muckupBackupAi.style.visibility = "hidden";
				imgBackupAi.style.opacity = "0";
				imgBackupAi.style.visibility = "hidden";
			}
			tlAi.to(
				playhead,
				{
					frame: mockupLottieAnimation.totalFrames - 1,
					duration: lottieContainer.dataset.duration,
					ease: "none",
					onUpdate: () => {
						mockupLottieAnimation.goToAndStop(playhead.frame, true);
					},
				},
				1
			);
		});

		descContentAi.forEach(({ title, paragraph }, index) => {
			if (progressBarsAi[index]) {
				tlAi.to(progressBarsAi[index], { duration: 4, scaleY: 1 })
					.to(progressBarsAi[index + 1], { duration: 4, scaleY: 2.8 }, "<")
					.to(descAi, { duration: 0.1, autoAlpha: 0 })
					.to(descTitleAi, { duration: 0.01, text: title })
					.to(descParagraphAi, { duration: 0.01, text: paragraph }, "<")
					.to(descAi, { duration: 2, autoAlpha: 1 })
					.from(mockupImagesAi[index], { duration: 2, autoAlpha: 0 }, "<");
			}
		});

		// scaleY of the last progress bar
		tlAi.to(progressBarsAi, { duration: 12, scaleY: 1 });
	}
});

// ? ------------  smooth scrolling (Lenis) in anchor links (nav links) ------------

document.querySelectorAll("nav > a").forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		// gsap.ticker.fps(15);
		lenis.scrollTo(`${e.target.getAttribute("href")}`, {
			lerp: 0.09,
			onComplete: () => {
				// Resume GSAP animations after scrolling is complete
				// gsap.ticker.fps(60);
			},
		});
		// const targetSection = document.querySelector(`${e.target.getAttribute("href")}`);
		// targetSection.scrollIntoView({ behavior: "smooth" });
	});
});
