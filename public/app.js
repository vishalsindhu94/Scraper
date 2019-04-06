$(document).on("click", ".scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
      location.reload();
    });

});



$(document).on("click", ".save", function () {

  $.ajax({
    method: "PUT",
    url: "/save/" + $(this).attr("attrId")

  }).then(function (data) {
    
    console.log(data);

  });
  location.reload();
});


$(document).on("click", ".delete", function () {

  $.ajax({
    method: "PUT",
    url: "/delete/" + $(this).attr("attrId")

  }).then(function (data) {
    
    console.log(data);
  });

  location.reload();
});


$(document).on("click", ".addNote", function () {
  event.preventDefault();
  var articleId = $(this).attr("attrId")
  $("h5.modal-title").text("Notes for article: " + articleId);
  $.ajax({
    method: "GET",
    url: "/articles/" + articleId
  })
    .then(function (data) {

      console.log(data);
      $("#dbNotes").empty();
      for (var i = 0; i < data.notes.length; i++) {
        var txt2 = $("<span></span>").text(data.notes[i].title + ":" + data.notes[i].body);
        var delbutton = $("<button class='buttonSmall'>&times;</button>");
        delbutton.attr("attrId", data.notes[i]._id);
        delbutton.attr("articleId", articleId)
        delbutton.addClass("delnotebutton");
        $("#dbNotes").append(txt2, delbutton);


      }
      $(".saveNote").attr("articleId", articleId);

      $('#myModal').modal('show');

    });
});


$(document).on("click", ".saveNote", function () {

  $.ajax({
    method: "POST",
    url: "/articles/" + $(this).attr("articleId"),
    data: {
     
      title: $("#title").val(),
      
      body: $("#body").val()
    }

  }).then(function (data) {

    
    console.log(data);
    $("#title").val("");
    $("#body").val("");
    $("#myModal").modal("toggle");

  });
});



$(document).on("click", ".delnotebutton", function () {

  $.ajax({
    method: "POST",
    url: "/deleteArticles/" + $(this).attr("articleId") + "/" + $(this).attr("attrId")
  }).then(function (data) {
    
    console.log(data);
    $("#myModal").modal("toggle");

  });
});