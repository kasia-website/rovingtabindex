class RovingTabindex {
    constructor(element, settings) {
        this.element = element;

        this.defaults = {
            first: ["Home"],
            last: ["End"],
            next: ["ArrowRight", "ArrowDown"],
            previous: ["ArrowLeft", "ArrowUp"],
            character: true,
            wrap: true,
            childrenSelector: ':scope > *',
            findActive: (item) => item.getAttribute('tabindex') === '0'
        };

        this.options = {
            ...this.defaults,
            ...settings
        };

        this.element.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.element.dispatchEvent(new CustomEvent('rovingtabindexinitialized', {details: {bubbles: true}}));
    }

    destroy() {
        this.element.removeEventListener('keydown', this.handleKeyDown.bind(this));

        this.element.dispatchEvent(new CustomEvent('rovingtabindexdestroyed', {details: {bubbles: true}}));
    }

    handleKeyDown(event) {
        if (this.focusableDirectChildren().length === 0) {
            return;
        }

        let current = this.getActiveChild();
        let next = current;

        if (this.options.first.length > 0 &&  this.options.first.indexOf(event.key) >  -1) {
            event.preventDefault();
            next = this.firstFocusableChild();
        } else if (this.options.last.length > 0 &&  this.options.last.indexOf(event.key) >  -1) {
            event.preventDefault();
            next = this.lastFocusableChild();
        } else if (this.options.previous.length > 0 &&  this.options.previous.indexOf(event.key) >  -1) {
            event.preventDefault();
            next = this.getPreviousFocusableChild(current);
        } else if (this.options.next.length > 0 &&  this.options.next.indexOf(event.key) >  -1) {
            event.preventDefault();
            next = this.getNextFocusableChild(current);
        } else if (this.options.character) {
            next = this.focusableDirectChildren().find(function(item) {
                return item.textContent.toLowerCase().charAt(0) === event.key
            });
        }

        if (next && next !== current) {
            this.element.dispatchEvent(
                new CustomEvent(
                    'movefocus',
                    {
                        detail: {
                            bubbles: true,
                            from: current,
                            to: next
                        }
                    }
                )
            )
        }
    }

    firstFocusableChild() {
        if (this.focusableDirectChildren().length > 0) {
            return this.focusableDirectChildren()[0];
        }
    }

    getNextFocusableChild(item) {
        let index = this.focusableDirectChildren().indexOf(item);

        if (index < 0) {
            return this.getActiveChild();
        }

        if (index === this.focusableDirectChildren().length - 1) {
            if (this.options.wrap) {
                return this.firstFocusableChild();
            } else {
                return item;
            }
        }

        return this.focusableDirectChildren()[index + 1];
    }

    getPreviousFocusableChild(item) {
        let index = this.focusableDirectChildren().indexOf(item);

        if (index < 0) {
            return this.getActiveChild();
        }

        if (index === 0) {
            if (this.options.wrap) {
                return this.lastFocusableChild();
            } else {
                return item;
            }
        }

        return this.focusableDirectChildren()[index - 1];
    }

    lastFocusableChild() {
        if (this.focusableDirectChildren().length > 0) {
            return this.focusableDirectChildren()[this.focusableDirectChildren().length - 1];
        }
    }

    focusableDirectChildren() {
        return Array.from(this.element.querySelectorAll(this.options.childrenSelector));
    }

    getActiveChild() {
        let item = this.focusableDirectChildren().find(this.options.findActive);

        if (!item) {
            return this.firstFocusableChild;
        }

        return item;
    }

}