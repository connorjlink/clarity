<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import Haze from '$lib/vectors/Haze.svelte';
	import Github from '$lib/vectors/Github.svelte';
</script>

<header>
	<a class="corner" href="/">
		<Haze size={48} class="rounded" />
	</a>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			<li aria-current={page.url.pathname === '/compiler' ? 'page' : undefined}>
				<a href={resolve('/compiler')}>Compiler</a>
			</li>
			<li aria-current={page.url.pathname === '/statistics' ? 'page' : undefined}>
				<a href={resolve('/statistics')}>Statistics</a>
			</li>
			<li aria-current={page.url.pathname === '/learn' ? 'page' : undefined}>
				<a href={resolve('/learn')}>Learn</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href={resolve('/about')}>About</a>
			</li>
		</ul>
	</nav>

	<a class="corner" href="https://github.com/connorjlink/clarity">
		<Github size={36} />
	</a>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
