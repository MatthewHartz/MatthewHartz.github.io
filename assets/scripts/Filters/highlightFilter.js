app.filter("highlightFilter", function () {
    return function (highlights, type) {
        //return highlight.section === type;
        var filtered = [];
        angular.forEach(highlights, function (highlight) {
            if (highlight.section === type) {
                filtered.push(highlight);
            }
        });
        return filtered;
    };
});