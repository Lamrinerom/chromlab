let suggestions = [
    "Automatic Fraction Collector",
    "Element Analyzer",
    "Gas Chromatography Mass Spectrometry",
    "Gas Chromatography",
    "Ion Chromatograph",
    "Liquid Chromatography Mass Spectrometry",
    "Liquid Chromatography",
    "Portable GC-MS",
    "Portable Ion Chromatograph",
    "TLC Scanner",
    "Triple Quadrupole",
    "Automatic Fraction Collector CLFC-401",
    "Element Analyzer CLEA-101",
    "Gas Chromatograph-Mass Spectrometer CLGMS-601",
    "Gas Chromatograph-Mass Spectrometer CLGMS-602",
    "Gas Chromatography CLGC-601",
    "Gas Chromatography CLGC-602",

    "Ion Chromatograph CLIC-601",
    "Ion Chromatograph CLIC-602",
    "Ion Chromatograph CLIC-603",
    "Ion Chromatograph CLIC-604",
    "Ion Chromatograph CLIC-605",
    "Liquid Chromatograph Mass Spectrometer CLMS-601",
    "Liquid Chromatograph Mass Spectrometer CLMS-602",
    "Liquid Chromatography CLLC-601",
    "Liquid Chromatography CLLC-602",
    "Liquid Chromatography CLLC-603",
    "Portable GC-MS CLPCS-601",
    "Portable GC-MS CLPCS-602",
    "Portable Ion Chromatograph CLPIC-601",
    "TLC Scanner CLTS-601",
    "Triple Quadrupole GCMS CLTQC-601",
    
];

// getting all required elements
const searchInput = document.querySelector(".searchInput");
// const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
const icon = searchInput.querySelector(".icon");
const input = document.querySelector("#labSearch");
let linkTag = searchInput.querySelector("a");
let webLink;
// Auto-change placeholder for Chromlab
const placeholders = [
  "Search lab equipment…",
  "Search centrifuge, oven…",
  "Search Chromlab instruments…",
  "Find lab solutions…",
  "Explore lab products…",
  "Discover lab tools…",
  "TLC Scanner"

];
let phIndex = 0;
let phTimer;

function rotatePlaceholder() {
  input.placeholder = placeholders[phIndex];  // Use existing 'input'
  phIndex = (phIndex + 1) % placeholders.length;
}

// Start rotation
phTimer = setInterval(rotatePlaceholder, 3000);

// Pause during typing
input.addEventListener("focus", () => clearInterval(phTimer));
input.addEventListener("blur", () => phTimer = setInterval(rotatePlaceholder, 3000));
// if user press any key and release
input.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        emptyArray = suggestions.filter((data)=>{
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
            return data = '<li>'+ data +'</li>';
        });
        searchInput.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = resultBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchInput.classList.remove("active"); //hide autocomplete box
    }
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    resultBox.innerHTML = listData;
}

// ---------------------------------------------------------------------------bannee00000


 document.addEventListener('DOMContentLoaded', () => {
  const banners = document.querySelectorAll('.banner-item');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  const changeInterval = 7500;

  function showBanner(index) {
    // Update banners
    banners.forEach((banner, i) => {
      banner.classList.toggle('active', i === index);
    });
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextBanner() {
    currentIndex = (currentIndex + 1) % banners.length;
    showBanner(currentIndex);
  }

  // Dot click handler
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      showBanner(currentIndex);
    });
  });

  showBanner(currentIndex);
  setInterval(nextBanner, changeInterval);
});

// ------------------------------------------Slider category


