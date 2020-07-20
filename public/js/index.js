window.onload = function () {
  let counter = document.getElementById('counter');
  let time = 10;

  let timer = setInterval(() => {
    if (time == -1) {
      return document.forms['goto-login'].submit();
    }
    counter.innerHTML = time + 's';
    time -= 1;
  }, 1000)
  setTimeout(() => { window.clearInterval(timer) }, 10000);
}