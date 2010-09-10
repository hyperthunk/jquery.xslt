$(function(){
  example = $('#matcher-example')
  $('.matchers li').click(function(){
    example.fadeOut('fast')
    $.get('matchers/' + $(this).text(), function(response){
      example.text(response).fadeIn('fast')
    })
  });
})