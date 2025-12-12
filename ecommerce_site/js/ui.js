/**
 * ui.js
 * ---------
 * Handles small global UI behaviours:
 * - Sets the current year in the footer
 * - Applies dark mode toggle using a CSS class and localStorage
 * - Runs the simple hero slider on the home page
 */

$(document).ready(function () {
    // Footer year
    $("#year").text(new Date().getFullYear());

    // Dark mode
    const DARK_KEY = "myshop_dark";
    const savedDark = localStorage.getItem(DARK_KEY);
    if (savedDark === "1") {
        $("body").addClass("dark");
    }
    $("#dark-mode-toggle").on("click", function () {
        $("body").toggleClass("dark");
        localStorage.setItem(DARK_KEY, $("body").hasClass("dark") ? "1" : "0");
    });

    // Simple hero slider
    const slides = $(".hero-slide");
    // Newsletter form: prevent real submit and show a simple demo message
    const newsletter = $("#newsletter-form");
    if (newsletter.length) {
        newsletter.on("submit", function (e) {
            e.preventDefault();
            const email = $("#newsletter-email").val().trim();
            if (!email) {
                alert("Please enter an email address.");
            } else {
                alert("Thanks for subscribing! (Demo only, no real emails will be sent.)");
            }
        });
    }

    if (slides.length > 0) {
        let idx = 0;
        setInterval(function () {
            slides.removeClass("active");
            idx = (idx + 1) % slides.length;
            slides.eq(idx).addClass("active");
        }, 4000);
    }
});