(function() {
  'use strict';
  
  const carousel = document.getElementById("carousel");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let index = 0;
  let isTransitioning = false;
  let cardWidth = 0;

  function updateCardWidth() {
    cardWidth = carousel.children[0].offsetWidth;
  }

  const originalCards = Array.from(carousel.children);
  const originalCount = originalCards.length;

  // Clone original cards for infinite loop
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    carousel.appendChild(clone);
  });

  updateCardWidth();

  function updateCarousel() {
    carousel.style.transition = '0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    carousel.style.transform = `translateX(-${index * cardWidth}px)`;
    isTransitioning = true;
    setTimeout(() => { isTransitioning = false; }, 600);
  }

  function slideNext() {
    if (isTransitioning) return;
    index++;
    if (index >= originalCount) {
      updateCarousel();
      setTimeout(() => {
        carousel.style.transition = 'none';
        index = 0;
        carousel.style.transform = `translateX(0px)`;
        carousel.offsetHeight; // Trigger reflow
        carousel.style.transition = '0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        isTransitioning = false;
      }, 600);
    } else {
      updateCarousel();
    }
  }

  function slidePrev() {
    if (isTransitioning) return;
    if (index === 0) {
      carousel.style.transition = 'none';
      index = originalCount - 1;
      carousel.style.transform = `translateX(-${index * cardWidth}px)`;
      carousel.offsetHeight;
      carousel.style.transition = '0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => {
        index--;
        updateCarousel();
      }, 50);
    } else {
      index--;
      updateCarousel();
    }
  }

  nextBtn.addEventListener("click", slideNext);
  prevBtn.addEventListener("click", slidePrev);

  // Add drag to scroll support for desktop and touch devices
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.parentElement.style.overflowX = 'auto';
  carousel.parentElement.style.scrollSnapType = 'x mandatory';

  carousel.parentElement.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.parentElement.offsetLeft;
    scrollLeft = carousel.parentElement.scrollLeft;
  });

  carousel.parentElement.addEventListener('mouseleave', () => {
    isDown = false;
  });

  carousel.parentElement.addEventListener('mouseup', () => {
    isDown = false;
  });

  carousel.parentElement.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.parentElement.offsetLeft;
    const walk = (x - startX) * 2; //scroll-fast
    carousel.parentElement.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile dragging
  carousel.parentElement.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - carousel.parentElement.offsetLeft;
    scrollLeft = carousel.parentElement.scrollLeft;
  });

  carousel.parentElement.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - carousel.parentElement.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.parentElement.scrollLeft = scrollLeft - walk;
  });

  window.addEventListener('resize', () => {
    updateCardWidth();
    updateCarousel();
  });
})();

// ------------------------------------------Best seller section


document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.bs-carousel');
  const prevBtn = document.querySelector('.bs-prev');
  const nextBtn = document.querySelector('.bs-next');

  const card = carousel.querySelector('.bs-card');
  const cardWidth = () => card.getBoundingClientRect().width + 16; // 16 = gap

  let holdInterval = null;

  function scrollByCards(direction) {
    carousel.scrollBy({ left: direction * cardWidth(), behavior: 'smooth' });
  }

  // Click scroll
  prevBtn.addEventListener('click', () => scrollByCards(-1));
  nextBtn.addEventListener('click', () => scrollByCards(1));

  // Hold to slide
  function startHold(direction) {
    if (holdInterval) return;
    holdInterval = setInterval(() => {
      carousel.scrollBy({ left: direction * 10, behavior: 'auto' });
    }, 16);
  }
  function stopHold() {
    clearInterval(holdInterval);
    holdInterval = null;
  }

  ['mousedown', 'touchstart'].forEach(ev => {
    prevBtn.addEventListener(ev, e => { e.preventDefault(); startHold(-1); });
    nextBtn.addEventListener(ev, e => { e.preventDefault(); startHold(1); });
  });
  ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => {
    prevBtn.addEventListener(ev, stopHold);
    nextBtn.addEventListener(ev, stopHold);
  });

  // Optional: drag to slide
  let isDown = false, startX, scrollLeft;
  carousel.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  window.addEventListener('mouseup', () => isDown = false);
  carousel.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });
});
// -------------------------------------------Best seller

$(document).ready(function() {
    $('.slick-carousel').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        infinite: true,
        arrows: true, // Enable navigation arrows
        autoplay: true,
        autoplaySpeed: 2500, // Slide every 2.5 seconds (customize as needed)
        // prevArrow: '<button type="button" class="slick-prev" style="background: #1d297c; color: #fff; border: none; border-radius: 18px; width: 36px; height: 36px; font-size: 20px; position: absolute; top: 45%; left: -40px; z-index: 3;"></button>',
        // nextArrow: '<button type="button" class="slick-next" style="background: #1d297c; color: #fff; border: none; border-radius: 18px; width: 36px; height: 36px; font-size: 20px; position: absolute; top: 45%; right: -40px; z-index: 3;"></button>',
        responsive: [
           {
                breakpoint: 1400,
                settings: { slidesToShow: 6 }
            },
            {
                breakpoint: 1200,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 }
            }
        ]
    });
});


