// Get the modal
var btModal = document.getElementById("btModal");
// Get the button that opens the btModal
var btBtn = document.getElementById("btBtn");
// Get the <span> element that closes the btModal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the btModal 

var bpModal = document.getElementById("bpModal");
var bpBtn = document.getElementById("bpBtn");
var span2 = document.getElementsByClassName("close")[1];

var plabModal = document.getElementById("plabModal");
var plabBtn = document.getElementById("plabBtn");
var span3 = document.getElementsByClassName("close")[2];

var erayModal = document.getElementById("erayModal");
var erayBtn = document.getElementById("erayBtn");
var span4 = document.getElementsByClassName("close")[3];

var mtModal = document.getElementById("mtModal");
var mtBtn = document.getElementById("mtBtn");
var span5 = document.getElementsByClassName("close")[4];

var mtModal = document.getElementById("noteplanModal");
var mtBtn = document.getElementById("noteplanBtn");
var span6 = document.getElementsByClassName("close")[4];


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
mtBtn.onclick = function() {
  mtModal.style.display = "block";
}
noteplanBtn.onclick = function() {
  noteplanModal.style.display = "block";
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
span5.onclick = function() {
  mtModal.style.display = "none";
}
span6.onclick = function() {
  noteplanModal.style.display = "none";
}
// When the user clicks anywhere outside of the btModal, close it
window.onclick = function(event) {
  if (event.target == btModal) {
    btModal.style.display = "none";
  } else if (event.target == mtModal) {
    mtModal.style.display = "none";
  } else if (event.target == bpModal) {
    bpModal.style.display = "none";
  }else if (event.target == plabModal) {
    plabModal.style.display = "none";
  }else if (event.target == erayModal) {
    erayModal.style.display = "none";
  }else if (event.target == noteplanModal) {
    noteplanModal.style.display = "none";
  }
}