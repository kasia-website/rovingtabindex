//Example 1

const radiogroup = document.getElementById('radio-group-widget');

new RovingTabindex(radiogroup);

radiogroup.addEventListener('movefocus', (event) => {
    event.detail.to.click()
});

radiogroup.addEventListener('keydown', (event) => {
    if (event.target.matches('[role="radio"]') && event.key === " ") {
        event.preventDefault(); //do not scroll down
        event.target.click();
    }
});

radiogroup.addEventListener('click', (event) => {
   if (event.target.matches('[role="radio"][tabindex="-1"]')) {
       let from = radiogroup.querySelector('[tabindex="0"]');
       let to = event.target;

       //uncheck previously checked item
       from.setAttribute('tabindex', '-1');
       from.setAttribute('aria-checked', 'false');

       //check new item
       to.setAttribute('tabindex', '0');
       to.setAttribute('aria-checked', 'true');
       to.focus();
   }
});

//Example 2

const toolbar = document.getElementById('toolbar-widget');

new RovingTabindex(toolbar, {
    next: ['ArrowRight'],
    previous: ['ArrowLeft'],
    childrenSelector: 'button'
});

const manageFocus = (from,to) => {
    from.setAttribute('tabindex', '-1');
    to.setAttribute('tabindex', '0');
    to.focus();
};

toolbar.addEventListener('movefocus', (event) => {
    manageFocus(event.detail.from, event.detail.to)
});

toolbar.addEventListener('click', (event) => {
    if (event.target.matches('[tabindex="-1"]')) {
        let from = toolbar.querySelector('[tabindex="0"]');
        let to = event.target;

        manageFocus(from, to);
    }
});