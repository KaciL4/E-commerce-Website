/**
 * search.js
 * ----------------------------
 * Responsible for:
 * - Live search suggestions under the header search bar
 * - Navigating to products.html?q=... when user presses Enter
 * - Using allProducts from products.js to match product names
 */

function initSearch() {
    const input = $("#search-input");
    const suggestions = $("#search-suggestions");
    if (input.length === 0 || suggestions.length === 0) return;

    function closeSuggestions() {
        suggestions.hide();
    }

    function openSuggestions() {
        if (suggestions.children().length > 0) {
            suggestions.show();
        }
    }

    input.on("input", function () {
        const q = $(this).val().trim().toLowerCase();
        suggestions.empty();
        if (!q || allProducts.length === 0) {
            closeSuggestions();
            return;
        }
        const matches = allProducts
            .filter(p => p.name.toLowerCase().includes(q))
            .slice(0, 10);
        matches.forEach(p => {
            const highlighted = p.name.replace(
                new RegExp("(" + q + ")", "ig"),
                "<mark>$1</mark>"
            );
            const item = $(`<div data-id="${p.id}">${highlighted}</div>`);
            item.on("click", function () {
                window.location.href = "product.html?id=" + encodeURIComponent(p.id);
            });
            suggestions.append(item);
        });
        openSuggestions();
    });

    input.on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const q = $(this).val().trim();
            if (q) {
                window.location.href = "products.html?q=" + encodeURIComponent(q);
            }
        }
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest(".search-wrapper").length) {
            closeSuggestions();
        }
    });
}

$(document).ready(function () {
    loadProducts(function () {
        initSearch();
    });
});
