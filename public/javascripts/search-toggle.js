$(document).ready(function () {
  console.log('yes')
  var toggleTarget = $('.js-class-toggle');

  if(!inputIsEmpty()) {
    addFocusClass();
  }

  toggleTarget.on('focus', addFocusClass);
  toggleTarget.on('blur', removeFocusClassFromEmptyInput);

  function inputIsEmpty() {
    return toggleTarget.val() === '';
  }

  function addFocusClass() {
    toggleTarget.addClass('focus');
  }

  function removeFocusClassFromEmptyInput() {
    if(inputIsEmpty()) {
      toggleTarget.removeClass('focus');
    }
  }
})