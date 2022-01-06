const BUTTONS_STYLESHEET = new CSSStyleSheet();

BUTTONS_STYLESHEET.replaceSync(`
    :host {
        --bg-color: #B7B7BA;
        --bg-hover-color: #97979B;
    }

    .btn {
        font-size: var(--font-size);
        font-weight: 600;
        min-height: 34px;
        padding: 0 30px;
        background-color: var(--bg-color);
        border: 1px solid var(--bg-color);
        border-radius: 3px;
        color: #47474C;
        cursor: pointer;
        transition: background-color 300ms ease-out;
    }

    .btn:hover {
        background-color: var(--bg-hover-color);
        border: 1px solid var(--bg-hover-color);
    }
`);

class CustomButton extends HTMLElement {
    constructor() {
        super();
    }

    template() {
        return `<button class="btn" part="btn"><slot></slot></button>`;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets  = [BUTTONS_STYLESHEET];
        this.shadowRoot.innerHTML = this.template();
    }
}

customElements.define('custom-button', CustomButton); 