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
	methods: {
		add(item) {
			insertSorted(this.list, item)
		},
	},
	template: `
		<div>
			<ItemEntry @add="add" @search="filter = $event" />
			<label style="display:block; text-align:right; font-weight:bold; margin: 0.5em;">
				Total items: <output>{{ list.length }}</output>
			</label>
			<ListView :list="list" class="has-background-white" />
		</div>
	`,
}).$mount("#app")
