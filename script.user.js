// ==UserScript==
// @name         adorno
// @namespace    http://github.com/taropun
// @version      0.1
// @description  Highlight large galleries in search views
// @author       taropun
// @match        http://exhentai.org/
// @match        http://exhentai.org/?*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function highlightLargeGalleries() {
    var hl = 'rgba(27, 43, 162, 0.5)';
    var rows = $('.gtr0, .gtr1');

    if (rows.length > 0) {
        console.log('Gallery search results found');
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
                galleryMetadata = data['gmetadata'];
                galleryMetadata.forEach(function(metadatum, i){
                    var fileCount = parseInt(metadatum['filecount'], 10);
                    if (fileCount > 100) {
                        var row = rows.eq(i);
                        $(row).css('background-color', hl);
                    }
                });
            }
        });
    } else {
        console.log('No gallery search results found');
    }
}

highlightLargeGalleries();
