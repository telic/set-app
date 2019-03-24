export default {
	props: {
		list: {
			type: Array,
			required: true,
		},
		filter: {
			type: String,
			default: null,
		},
	},
	methods: {
		passesFilter(str) {
			return !this.filter || (str.toLowerCase().includes(this.filter))
		},
	},
	template: `
		<TransitionGroup tag="ol" class="panel" @enter="$emit('enter', $event)">
			<li
				v-for="(item, i) of list"
				v-if="passesFilter(item)"
				:key="item"
				class="panel-block"
			>
				<span style="flex:1">{{ item }}</span>
				<button
					class="button is-danger"
					type="button"
					title="Delete"
					@click="list.splice(i, 1)"
				>x</button>
			</li>
			<li
				v-for="(item, i) of list"
				v-if="!passesFilter(item)"
				:key="item"
				class="panel-block"
				style="opacity: 0.5"
			>
				<span style="flex:1">{{ item }}</span>
				<button
					class="button is-danger"
					type="button"
					title="Delete"
					@click="list.splice(i, 1)"
				>x</button>
			</li>
		</TransitionGroup>
	`,
}
