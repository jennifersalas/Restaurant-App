function initServiceWorker() {
  if(!navigator.serviceWorker) return;

  notify = (worker) => {
    // Notify the user that there is an update through the UI
    console.log(`update ready`);
    console.log(worker);

    alert = document.createElement(`div`);
    alert.classList.add(`update-alert`);
    notice = document.createElement(`p`);
    notice.innerHTML = "There is a new update available!"
    refresh = document.createElement(`button`);
    refresh.innerHTML = "Refresh";
    cancel = document.createElement(`button`);
    cancel.innerHTML = "Cancel"

    refresh.addEventListener(`click`, _ => {
      console.log(worker);
      worker.postMessage({action: `skipWaiting`});
      location.reload();
    })

    alert.append(notice, refresh, cancel);
    let page = document.querySelector(`#maincontent`);
    page.insertBefore(alert, page.firstChild);
  };

  track_installing = (worker) => {
    worker.addEventListener(`statechange`, _ => {
      if (worker.state == `installed`) notify(worker);
    });
  };

  navigator.serviceWorker.register(`${path}/sw.js`, {scope: `${path}/`})
    .then( reg => {
      if(!navigator.serviceWorker.controller) return;
      if (reg.waiting) notify(reg.waiting);
      if (reg.installing) {
        track_installing(reg.installing);
        return;
      }
      reg.addEventListener(`updatefound`, _ => track_installing(reg.installing));
    })
    .catch(error => {
      console.log("service worker failed to register");
      console.log(`${path}/sw.js`)
      console.log(window.location.pathname);
      console.log(error);
    });

    navigator.serviceWorker.addEventListener(`controllerchange`, _ => window.location.reload() )
}


initServiceWorker();
////
