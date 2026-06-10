<script lang="ts">
	import srdData from './srd-metadata.json';
    import SRDEntry from './SRDEntry.svelte';

	let isMenuOpen = $state(false);

	const navLinks = [
		{ name: 'Projects', href: '/projects' },
		{ name: 'Documentation', href: '/docs' },
		{ name: 'Architecture', href: '/architecture' },
		{ name: 'Resources', href: '/resources' }
	];

	const features = [
		{
			title: 'Unified Intelligence',
			description: 'Seamlessly bridge the gap between raw source code and semantic understanding with our advanced analysis engine.',
			icon: 'Brain'
		},
		{
			title: 'Real-time Visualization',
			description: 'Watch your code transform through AST, IR, and Machine Code stages with interactive, low-latency updates.',
			icon: 'Eye'
		},
		{
			title: 'Multi-Repo Orchestration',
			description: 'View and manage multiple repositories within a single, cohesive dashboard designed for complex architectures.',
			icon: 'Git'
		}
	];

	const resources = [
		{ label: 'API Reference', href: '#' },
		{ label: 'Community Discord', href: '#' },
		{ label: 'GitHub Repository', href: '#' },
		{ label: 'Technical Whitepaper', href: '#' }
	];
</script>

<svelte:head>
	<title>Zenith | Documentation & Project Viewer</title>
	<meta name="description" content="Zenith: The centralized platform for viewing and documenting complex code architectures." />
</svelte:head>

