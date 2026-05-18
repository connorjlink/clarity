<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import Haze from '$lib/vectors/Haze.svelte';
	import Github from '$lib/vectors/Github.svelte';
	import Home from '$lib/vectors/Home.svelte';
	import Atom from '$lib/vectors/Atom.svelte';
	import PieChart from '$lib/vectors/PieChart.svelte';
	import GraduateCap from '$lib/vectors/GraduateCap.svelte';
	import Info from '$lib/vectors/Info.svelte';
</script>

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
		position: sticky;
		left: 50%;
		transform: translateX(-50%);
	}
		nav a {
			color: inherit;
		}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3rem;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		gap: 1rem;
		background: var(--background);
		background-size: contain;
	}

	li {
		height: 100%;
		transition: color 100ms ease-in-out;
		display: flex;
		align-items: center;
		position: relative;
		color: var(--color-text);
	}
		li:hover {
			color: var(--accent);
		}

	li[aria-current='page'] {
		color: var(--accent);
	}
	li[aria-current='page']::after {
		content: '';
		height: 2px;
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 0;
		background: var(--accent);
	}

	
</style>

<header>
	<a class="corner" href="/">
		<Haze size={48} class="rounded" />
	</a>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<Home size={24} />
				<a href={resolve('/')}>Home</a>
			</li>
			<li aria-current={page.url.pathname === '/compiler' ? 'page' : undefined}>
				<Atom size={24} />
				<a href={resolve('/compiler')}>Compiler</a>
			</li>
			<li aria-current={page.url.pathname === '/statistics' ? 'page' : undefined}>
				<PieChart size={24} />
				<a href={resolve('/statistics')}>Statistics</a>
			</li>
			<li aria-current={page.url.pathname === '/learn' ? 'page' : undefined}>
				<GraduateCap size={24} />
				<a href={resolve('/learn')}>Learn</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<Info size={24} />
				<a href={resolve('/about')}>About</a>
			</li>
		</ul>
	</nav>

	<a class="corner" href="https://github.com/connorjlink/clarity">
		<Github size={36} />
	</a>
</header>
