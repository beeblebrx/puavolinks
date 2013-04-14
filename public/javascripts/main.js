$(document).ready(function() {
    var page = parseInt($("#pageNum").val());
    var numPages = parseInt($("#pages").val());

    if (!isNaN(page) && !isNaN(numPages)) {
        createPageLinks($(".pages"), page, 6, numPages);
        $("#" + page).addClass("active");
    }
});

function createPageLinks(element, currentPage, surroundingPages, totalPages) {
    var firstPage = Math.max(0, currentPage - surroundingPages);
    var lastPage = Math.min(totalPages, currentPage + surroundingPages + 1);

    for (var page = firstPage; page < lastPage; page++) {
        element.append("<li><a id='" + page +  "' href='/?page=" + page + "'>" + (page + 1) + "</a></li>");
    }

    if (lastPage < totalPages) {
        element.append("<li><a href ='#'>…</a></li>");
    }

    if (firstPage > 0) {
        element.prepend("<li><a href='#'>…</a></li>");
    }
}
