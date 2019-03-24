import Vue from './vue.esm.browser.js'
import ItemEntry from './ItemEntry.vue.js'
import ListView from './ListView.vue.js'

import localStorageMixin from './localStorageMixin.js'

const compare = Intl.Collator('en', { sensitivity: 'base' }).compare

function insertSorted(arr, item) {
	let left = 0
	let right = arr.length
	while (left < right) {
		const pivot = Math.floor((left + right) / 2)
		const order = compare(arr[pivot], item)
		if (order === 0) {
			// don't actually insert it, we already have it!
			return arr
		} else if (order > 0) {
			right = pivot
		} else {
			left = pivot + 1
		}
	}
	return arr.splice(left, 0, item)
}

new Vue({
	components: {
		ItemEntry,
		ListView,
	},
	mixins: [
		localStorageMixin('list', 'savedList')
	],
	data: {
		list: [],
		filter: '',
	},
	mounted() {
		this._style = this.$el.ownerDocument.createElement('style')
		this._style.textContent = `
			.app {
				padding: 1em;
				background-color: rgb(240, 240, 240);
			}
			.app > header {
				position: sticky;
				top: 0;
				z-index: 2;
				background-color: rgba(240, 240, 240, 0.8);
				margin: -1em -1em 0;
				padding: 1em 1em 0;
				border-bottom: 1px solid transparent; /* contain inner margins */
			}
		`
		this.$el.ownerDocument.head.appendChild(this._style)
	},
	beforeDestroy() {
		this._style.parentElement.removeChild(this._style)
	},
	methods: {
		add(item) {
			insertSorted(this.list, item)
		},
	},
	template: `
		<section class="app">
			<header>
				<ItemEntry @add="add" @search="filter = $event" />
				<label style="display:block; text-align:right; font-weight:bold; margin: 0.5em;">
					Total items: <output>{{ list.length }}</output>
				</label>
			</header>
			<ListView :list="list" />
		</section>
	`,
}).$mount("#app")
