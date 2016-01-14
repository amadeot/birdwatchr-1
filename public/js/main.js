console.log("         _     ")
console.log("        <')_,/ ")
console.log("        (_==/  ")
console.log("birder  ='-    ")
console.log("we're hiring!  ")


var showBirds = function(){
  $.ajax({
    url: '/sightings',
    type: 'get',
    dataType: 'json'
  }).done(function(results){
    results.forEach(function(result){
      var source = $('#latest-birds-template').html();
      var template = Handlebars.compile(source)
      var html = template(result);
      $('body').append(html)      
    })
  })
}

$(document).ready(function(){
  showBirds()
})