<script lang="ts">
	export let mapPosition: Vector3;
	export let elementPosition: Vector2;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const copyCoordinates = () => {
		dispatch('copyCoordinates', { mapPosition });
		dispatch('showContextMenu', { show: false });
	};
</script>

<div id="contextmenu" style="top: {elementPosition.y}px; left: {elementPosition.x}px">
	<ul>
		<li on:click={copyCoordinates} aria-hidden="true">
			<div>
				{mapPosition.x}, {mapPosition.z}
			</div>
		</li>
	</ul>
</div>
