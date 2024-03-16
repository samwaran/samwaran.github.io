var icon = document.getElementById("icon");
icon.onclick = function () {
    //data.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
    if (document.body.classList.contains("light-theme")) {
        icon.innerHTML = "dark mode"
    } else {
        icon.innerHTML = "light mode";
    }
}