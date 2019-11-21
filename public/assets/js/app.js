// dice button makes the page reload
$('#reroll').on('click', ()=>{
  location.reload()
});


// slider feature made in jquery with
$(document).ready( ()=>{
  let outputSpan = $('#spanOutput');
  let sliderElement = $('#slider')
  sliderElement.slider({
    range : true,
    min: 1,
    max: 10,
    values:[1,10],
    slide: function(event, ui){
      outputSpan.html(ui.values[0] + ' - ' + ui.values[1])
      $('#txtMinScore').val(ui.values[0]);
      $('#txtMaxScore').val(ui.values[1]);
    }

  })
  outputSpan.html(sliderElement.slider('values', 0) + ' - ' + sliderElement.slider('values', 1))
  $('#txtMinScore').val(sliderElement.slider('values', 0));
  $('#txtMaxScore').val(sliderElement.slider('values', 1));
})
