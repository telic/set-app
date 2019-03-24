export default {
	data() {
		return { str: '' }
	},
	computed: {
		nonEmpty() {
			return /\S/.test(this.str)
		},
	},
	methods: {
		handleEnter() {
			const norm = this.str.trim().normalize()
			if (/\S/.test(norm)) {
				this.$emit('add', norm)
			}
			this.str = ''
			this.$emit('search', null)
		},
		handleInput() {
			this.$emit(
				'search',
				this.str.trim().toLowerCase().normalize()
			)
		},
	},
	template: `
		<div class="field has-addons">
			<div class="control is-expanded">
				<input
					ref="input"
					v-model="str"
					class="input"
					autofocus
					@keypress.enter.prevent="handleEnter"
					@input="handleInput"
				>
			</div>
			<div class="control">
				<button
					type="button"
					class="button is-primary"
					:disabled="!nonEmpty"
					@click="handleEnter"
				>
					Add
				</button>
			</div>
		</div>
	`,
}
