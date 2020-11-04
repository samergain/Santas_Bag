console.log("hello")

let giftObj = {
    title: [],
    thumbnail: [],
    current_price: [],
    url: []
};

$("#submitBtn").click(function (event) {
    event.preventDefault();
    console.log("inside");
    var gift = $(this).attr("data-gift");
    console.log(gift);
    var giftItems = $("#srchInput").val().trim();

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://rapidapi.p.rapidapi.com/product/search?keyword=${giftItems}&country=US`,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "6d1e8c65b3msh1a27a65b7342b1dp10f81fjsn7715a836924d",
            "x-rapidapi-host": "amazon-product-reviews-keywords.p.rapidapi.com"
        }
    };

    $.ajax(settings).done(function (response) {
        // console.log(response)
        for (let i = 0; (i < response.products.length
            && i < 10
        ); i++) {
               const giftInfo = response.products[i];
               console.log(response.products[i]);
            //console.log(response.products[i].title);
            giftObj.title.push(response.products[i].title);
            // console.log(response.products[i].thumbnail);
            giftObj.thumbnail.push(response.products[i].thumbnail);
            // console.log(response.products[i].price.current_price);
            giftObj.current_price.push("$" + response.products[i].price.current_price);
            // console.log(response.products[i].url);
            giftObj.url.push(response.products[i].url);
        }
        displayCards(giftObj)
        // console.log(response.products[0].title);
        // console.log(response.products[0].thumbnail);
        // console.log(response.products[0].price.current_price);
        // console.log(response.products[0].url);

    });

});

function displayCards(giftObj) {

    console.log(giftObj)

    let d1 = $("<div>");
    d1.attr("class", "card");
    d1.attr("style", "width: 100%;");
    let d2 = $("<div>");
    d2.attr("class", "card-body");
    let img = $("<img>");
    img.attr("class","card-img-top");
    img.attr("src", giftObj.thumbnail[0]);
    let aTag = $("<a>");
    aTag.attr("href", giftObj.url[0]);
    let hFive = $("<h5>");
    hFive.attr("class", "card-title");
    hFive.text(giftObj.title[0]);
    let pTag = $("<p>");
    pTag.attr("class", "card-text");
    pTag.text(giftObj.current_price[0]);

    d1.append(d2);
    d1.append(img);
    d2.append(hFive);
    d2.append(pTag);
    $(".result").append(d1);
}