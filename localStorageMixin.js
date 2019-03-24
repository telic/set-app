import KeyPool from './KeyPool.js'
import { assignByKey, getByKey } from './util.js'

let ids = new KeyPool()

export function loadFromLocalStorage(storageKey, dataKey, reviver = data => JSON.parse(data)) {
	const key = (
		(storageKey instanceof Function)
			? storageKey.call(this)
			: String(storageKey)
	)
	const saved = window.localStorage.getItem(key)
	if (saved) {
		const revived = reviver(saved)
		return assignByKey(this, dataKey, revived)
	} else {
		return undefined
	}
}

export function saveToLocalStorage(storageKey, dataKey, serializer = data => JSON.stringify(data)) {
	const key = (
		(storageKey instanceof Function)
			? storageKey.call(this)
			: String(storageKey)
	)
	window.localStorage.setItem(
		key,
		serializer(getByKey(this, dataKey))
	)
}

export default function (
	dataKey,
	storageKey,
	{
		serializer,
		reviver,
	} = {}
) {
	const instanceId = ids.next()
	const boundSave = `_localStorageMixin_${instanceId}_boundSave`
	return {
		created() {
			if (this[boundSave]) {
				// avoid bugs if same instance mixed more than once
				window.removeEventListener('unload', this[boundSave])
			}
			this[boundSave] = saveToLocalStorage.bind(
				this, storageKey, dataKey, serializer
			)
			this.loadFromLocalStorage(storageKey, dataKey, reviver)
			window.addEventListener('unload', this[boundSave])
		},
		beforeDestroy() {
			window.removeEventListener('unload', this[boundSave])
			this.saveToLocalStorage(storageKey, dataKey, serializer)
		},
		methods: {
			loadFromLocalStorage,
			saveToLocalStorage,
		},
	}
}
