//var data = document.getElementById("data-light");
var icon = document.getElementById("icon");
icon.onclick = function () {
    //data.body.classList.toggle("dark-theme");
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.innerHTML = "light mode"
    } else {
        icon.innerHTML = "dark mode";
    }
}