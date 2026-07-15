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
