function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: 'zh-CN',
            includedLanguages: 'zh-CN,en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
    );
}


document.addEventListener("DOMContentLoaded", function () {

    if (!document.getElementById("google_translate_element")) {

        var div = document.createElement("div");
        div.id = "google_translate_element";
        document.body.appendChild(div);

    }

});
