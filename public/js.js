$(document).on('click', '#idScrape', function () {
    console.log("Clicked")
    $.get("/scrape", function (data) {
        console.log(data)
        var html = "";
        $('#result').html('');
        for (var i = 0; i < data.length; i++) {
            if (data[i].title != '') {
                html = '';
                html += `<div> <img src=${data[i].imgSrc} alt=${data[i].title} height='218' width='218'>`;
                html += `<h3> ${data[i].title} </h3>`;
                html += `<h5> ${data[i].price} </h5>`;
                // for(var j=0;j<data[i].author.length;j++) {
                html += `<h4> ${data[i].author}  </h4>`;
                // }
                html += `</h4></div>`
                $("#result").append(html);
            }
        }

    })
})