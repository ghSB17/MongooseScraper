$(document).ready(function () {

    $(document).on("button.btnNote", "click", function (e) {
        alert("Click??")
        console.log("CLicked SUbmit" + $(".btnNote").data("id"))
    })
    // $('body').on('click', 'a.myclass', function() {
    //     // do something
    // });
    // $(document).on('click', ".cmnts", function (e) {
    //     alert("Click??")
    //     alert($(this).data("link"))
    //     console.log("CLICKED!!!!")
    //     let id=$(this).data("id")
    //     let link = $(this).data("link")
    //     let cmnts = $(this).data("comments")

    //     $.post("/book/"+id, {
    //                 link:link,
    //                 acmnts: data,
    //                 dcmnts: ( (dbCmnts.length!=0) ? dbCmnts : [] ) 
    //             }, function () {
    //                 console.log("<<done!!>>")
    //             })

    //         })

    //     })
    // })


})