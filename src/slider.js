let slideIndex;
let slides = document.getElementsByClassName("mySlides");
slideShow()
function slideShow() {
    slideIndex = 0;
    showSlides();
}


function showSlides() {
    let i;
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slideIndex == i) { slideIndex = 0; }
    slides[slideIndex].style.display = "block";
    slideIndex++;
    setTimeout(showSlides, 1500); // Change image every 1.5 seconds
} 