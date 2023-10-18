//var data = document.getElementById("data-light");
//var icon = document.getElementById("icon");
icon.onclick = function () {
    //data.body.classList.toggle("dark-theme");
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "assets/lamp-light.png";
    } else {
        icon.src = "assets/lamp-dark.png";
    }
}

$(".change").on("click", function () {
    if ($("body").hasClass("dark-theme")) {
        $("body").removeClass("dark-theme");
        $(".change").icon("assets/lamp-light.png")
    } else {
        $("body").addClass("dark-theme");
        $(".change").icon("assets/lamp-dark.png")
    }
});