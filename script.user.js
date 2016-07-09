// ==UserScript==
// @name         adorno
// @namespace    http://github.com/taropun
// @version      0.1
// @description  Highlight large galleries in search views
// @author       taropun
// @match        http://exhentai.org/
// @match        http://exhentai.org/?*
// @match        http://exhentai.org/tag/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function containsAny(haystack, needles) {
    return needles.some(function(needle) {
        return haystack.indexOf(needle) !== -1;
    });
}

function contains(haystack, needle) {
    return haystack.some(function(item) {
        return item === needle;
    });
}

function highlightLargeGalleries() {
    var green = 'rgba(27, 162, 43, 0.5)';
    var red = 'rgba(162, 27, 43, 0.5)';
    var ignoredTags = ['anthology'];
    var rows = $('.gtr0, .gtr1');

    if (rows.length > 0) {
        var galleries = [];
        rows.map(function(_, row){
            var galleryLink = $('.it5>a', row).attr('href');
            var galleryFragments = galleryLink.split('/');
            var galleryID = galleryFragments[4];
            var galleryToken = galleryFragments[5];
            galleries.push([galleryID, galleryToken]);
        });

        var apiRoot = 'http://g.e-hentai.org/api.php';
        var payload = JSON.stringify({
            'method': 'gdata',
            'gidlist': galleries,
            'namespace': 1});
        $.ajax({
            url: apiRoot,
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: payload,
            success: function(data) {
                var galleryMetadata = data['gmetadata'];
                galleryMetadata.forEach(function(metadatum, i){
                    var fileCount = parseInt(metadatum['filecount'], 10);
                    var tags = metadatum['tags'];
                    var row = rows.eq(i);
                    if (fileCount > 100 && !containsAny(tags, ignoredTags)) {
                        if (contains(tags, 'language:english')) {
                            $(row).css('background-color', green);
                        } else {
                            $(row).css('background-color', red);
                        }
                    }
                });
            }
        });
    }
}

highlightLargeGalleries();
