const DIALOG_STYLSHEET = new CSSStyleSheet();
DIALOG_STYLSHEET.replaceSync(`
    .overlay {
        opacity: 0;
        transition: opacity 300ms ease;
    }

    .overlay:not(.open) {
        visibility: hidden;
    }

    .overlay.open {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: black;
        opacity: .7;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .message {
        transition: transform 300ms ease;
        transform: scale(0);
    }

    .overlay.open .message {
        max-width: 400px;
        background-color: white;
        margin: 0 auto;
        border-radius: 3px;
        transform: scale(1);
    }

    .header {
        font-size: 1.6em;
        padding: 16px 16px 0 16px;
    }

    .content {
        padding: 16px;
    }

    custom-button::part(btn) {
        width: 100%;
        background-color: white;
        color: #0054B1;
    }
`);


class CustomMessageDialog extends HTMLElement {
    constructor() {
        super();
        this.close = this.close.bind(this);
    }
    
    get action() {
        return this.getAttribute('action') || 'Close';
    }

    get open() {
        return this.hasAttribute('open');
    }

    set open(open) {
        if (open) {
            document.addEventListener('keyup', this.close);
            this.setAttribute('open', '')
            this.shadowRoot.querySelector('.overlay').classList.toggle('open', true);
        }
        else {
            document.removeEventListener('keyup', this.close);
            this.removeAttribute('open');
            this.shadowRoot.querySelector('.overlay').classList.toggle('open', false);
        }
    }

    template() {
        return `<div class="overlay">
            <div class="wrapper">
                <div class="message">
                    <div class="header"><slot name="header"></slot></div>
                    <div class="content"><slot name="content"></div>
                    <custom-button class="action-btn">${ this.action }</custom-button>
                </div>
            </div>
        </div>`;
    }

    close(evt) {
        if (evt.key && evt.key !== 'Escape') {
            return;
        }

        this.open = false;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [DIALOG_STYLSHEET];
        this.shadowRoot.innerHTML = this.template();
        this.shadowRoot.querySelector('.action-btn').addEventListener('click', this.close);

        this.open = this.open;
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('.action-btn').removeEventListener('click', this.close);
        document.removeEventListener('keyup', this.close);
    }
}

window.customElements.define('custom-message-dialog', CustomMessageDialog);