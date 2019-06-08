(function () {
    const doc = document.documentElement;

    doc.classList.remove('no-js');
    doc.classList.add('js');

    // Reveal animations
    if (document.body.classList.contains('has-animations')) {
        /* global ScrollReveal */
        const sr = window.sr = ScrollReveal();

        sr.reveal('.hero-title, .hero-paragraph, .newsletter-header, .newsletter-form', {
            duration: 000,
            distance: '40px',
            easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
            origin: 'bottom',
            interval: 150
        });

        sr.reveal('.bubble-3, .bubble-4, .hero-browser-inner, .bubble-1, .bubble-2', {
            duration: 000,
            scale: 0.95,
            easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
            interval: 150
        });

        sr.reveal('.feature', {
            duration: 00,
            distance: '40px',
            easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
            interval: 100,
            origin: 'bottom',
            viewFactor: 0.5
        });
    }
}());


//Method that takes a feed URL, bypasses CORS and retrieves XML RSS feed, then converts to JSON
function getFeed(url) {
    //Fetch XML feed, bypass cors with cors anywhere..thank god
    //refactor me
    let feedURL = "https://cors-anywhere.herokuapp.com/" + url;

    let request = new XMLHttpRequest();
    request.open("GET", feedURL, false);
    request.send();
    let responseXML = request.responseXML;


// Changes XML to JSON
    function xmlToJson(xml) {

        // Create the return object
        let obj = {};

        if (xml.nodeType === 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                let item = xml.childNodes.item(i);
                let nodeName = item.nodeName;
                if (typeof(obj[nodeName]) === "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) === "undefined") {
                        let old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }

    return xmlToJson(responseXML);
}
let feedData = getFeed("https://www.youtube.com/feeds/videos.xml?channel_id=UCAd5rqXivI7UbJEzT64blMg");

// Get Latest episode data to display
let latestEntry = feedData.feed.entry[0];
let titleStr = latestEntry["title"]["#text"];
let vidEmbedStr = "https://www.youtube.com/embed/" + latestEntry["yt:videoId"]["#text"];

$(".js-vidTitle").html(titleStr);
$(".js-vidFrame").attr("src", vidEmbedStr);


