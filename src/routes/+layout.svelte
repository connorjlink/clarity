<script lang="ts">
	import Header from './Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		
	}
	main {
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
		box-sizing: border-box;
	}
</style>
