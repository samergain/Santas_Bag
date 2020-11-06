// Requiring necessary npm packages
let apiKey = "5c99655c93mshf30b397f69e00d4p122229jsn735f2f65bb9b";

let giftObj = {
    title: [],
    thumbnail: [],
    current_price: [],
    url: []
};
$("#submitBtn").click(function (event) {
    event.preventDefault();
    console.log("inside");
    let gift = $(this).attr("data-gift");
    console.log(gift);
    let giftItems = $("#srchInput").val().trim();
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://rapidapi.p.rapidapi.com/product/search?keyword=${giftItems}&country=US`,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "amazon-product-reviews-keywords.p.rapidapi.com"
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        for (let i = 0; (i < response.products.length && i < 10); i++) {
            const giftInfo = response.products[i];
            console.log(giftItems);
            giftObj.title.push(response.products[i].title);
            giftObj.thumbnail.push(response.products[i].thumbnail);
            giftObj.current_price.push("$" + response.products[i].price.current_price);
            giftObj.url.push(response.products[i].url);
        }
        displayCards(giftObj)
    }).catch(function(err){
        alert("API Search limit has been reached");
    });
});
function displayCards(giftObj) {
    console.log(giftObj)
     for (let i = 0; i < giftObj.thumbnail.length; i++) {
        let d1 = $("<div>");
        d1.attr("class", "card");
        d1.attr("class", "giftCard");
        let d2 = $("<div>");
        d2.attr("class", "card-body");
        let img = $("<img>");
        img.attr("class", "card-img-top");
        img.attr("src", giftObj.thumbnail[i]);
        let btnTag = $("<button>");
        //btnTag.attr("class", "btn btn-success addGift green darken-3");
        btnTag.attr("class", "addGift");
        btnTag.attr("id", i);
        btnTag.text("Add Gift!");
        let aTag = $("<a>");
        aTag.attr("href", giftObj.url[i]);
        aTag.attr("target", "_blank");
        aTag.text(giftObj.title[i]);
        let hFive = $("<h5>");
        hFive.attr("class", "card-title");
        let pTag = $("<p>");
        pTag.attr("class", "card-text");
        pTag.text(giftObj.current_price[i]);
        d1.append(d2);
        d1.append(img);
        d1.append(btnTag);
        d2.append(hFive);
        hFive.append(aTag);
        d2.append(pTag);
        $(".result").append(d1);
    }   
}
let url = window.location.search;
let userCircleId;
    if (url.indexOf("?id=") !== -1) {
      userCircleId = url.split("=")[1];
      console.log("giftSearch file - userCircleId #1: ", userCircleId);
    }
// $(".addGift").click(function(event) {
//     // event.preventDefault();
//     let btnID = $(this).attr("data-id");
//     console.log("clicked button");
//     addGiftBtn(giftObj.title[btnID], userCircleId, giftObj.current_price[btnID], giftObj.url[btnID]);
// })
// function addGiftBtn(giftTitle, giftUserId, giftPrice, giftHref) {
//     console.log("function addGiftBtn called");
//     $.post("/api/addPersonGift", {
//       name: giftTitle,
//       UserCircleId : giftUserId,
//       price: giftPrice,
//       href : giftHref,
//     })
//       .then(function(data) {
//         console.log("addedGiftBtn", data);
//         window.location.replace("/giftPerson");
//       })
//       .catch(handleLoginErr);
//   }
//   function handleLoginErr(err) {
//     $("#alert .msg").text(err.responseJSON);
//     $("#alert").fadeIn(500);
//   }

// Add the Gift selected from the API response to the Gift Person of the Login User 
document.body.addEventListener('click', function (event) {
    console.log(event);
    console.log("EVENT CLASS NAME: " ,event.target.className);
    event.stopPropagation();
    if (event.target.className == "addGift") {
        event.preventDefault();
        if (url.indexOf("?id=") !== -1) {
            userCircleId = url.split("=")[1];
            console.log("giftSearch file - userCircleId #1: ", userCircleId);
        }

        // let btnID = $(this).attr("id");
        let btnID = event.target.id;            //Each button Id carries the index of the array that contains the API results
        let giftTitle = giftObj.title[btnID];
        let giftPrice = parseInt(giftObj.current_price[btnID].replace('$', ''));    //Removes the $ sign from the Price value
        let giftURL = giftObj.url[btnID];

        console.log("BUTTON ID: ", btnID);
        console.log("giftObj.userCircleId: ", userCircleId);
        console.log("giftObj.title: ", giftTitle);
        console.log("giftObj.price: ", giftPrice);
        console.log("giftObj.url: ", giftURL);

        addGiftBtn(giftTitle, userCircleId, giftPrice, giftURL);
    }

    //Function to Add a Gift from API response to the Gift Person
    function addGiftBtn(giftTitle, giftUserId, giftPrice, giftHref) {
        console.log("function addGiftBtn called");
        $.post("/api/addPersonGift", {
            name: giftTitle,
            UserCircleId: giftUserId,
            price: giftPrice,
            href: giftHref,
        })
            .then(function (data) {
                console.log("addedGiftBtnfrom API", data);
                window.location.replace("/giftSearch.html?id=" + data.UserCircleId);
            })
            .catch(handleErr);
    }
    //Error Handling
    function handleErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }
});