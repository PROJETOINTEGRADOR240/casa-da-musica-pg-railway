
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Bloqueia a tecla Enter
        }
    });
});

/*

document.addEventListener("DOMContentLoaded", function () {
    document.removeEventListener("keydown", blockEnter); // Remove caso já exista
    document.addEventListener("keydown", blockEnter);
});

function blockEnter(event) {
    if (event.key === "Enter" && !["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
        event.preventDefault();
    }
}
*/