<div class="layout-wrapper">
	<header class="navbar">
		<div class="nav-container">
			<a href="/" class="logo-text">
				<span class="accent-text">Zenith</span>
			</a>

			<nav class="desktop-nav">
				{#each navLinks as link}
					<a href={link.href} class="nav-item">{link.name}</a>
				{/each}
			</nav>

			<button 
				class="mobile-toggle" 
				onclick={() => (isMenuOpen = !isMenuOpen)}
				aria-label="Toggle Menu"
			>
				<div class="hamburger" class:open={isMenuOpen}></div>
			</button>

			{#if isMenuOpen}
				<div class="mobile-menu">
					{#each navLinks as link}
						<a href={link.href} class="mobile-nav-item" onclick={() => (isMenuOpen = false)}>
							{link.name}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</header>

	<main class="content">
		<section class="hero">
			<div class="hero-content">
				<h1 class="gradient-text">Haze Zenith</h1>
				<h2 style="color: var(--operator)"><span class="keyword">template</span>&lt;<span class="keyword">typename</span>... <span class="template-parameter">Rs</span>&gt; <span class="keyword">struct</span> <span class="class-type-templated">Zenith</span> : <span class="class-type-templated">Requirement</span>&lt;<span class="template-parameter">Rs</span>&gt;... &lbrace;&rbrace;;</h2>
				<p class="subtitle">
					A centralized documentation and architectural visualization platform designed for developers working across massive, multi-repository ecosystems.
				</p>
				<div class="hero-actions">
					<a href="/explore" class="card interactive btn-primary">Get Started</a>
					<a href="/docs" class="card interactive btn-secondary">Read Docs</a>
				</div>
			</div>
		</section>

		<div class="header">
			<h1>SRD Repository</h1>
			<h2><span class="keyword">concept</span> <span class="class-type-templated">IsSRD</span> <span class="operator">=</span> <span class="namespace">hz</span><span class="operator">&lt;</span><span class="local-variable">T</span><span class="operator">&gt;</span></h2>
		</div>

		<div class="srd-grid">
			{#each srdData as srd}
				<SRDEntry {srd} />
			{/each}
		</div>

		<section class="diagram-section">
			<div class="zenith-system-container">
				<div class="zenith-header">ZENITH</div>
				
				<div class="subsystem-layout">
					<div class="subsystem-box shadowed">
						<div class="architecture-header">
							<span class="architecture-title">TARGET</span>
						</div>
						<div class="layer-stack">
							<div class="layer prism shadowed interactive">
								<div class="layer-content">
									<span class="layer-label">PRISM</span>
									<span class="layer-subtext">Minimal HTML5/CSS3/ECMAScript16 Browser</span>
								</div>
							</div>
							<div class="layer stratus shadowed interactive">
								<div class="layer-content">
									<span class="layer-label">STRATUS</span>
									<span class="layer-subtext">Preemptive Multitasking Operating System</span>
								</div>
							</div>
							<div class="layer horizon shadowed interactive">
								<div class="layer-content">
									<span class="layer-label">HORIZON</span>
									<span class="layer-subtext">Multithreaded Pipelined RISC-V Processor</span>
								</div>
							</div>
						</div>
					</div>
					<div class="subsystem-box shadowed">
						<div class="architecture-header">
							<span class="architecture-title">HOST</span>
						</div>
						<div class="layer-stack">
							<div class="layer clarity shadowed interactive">
								<div class="layer-content">
									<span class="layer-label">CLARITY</span>
									<span class="layer-subtext">LSP-Compliant Web IDE</span>
								</div>
							</div>
							<div class="layer mist shadowed interactive">
								<div class="layer-content">
									<span class="layer-label">MIST</span>
									<span class="layer-subtext">DAP-Compliant x86 Debugger</span>
								</div>
							</div>
							<div class="layer haze shadowed interactive">
								<div class="layer-content">
									<span class="layer-label">HAZE</span>
									<span class="layer-subtext">x86/RISC-V Optimizing Compiler</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="features-grid">
			{#each features as feature}
				<div class="card shadowed hoverable interactive">
					<div class="feature-icon">{feature.icon}</div>
					<h3 class="card-title">{feature.title}</h3>
					<p class="card-description">{feature.description}</p>
				</div>
			{/each}
		</section>

		<section class="resources-section">
			<div class="section-header">
				<h2 class="card-title" style="font-size: 2rem;">Developer Resources</h2>
				<p class="card-description">Everything you need to master the Zenith ecosystem.</p>
			</div>
			<div class="resources-grid">
				{#each resources as resource}
					<a href={resource.href} class="resource-card shadowed hoverable">
						<span>{resource.label}</span>
						<span class="arrow">→</span>
					</a>
				{/each}
			</div>
		</section>
	</main>

	<footer class="footer-minimal">
		<div class="footer-content">
			<p>&copy; 2026 Zenith Platform. Built with high-performance architecture.</p>
		</div>
	</footer>
</div>

<style>
	.layout-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.gradient-text {
		background-image: 
			linear-gradient(
				45deg, 
				transparent 40%, 
				rgba(255, 255, 255, 0.15) 50%, 
				transparent 60%
			),
			linear-gradient(to top, var(--accent), var(--secondary));
		background-size: 200px 100%, 100% 100%;
		background-repeat: no-repeat;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: shimmer 4s infinite linear;
	}

	@keyframes shimmer {
		from {
			background-position: -200px 0, 0 0;
		}
		to {
			background-position: calc(100% + 200px) 0, 0 0;
		}
	}


	.container {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        padding: 2rem 1rem;
        width: 100%;
        max-width: calc(var(--content-width) * 1.5);
        margin: auto;
    }

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .header h1 {
        font-size: 4rem;
        background: linear-gradient(0deg, var(--accent), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
        filter: drop-shadow(0 0 1rem #0008);
    }

    .srd-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        width: 100%;
    }

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rem;
		padding: 2rem 1rem;
	}

	.navbar {
		position: sticky;
		top: 0;
		z-index: 1000;
		background: rgba(30, 30, 30, 0.8);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--dark-background-l);
	}

	.nav-container {
		max-width: min(1200px, 100%);
		margin: 0 auto;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.5rem;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 900;
		letter-spacing: -1px;
		text-decoration: none;
	}

	.accent-text {
		color: var(--accent);
	}

	.desktop-nav {
		display: flex;
		gap: 2rem;
	}

	.nav-item {
		color: var(--dark-foreground-l);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.nav-item:hover {
		color: var(--secondary);
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
	}

	.hamburger, .hamburger::before, .hamburger::after {
		content: '';
		display: block;
		width: 24px;
		height: 2px;
		background: var(--dark-foreground);
		transition: all 0.3s ease;
	}

	.hamburger::before, .hamburger::after {
		width: 24px;
	}

	.hamburger.open {
		background: transparent;
	}

	.hamburger.open::before {
		transform: translateY(8px) rotate(45deg);
	}

	.hamburger.open::after {
		transform: translateY(-8px) rotate(-45deg);
	}

	.mobile-menu {
		position: absolute;
		top: 4rem;
		left: 0;
		width: 100%;
		background: var(--dark-background-e);
		border-bottom: 1px solid var(--dark-background-ll);
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
	}

	.mobile-nav-item {
		padding: 1rem 2rem;
		color: var(--dark-foreground-l);
		text-decoration: none;
	}

	@media (max-width: 768px) {
		.desktop-nav { display: none; }
		.mobile-toggle { display: block; }
		.hero h1 { font-size: 3rem !important; }
	}

	.hero {
		padding: 4rem 0;
		text-align: center;
	}

	.hero-content {
		max-width: 70rem;
		margin: 0 auto;
	}

	.hero h1 {
		font-size: 5rem;
		margin: 0;
		line-height: 1;
	}

    	.diagram-section {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-top: 2rem;
	}
		.diagram-section {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-top: 2rem;
		padding-bottom: 4rem;
	}
	.zenith-system-container {
		width: 100%;
		max-width: 1100px;
		background: var(--dark-background);
		border: 3px solid var(--dark-background-ll);
		border-radius: 1.5rem;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.zenith-header {
		display: flex;
		justify-content: center;
		align-self: center;
		background: var(--dark-background-e);
		padding: 0.5rem 3rem;
		border-radius: 2rem;
		border: 1px solid var(--dark-background-ll);
		font-weight: 900;
		letter-spacing: 0.8rem;
		color: var(--accent);
		font-size: 1.2rem;
		box-shadow: var(--shadow);
	}
	.subsystem-layout {
		display: flex;
		flex-direction: row;
		gap: 3rem;
	}
	.subsystem-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.architecture-header {
		display: flex;
		justify-content: center;
		margin-bottom: 0.5rem;
	}
	.architecture-title {
		font-size: 1.1rem;
		font-weight: 900;
		letter-spacing: 0.4rem;
		color: var(--dark-foreground-l);
		border-bottom: 2px solid var(--dark-background-ll);
		padding-bottom: 0.25rem;
	}
	.layer-stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}
	.layer {
		width: 100%;
		position: relative;
		border-radius: var(--corner-radius);
		transition: transform 0.2s ease, border-color 0.2s ease;
	}
	.layer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
	}
	.layer-label {
		font-size: 1.15rem;
		font-weight: 800;
		letter-spacing: 0.15rem;
	}
	.layer-subtext {
		font-size: 0.8rem;
		color: var(--dark-foreground-l);
		text-transform: uppercase;
		margin-top: 0.25rem;
		opacity: 0.7;
	}
	.prism {
		border-top: 3px solid var(--accent);
		background: linear-gradient(to bottom, rgba(143, 132, 215, 0.1), transparent);
	}
	.stratus {
		border-top: 3px solid var(--secondary);
		background: linear-gradient(to bottom, rgba(56, 114, 186, 0.1), transparent);
	}
	.horizon {
		border-top: 3px solid var(--function);
		background: linear-gradient(to bottom, rgba(211, 211, 157, 0.1), transparent);
	}
	.clarity {
		border-top: 3px solid var(--ast-color-foreground-top);
		background: linear-gradient(to bottom, rgba(193, 236, 200, 0.1), transparent);
	}
	.mist {
		border-top: 3px solid var(--link-color-foreground-top);
		background: linear-gradient(to bottom, rgba(252, 187, 224, 0.1), transparent);
	}
	.haze {
		border-top: 3px solid var(--lto-color-foreground-top);
		background: linear-gradient(to bottom, rgba(219, 164, 12, 0.1), transparent);
	}
	.layer::after {
		content: "";
		position: absolute;
		bottom: -0.75rem;
		left: 50%;
		width: 2px;
		height: 0.75rem;
		background: var(--dark-background-ll);
		z-index: -1;
	}
	.layer:last-child::after {
		display: none;
	}

	@media (max-width: 900px) {
		.subsystem-layout {
			flex-direction: column;
		}
		.zenith-system-container {
			padding: 1.5rem;
		}
	}
	

	.hero h2 {
		font-family: var(--global-font);
		margin: 1.5rem 0;
		font-size: 1.5rem;
		color: var(--dark-foreground-l);
	}

	.subtitle {
		font-size: 1.25rem;
		color: var(--dark-foreground-l);
		max-width: 40rem;
		margin: 2rem auto;
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.btn-primary {
		background: var(--accent);
		color: white;
		padding: 0.8rem 2rem;
		font-weight: bold;
		text-decoration: none;
	}

	.btn-secondary {
		background: transparent;
		border: 1px solid var(--dark-background-l);
		color: var(--dark-foreground);
		padding: 0.8rem 2rem;
	}

	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2.5rem;
		max-width: min(1200px, 100%);
		margin: 0 auto;
	}

	.feature-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.resources-section {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.resources-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.resource-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem !important;
		text-decoration: none;
		color: var(--dark-foreground);
	}

	.resource-card .arrow {
		color: var(--accent);
		font-size: 1.5rem;
	}

	.footer-minimal {
		padding: 2rem;
		text-align: center;
		border-top: 1px solid var(--dark-background-l);
		color: var(--dark-foreground-l);
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.hero h1 { font-size: 3.5rem; }
		.content { gap: 4rem; }
	}
</style>
