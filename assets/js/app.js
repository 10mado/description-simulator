$(function() {
  'use strict';

  $('#title').on('keyup', function(e) {
    $('.area-google-pc__title').html($('#title').val());
    $('.area-google-mobile__title').html($('#title').val());
  });
  $('#url').on('keyup', function(e) {
    $('.area-google-pc__url').html($('#url').val());
    $('.area-google-mobile__url').html($('#url').val());
  });
  $('#description').on('keyup', function(e) {
    var pcDescription = $('#description').val();
    if (pcDescription.length > 126) {
      pcDescription = pcDescription.substring(0, 125) + ' …';
    }
    $('.area-google-pc__description').html(pcDescription);
    var mobileDescription = $('#description').val();
    if (mobileDescription.length > 68) {
      mobileDescription = mobileDescription.substring(0, 67) + ' …';
    }
    $('.area-google-mobile__description').html(mobileDescription);
  });
});

(function() {
  $('.area-google-pc__title').html($('#title').val());
  $('.area-google-mobile__title').html($('#title').val());
  $('.area-google-pc__url').html($('#url').val());
  $('.area-google-mobile__url').html($('#url').val());
})();
