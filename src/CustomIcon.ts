class CustomIconElement extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    private render() {
        const text = this.getAttribute('text') || 'Hz';

        const size = this.getAttribute('size') || '300';

        const radius = this.getAttribute('radius');
        const radiusStyle = radius ? `border-radius: ${radius};` : '';

        const topRightColor = this.getAttribute('top-right-color') || 'rgb(103, 154, 209)';
        const topLeftColor = this.getAttribute('top-left-color') || 'rgb(50, 100, 160)';
        const bottomLeftColor = this.getAttribute('bottom-left-color') || 'rgb(143, 132, 213)';
        const bottomRightColor = this.getAttribute('bottom-right-color') || 'rgb(150, 197, 219)';

        const dropShadowColor = this.getAttribute('shadow-color') || 'rgb(40, 80, 130)';

        const uid = (Math.random() + 1).toString(36).substring(7);

        const bgGradientId = `bgGradient-${uid}`;
        const highlightId = `highlight-${uid}`;
        const textGradientId = `textGradient-${uid}`;
        const dropShadowId = `dropShadow-${uid}`;

        this.innerHTML = `
            <svg class="custom-icon" style="${radiusStyle}" width="${size}" height="${size}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            	<defs>
            		<linearGradient id="${bgGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
            			<stop offset="0%" stop-color="${topRightColor}" />
            			<stop offset="100%" stop-color="${bottomLeftColor}" />
            		</linearGradient>

            		<linearGradient id="${textGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
            			<stop offset="0%" stop-color="${bottomRightColor}" />
            			<stop offset="100%" stop-color="${topLeftColor}" />
            		</linearGradient>

            		<linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            			<stop offset="0%" stop-color="white" stop-opacity="0" />
            			<stop offset="100%" stop-color="white" stop-opacity="0.4" />
            		</linearGradient>

            		<filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            			<feDropShadow dx="5" dy="5" stdDeviation="5" flood-color="rgba(0,0,0,0.5)" />
            		</filter>
            	</defs>

            	<g>
            		<rect x="0" y="0" width="300" height="300" fill="url(#${bgGradientId})" />
            		<rect x="0" y="0" width="300" height="300" fill="url(#${highlightId})" />
            	</g>

            	<text x="155" y="170" text-anchor="middle" dominant-baseline="middle"
            		  font-size="180"
            		  fill="${dropShadowColor}" opacity="1.0">
            		${text}
            	</text>

            	<text x="150" y="165" text-anchor="middle" dominant-baseline="middle"
            		  font-size="180"
            		  fill="url(#${textGradientId})" filter="url(#${dropShadowId})"
            		  stroke="rgba(255,255,255,0.3)" stroke-width="1">
            		${text}
            	</text>
            </svg>
        `;
    }
}

customElements.define('custom-icon', CustomIconElement);
