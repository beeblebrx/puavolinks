$(document).ready(function() {
    var page = parseInt($("#pageNum").val());
    var numPages = parseInt($("#pages").val());

    if (!isNaN(page) && !isNaN(numPages)) {
        createPageLinks($(".numbers"), page, 6, numPages);
        $("#" + page).addClass("active");
    }
});

function createPageLinks(element, currentPage, surroundingPages, totalPages) {
    var firstPage = Math.max(0, currentPage - surroundingPages);
    var lastPage = Math.min(totalPages, currentPage + surroundingPages + 1);

    for (var page = firstPage; page < lastPage; page++) {
        element.append(" <a id='" + page +  "' href='/?page=" + page + "'>" + (page + 1) + "</a>");
    }

    if (lastPage < totalPages) {
        element.append(" …");
    }

    if (firstPage > 0) {
        element.prepend(" …");
    }
}
