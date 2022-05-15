// IIF to be injected
(function() {
window.addEventListener('message', function(e,a,x) {
  console.log(
      e.data
  );
  var error = {
      // stack: e.error.stack
      // Add here any other properties you need, like e.filename, etc...
  };
  // document.dispatchEvent(new CustomEvent('ReportError', {detail:error}));
});
window.addEventListener('unhandledrejection', function(e,a,x) {
  console.log(
      "unhandledrejection", e.data
  );
  var error = {
      // stack: e.error.stack
      // Add here any other properties you need, like e.filename, etc...
  };
  document.dispatchEvent(new CustomEvent('ReportError', {detail:error}));
});
// window.addEventListener('error', function(e,a,x) {
//   // console.log(
//   //     "error", e
//   // );
//   // var error = {
//   //     // stack: e.error.stack
//   //     // Add here any other properties you need, like e.filename, etc...
//   // };
//   // document.dispatchEvent(new CustomEvent('ReportError', {detail:error}));
//   console.log("Dispatching event....")
//   if(e.filename) {
//     document.dispatchEvent(new CustomEvent('ErrorToExtension', {
//       detail: {
//         stack: e.error ? e.error.stack : null,
//         url: e.filename,
//         line: e.lineno,
//         col: e.colno,
//         text: e.message
//       }
//     }));
//   }
// });


window.addEventListener('error', function(e) {
  console.log("Dispatching event....")
  if(e.filename) {
    document.dispatchEvent(new CustomEvent('ErrorToExtension', {
      detail: {
        stack: e.error ? e.error.stack : null,
        url: e.filename,
        line: e.lineno,
        col: e.colno,
        text: e.message
      }
    }));
  }
});
}())