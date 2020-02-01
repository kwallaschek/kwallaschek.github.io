// Get the modal
var btModal = document.getElementById("btModal");
// Get the button that opens the btModal
var btBtn = document.getElementById("btBtn");
// Get the <span> element that closes the btModal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the btModal 

// Get the modal
var bpModal = document.getElementById("bpModal");
// Get the button that opens the btModal
var bpBtn = document.getElementById("bpBtn");
// Get the <span> element that closes the btModal
var span2 = document.getElementsByClassName("close")[1];

// Get the modal
var plabModal = document.getElementById("plabModal");
// Get the button that opens the btModal
var plabBtn = document.getElementById("plabBtn");
// Get the <span> element that closes the btModal
var span3 = document.getElementsByClassName("close")[2];

// Get the modal
var erayModal = document.getElementById("erayModal");
// Get the button that opens the btModal
var erayBtn = document.getElementById("erayBtn");
// Get the <span> element that closes the btModal
var span4 = document.getElementsByClassName("close")[3];



btBtn.onclick = function() {
  btModal.style.display = "block";
}
bpBtn.onclick = function() {
  bpModal.style.display = "block";
}
plabBtn.onclick = function() {
  plabModal.style.display = "block";
}
erayBtn.onclick = function() {
  erayModal.style.display = "block";
}

// When the user clicks on <span> (x), close the btModal
span.onclick = function() {
  btModal.style.display = "none";
}
span2.onclick = function() {
  bpModal.style.display = "none";
}
span3.onclick = function() {
  plabModal.style.display = "none";
}
span4.onclick = function() {
  erayModal.style.display = "none";
}
// When the user clicks anywhere outside of the btModal, close it
window.onclick = function(event) {
  if (event.target == btModal) {
    btModal.style.display = "none";
  } else if (event.target == bpModal) {
    bpModal.style.display = "none";
  }else if (event.target == plabModal) {
    plabModal.style.display = "none";
  }else if (event.target == erayModal) {
    erayModal.style.display = "none";
  }
}