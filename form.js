window.addEventListener("load", function() {
  const form = document.getElementById('emailform');
  const form2 = document.getElementById('emailform2');
  form.addEventListener("submit", function(e) {
    document.getElementById('notifyme').innerHTML = "<div class='loader'></div>";
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    fetch(action, {
      method: 'POST',
      body: data,
    })
    .then(() => {
        document.getElementById('notifyme').innerHTML = "DONE ✓"
        setTimeout(function(){ 
          document.getElementById('notifyme').innerHTML = "NOTIFY ME"
        }, 3000);
    })
  });
  form2.addEventListener("submit", function(e) {
    document.getElementById('notifyme2').innerHTML = "<div class='loader'></div>";
    e.preventDefault();
    const data = new FormData(form2);
    const action = e.target.action;
    fetch(action, {
      method: 'POST',
      body: data,
    })
    .then(() => {
        document.getElementById('notifyme2').innerHTML = "DONE ✓"
        setTimeout(function(){ 
          document.getElementById('notifyme2').innerHTML = "NOTIFY ME"
        }, 3000);
    })
  });
});