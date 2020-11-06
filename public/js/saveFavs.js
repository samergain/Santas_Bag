$(document).ready(function() {
  // Getting references to our form and input
  var saveFavs = $("form.saveFavs");
  var userId;

  //Get the Login User information
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
    userId = data.id;  
  });

  //Render all the Gifts added to the Favourites dynamically
  showAllGifts();

  function showAllGifts() {
    $.get("/api/allItemStorage", function (data) {
      if (data.length !== 0) {
        var col = ["NAME", "PRICE", "HREF"];
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
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i].name;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i].price;
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = `<a href="${data[i].href}" target="_blank">URL</a>`;
          var tabCell = tr.insertCell(-1);
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("allGifts");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
      } else {
        var para = document.createElement("p");
        para.innerHTML = "No Matching Criteria";
        var divContainer = document.getElementById("allGifts");
        divContainer.innerHTML = "";
        divContainer.style.color = "rgb(223, 56, 56)";
        divContainer.appendChild(para);
      }

    });
  }


  // The page also has option to add new gift favorites. This it the Onclick of the SaveFavourite feature.
  saveFavs.on("submit", function(event) {
    event.preventDefault();
    var itemStorageData = {
      name : $("#nameInput").val().trim(),
      price: $("#priceInput").val().trim(),
      href: $("#hrefInput").val().trim(),
      interests: $("#interestsInput").val().trim()
    };

    if (!itemStorageData.name)  {
      return;
    }

    saveFavGift(itemStorageData.name, itemStorageData.price, itemStorageData.href, itemStorageData.interests);
    $("#nameInput").val("");
    $("#hrefInput").val("");
    $("#priceInput").val("");
    $("#interestsInput").val("");

  });


//Save the Favourites Gifts manually entered into the Save Faoutire Form
  function saveFavGift(name, price, href, interests) {
    $.post("/api/saveFavGift", {
      name: name,
      price: price,
      href: href,
      interests: interests
    })
      .then(function(data) {
        $("#alert .msg").text("Favourite Gift Added to Database Successfully!");
        window.location.replace("/saveFavs.html");
      })
      .catch(handleLoginErr);
  }
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});