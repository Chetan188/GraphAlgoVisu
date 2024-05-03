const toggleSidebar = () => {

    if ($(".sidebar").is(":visible")) {
        // true
        //band karna hai
        $(".sidebar").css("display", "none")
        $(".barsBtn").css("background-color", "white")
        $(".content").css("margin-left", "0%")
    } else {
        //false
        //start karna hai
        $(".sidebar").css("display", "block")
        $(".barsBtn").css("background-color", "")
        $(".content").css("margin-left", "20%")
    }
}