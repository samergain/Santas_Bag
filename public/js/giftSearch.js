$(document).ready(function () {
  // Getting references to our form and input

  var searchGift = $("form.searchGift");
  var userId;
  var url = window.location.search;
  var userCircleId;


  $.get("/api/user_data").then(function (data) {
    userId = data.id;
  });

  userCircleId = deriveIdFromQueryString();
  getPerson(userCircleId);

  function deriveIdFromQueryString(){
    if (url.indexOf("?id=") !== -1) {
      userCircleId = url.split("=")[1];
      return userCircleId;
    }
  }


  function getPerson(userCircleId) {
    $.get("/api/getOnePerson/" + userCircleId, function (data) {
      if (data.length !== 0) {
        // $("#id").text(data[0].id);
        $("#name").text(data[0].name);
        $("#age").text(data[0].age);
        $("#budget").text(data[0].budget);
        $("#interests").text(data[0].keywords);
      }
      matchInterest(data[0].budget, data[0].keywords);
    });
  }

  function matchInterest(budget, keywords) {

    $.get("/api/matchInterest/" + budget + "/" + keywords, function (data) {
      if (data.length !== 0) {
        //var col = ["GIFT ID", "NAME", "PRICE", "HREF", "Choose One Gift"];
        var col = ["NAME", "PRICE", "HREF", "Choose One Gift"];
        var table = document.createElement("table");
        var tr = table.insertRow(-1);                   // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");      // TABLE HEADER.
          th.innerHTML = col[i];
          tr.appendChild(th);
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {
          tr = table.insertRow(-1);
          // var tabCell = tr.insertCell(-1);
          // tabCell.innerHTML = data[i].id;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i].name;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i].price;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = `<a href="${data[i].href}" target="_blank">URL</a>`;
          var tabCell = tr.insertCell(-1);
          // tabCell.innerHTML = "<button class='addGift' data-id='" + data[i].id + "'>CHOOSE GIFT</button>";
          tabCell.innerHTML = "<button class='addAGift green darken-3' data-id='" + data[i].id + "' giftName='" + data[i].name + "'  giftPrice='" + data[i].price + "' giftHREF='" + data[i].href + "'>CHOOSE GIFT</button>";
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("matchResult");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
      } else {
        var para = document.createElement("p");
        para.innerHTML = "No Matching Criteria";
        var divContainer = document.getElementById("matchResult");
        divContainer.innerHTML = "";
        divContainer.style.color = "rgb(223, 56, 56)";
        divContainer.appendChild(para);
      }

      $(".addAGift").click(function () {
        addPersonGift(userCircleId, $(this).attr("giftName"), $(this).attr("giftPrice"),  $(this).attr("giftHREF"));
      });


    });
  }

  
  // Otherwise we log any errors
  function addPersonGift(userCircleId, giftName, giftPrice, giftHREF) {
    $.post("/api/addPersonGift", {
      UserCircleId: userCircleId,
      name: giftName,
      price: giftPrice,
      href: giftHREF
    })
      .then(function (data) {
        $("#alert .msg").text("Gift Added to Selected person Successfully!");
        window.location.replace("/giftSearch.html?id=" + data.UserCircleId);
      })
      .catch(handleLoginErr);
  }
  
  dispGiftList(userCircleId);

  function dispGiftList(userCircleId) {
    $.get("/api/dispChosenGifts/" + userCircleId, function (data) {
      if (data.length !== 0) {
        //var col = ["GIFT ID", "NAME", "PRICE", "HREF", "Click to Remove"];
        var col = ["NAME", "PRICE", "HREF", "Click to Remove"];
        var table = document.createElement("table");
        var tr = table.insertRow(-1);                   // TABLE ROW.
        for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");      // TABLE HEADER.
          th.innerHTML = col[i];
          tr.appendChild(th);
        }
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {
          tr = table.insertRow(-1);
          // var tabCell = tr.insertCell(-1);
          // tabCell.innerHTML = data[i].id;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i].name;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i].price;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = `<a href="${data[i].href}" target="_blank">URL</a>`;
          var tabCell = tr.insertCell(-1);
          // tabCell.innerHTML = "<button class='addGift' data-id='" + data[i].id + "'>CHOOSE GIFT</button>";
          tabCell.innerHTML = "<button class='deleteGift green darken-3' data-id='" + data[i].id + "'>REMOVE GIFT</button>";
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("giftList");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
      } else {
        var para = document.createElement("p");
        para.innerHTML = "No Matching Criteria";
        var divContainer = document.getElementById("giftList");
        divContainer.innerHTML = "";
        divContainer.style.color = "rgb(223, 56, 56)";
        divContainer.appendChild(para);
      }

      $(".deleteGift").click(function () {
        $.ajax({
          method: "DELETE",
          url: "/api/delPersonGift/" + userCircleId + "/" + $(this).attr("data-id")
        })
          .then(function (data) {
            userCircleId = deriveIdFromQueryString();
            window.location.replace("/giftSearch.html?id=" + userCircleId);
          })
          .catch(handleLoginErr);
      });


    });
  }

  
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
