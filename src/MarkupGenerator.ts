export class MarkupGenerator {
    public static requestFileDialog(targetElement: HTMLElement): void {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.hz';
        fileInput.style.display = 'none';
        fileInput.onchange = (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    targetElement.innerHTML = this.generateMarkup(content);
                };
                reader.readAsText(files[0]);
            }
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    public static generateMarkup(sourceCode: string, symbolDatabase: SymbolDatabase): string {
        // I will handle this


        const markup = sourceCode;

        return this.formatMarkup(markup);
    }

    private static formatMarkup(sourceMarkup: string): string {
        return `
            <code>
                <pre class="shadowed">${this.escapeHtml(sourceMarkup)}</pre>
            </code>
        `;
    }

    private static escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/<=/g, '&le;')
            .replace(/>/g, '&gt;')
            .replace(/>=/g, '&ge;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}