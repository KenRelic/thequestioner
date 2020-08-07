//MENU BAR 
let menuBarIcon = document.getElementById('menu-icon');
let menu = document.getElementById('menu-bar');
let menuExpandBtn = document.getElementById('expand-menu');
let menuFeatureTitles = document.querySelectorAll('#menu-items-section span');
let toggleMenuWidthBtn = document.querySelector('#expand-menu i');
let userWrapper = document.querySelector('.user-intro-wrapper');
let userImg = document.querySelector('.user-img');
let userName = document.querySelector('.user-name');
let notificationWrapper = document.querySelector('.notification-wrapper');
let userProfession = document.querySelector('.user-profession');
menuFeatureTitles = Array.from(menuFeatureTitles);

menuBarIcon.addEventListener('click', toggleMenuBar);
toggleMenuWidthBtn.addEventListener('click', toggleMenuBarWidth)

let menuIconTrail = document.querySelector('.menu-icon-trail-bar');

function toggleMenuBar() {
  switch (this.classList.contains('ml-0')) {
    case true:
      this.classList.replace('ml-0', 'ml-19');
      menuIconTrail.classList.replace('block', 'hide');
      menu.classList.replace('hide', 'flex');
      break;
    case false:
      if (this.classList.contains('ml-200')) {
        this.classList.replace('ml-200', 'ml-0')
        menuBarIcon.style.backgroundColor = '#6d1180';
        toggleMenuWidthBtn.classList.replace('fa-angle-double-left', 'fa-angle-double-right');
        setTimeout(() => menu.classList.replace('expanded', 'folded'), 150);
        menuFeatureTitles.forEach(title => title.classList.replace('show', 'hide'))
      } else {
        this.classList.replace('ml-19', 'ml-0');
        menuBarIcon.style.backgroundColor = '#6d1180';
      }
      // style user warapper area
      setTimeout(()=>{
        resetUserWrapperArea();
        menuIconTrail.classList.replace('hide', 'block');
        menu.classList.replace('flex', 'hide');
      },150) ;
      break;
    default:
      this.classList.replace('ml-0', 'ml-19');
      menuIconTrail.classList.replace('block', 'hide');
      setTimeout(() =>{
        menu.classList.replace('hide', 'flex');
        resetUserWrapperArea();
      }, 150)
      break;
  }
}

// MENU NAR SECOND LEVEL

function toggleMenuBarWidth() {
  switch (menu.classList.contains('expanded')) {
    case true:
      menu.classList.replace('expanded', 'folded');
      menuBarIcon.style.backgroundColor = '#6d1180';
      menuFeatureTitles.forEach(title => title.classList.replace('show', 'hide'))
      this.classList.replace('fa-angle-double-left', 'fa-angle-double-right');
      menuBarIcon.classList.replace('ml-200', 'ml-19');

      // style user warapper area
      setTimeout(()=>resetUserWrapperArea(),70) ;
      break;
    case false:
      menu.classList.replace('folded', 'expanded');
      menuBarIcon.style.backgroundColor = '#99198b';
      setTimeout(() => menuFeatureTitles.forEach(title => title.classList.replace('hide', 'show')), 200)
      this.classList.replace('fa-angle-double-right', 'fa-angle-double-left');
      menuBarIcon.classList.replace('ml-19', 'ml-200');

      // style user wrapper area
      userWrapper.style.padding = '3.5em 1em 1em 1em';
      userImg.style.margin = '0';
      setTimeout(() => {
        userName.style = 'display:block; margin-bottom:-1.5em';
        notificationWrapper.style = 'display:flex;justify-content:space-between;align-items:center;padding-left:0';
        userProfession.style = 'display:inline;font-size:0.9em';
      }, 150);
      break;
    default:
      menu.classList.replace('expanded', 'folded');
      menuBarIcon.style.backgroundColor = '#6d1180';
      menuFeatureTitles.forEach(title => title.classList.replace('show', 'hide'));
      this.classList.replace('fa-angle-double-left', 'fa-angle-double-right');
      menuBarIcon.classList.replace('ml-200', 'ml-19');
      // style user warapper area
      setTimeout(() => resetUserWrapperArea(),70);
      break;
  }
}

function resetUserWrapperArea() {
  // style user warapper area
  userWrapper.style.padding = '3.5em 0 1em 0';
  userImg.style.margin = '0 auto';
  // userImg.style.marginTop = '3.5em';
  userName.style = 'display:none; margin-bottom:-1.5em';
  notificationWrapper.style = 'display:flex;justify-content:center;padding-left:1em';
  userProfession.style = 'display:none';
}
function resetUserWrapperAreaDesktop() {
  // style user warapper area
  userWrapper.style.padding = '2em 1em 1em 1em';
  userImg.style.margin = '0';
  // userImg.style.marginTop = '3.5em';
  userName.style = 'display:block; margin-bottom:-1.5em';
  notificationWrapper.style = 'display:flex;justify-content:space-between;padding-left:0';
  userProfession.style = 'display:inline; font-size:0.9em;';
}


  // show more settings on click of settings
  const settingsBtn = document.getElementById('settings-btn')
  const moreSettings = document.querySelectorAll('.more-setting');
  settingsBtn.addEventListener('click', () => {

    switch (moreSettings[0].classList.contains('show')) {
      case true:
        moreSettings.forEach(btn => btn.classList.replace('show', 'hide'))
        break;
      case false:
        moreSettings.forEach(btn => btn.classList.replace('hide', 'show'))
        break;
      default:
        moreSettings.forEach(btn => btn.classList.replace('show', 'hide'));
        break;
    }
  })

  let replyToggles = document.querySelectorAll('.toggle-replies');
  let replySections = document.querySelectorAll('.user-response-section');
  let numOfVotesElem = document.querySelectorAll('.num-of-votes');
  replyToggles = Array.from(replyToggles);
  replySections = Array.from(replySections);
  numOfVotesElem = Array.from(numOfVotesElem);

  numOfVotesElem.forEach(elem => {
    if (+elem.innerText >= 1) {
      elem.style.color = "green";
    } else if (+elem.innerText === 0) {
      elem.style.color = 'initial';
    } else {
      elem.style.color = 'red';
    }
  })
  replyToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      switch (replySections[replyToggles.indexOf(toggle)].classList.contains('open')) {
        case true:
          replySections[replyToggles.indexOf(toggle)].classList.replace('open', 'close')
          break;
        case false:
          replySections[replyToggles.indexOf(toggle)].classList.replace('close', 'open')
          break;
        default:
          replySections[replyToggles.indexOf(toggle)].classList.replace('open', 'close')
          break;
      }
    })
  })

  window.onresize = function(e){
    if(window.innerWidth > 799)  return resetUserWrapperAreaDesktop();
    if(menu.classList.contains('expanded')) return resetUserWrapperAreaDesktop()
    return resetUserWrapperArea(); 
  }