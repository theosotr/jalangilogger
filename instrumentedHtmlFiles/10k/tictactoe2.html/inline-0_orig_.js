
window.addEventListener("load", function() {
   var c = document.createElement("canvas");
  //  TAJS_dumpValue(c); // If you outcomment this, the type of c becomes HTMLCanvasElement.prototype.getContext
  if (c && c.getContext) {
   TAJS_dumpValue(c); // The type is HTMLCanvasElement, unless the line above is outcommented??
  }
}, false);
