export function assignByKey(context, keyPath, value) {
	if (keyPath instanceof Array) {
		if (keyPath.length === 0) {
			throw new ReferenceError('key must not be empty')
		} else if (keyPath.length > 1) {
			return assignByKey(context[keyPath[0]], keyPath.slice(1), value)
		} else {
			return (context[keyPath[0]] = value)
		}
	} else {
		return (context[keyPath] = value)
	}
}

export function getByKey(context, keyPath) {
	if (keyPath instanceof Array) {
		if (keyPath.length === 0) {
			return context
		} else if (keyPath.length === 1) {
			return context[keyPath[0]]
		} else {
			return getByKey(context[keyPath[0]], keyPath.slice(1))
		}
	} else {
		return context[keyPath]
	}
}

export function debounce(fn, rate) {
	let timeout = null
	return function() {
		if (timeout !== null) return
		else {
			timeout = setTimeout(() => { timeout = null }, rate)
			fn()
		}
	}
}
