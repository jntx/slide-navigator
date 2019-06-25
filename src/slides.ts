import { Controls } from './models/Controls';

function slideController(container : HTMLElement, slideSelector : string) {
	let doc = document;
	let host = container;
	let hostContainer = doc.querySelector("html") || { scrollTop : 0 };
	let slides : NodeListOf<HTMLElement> = container.querySelectorAll(slideSelector);
	let position = 0;
	let controls : Controls = {
		prev : null,
		count : null,
		next : null
	}

	let slidePrev = e => {
		if (position == 0) {
			return;
		}

		setActiveSlide(--position);
	};

	let slideNext = e => {
		if (position == slides.length - 1) {
			return;
		}

		setActiveSlide(++position);
	};

	let setActiveSlide = n => {
		if (!(n in slides)) {
			return;
		}

		slides.forEach(slide => {
			slide.classList.add("hide");
			slide.classList.remove("show");
		});

		if (n == 0) {
			controls.prev.classList.add("disabled");
			controls.prev.classList.remove("enabled");
		} else {
			controls.prev.classList.add("enabled");
			controls.prev.classList.remove("disabled");
		}

		if (n == slides.length - 1) {
			controls.next.classList.add("disabled");
			controls.next.classList.remove("enabled");
		} else {
			controls.next.classList.add("enabled");
			controls.next.classList.remove("disabled");
		}

		slides[n].classList.remove("hide");
		slides[n].classList.add("show");
		hostContainer.scrollTop = 0;

		controls.count.innerHTML = `${n + 1} / ${slides.length}`;
	}

	let setupKeyBindings = function() {
		doc.addEventListener("keyup", e => {
			switch(e.key) {
				case "ArrowRight":
					slideNext(e);
					break;
				case "ArrowLeft":
					slidePrev(e);
					break;
			}

			return true;
		}, true);
	}

	let setup = () => {
		let html = `
			<div class="sc--control sc--prev">&lt;</div>
			<div class="sc--control sc--position">${position + 1} / ${slides.length}</div>
			<div class="sc--control sc--next">&gt;</div>
		`;

		let d = doc.createElement("div");
		d.classList.add("sc--controls");
		d.innerHTML = html;
		
		controls.prev = d.querySelector(".sc--prev");
		controls.count = d.querySelector(".sc--position");
		controls.next = d.querySelector(".sc--next");

		controls.prev.addEventListener("click", slidePrev);
		controls.next.addEventListener("click", slideNext);

		host.appendChild(d);

		setActiveSlide(0);

		setupKeyBindings();
	};

	setup();
}