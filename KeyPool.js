function increment(alphabet, digits) {
	let workToDo = true
	for (let i = digits.length - 1; i >= 0 && workToDo; i--) {
		const digit = digits[i]
		const index = alphabet.indexOf(digit)
		if (index < 0 || index >= (alphabet.length - 1)) {
			// wrap and carry
			// note: treats unknown digits identically to the highest known digit
			digits[i] = alphabet[0]
		} else {
			// increment and done
			digits[i] = alphabet[index + 1]
			workToDo = false
		}
	}
	if (workToDo) {
		digits.unshift(alphabet[1])
	}
	return digits
}

function compare(alphabet, leftDigits, rightDigits) {
	if (leftDigits.length > rightDigits.length) return 1
	else if (rightDigits.length > leftDigits.length) return -1
	else {
		for (let i = 0; i < leftDigits.length; i++) {
			const leftIndex = alphabet.indexOf(leftDigits[i])
			const rightIndex = alphabet.indexOf(rightDigits[i])
			// noote: all unkown digits (index === -1) are considered equal
			if (leftIndex !== rightIndex) {
				// unknown digits sort higher than known
				if (leftIndex === -1) return 1
				else if (rightIndex === -1) return -1
				else return (leftIndex - rightIndex)
			}
		}
		// all digits equal
		return 0
	}
}

function getDigits(alphabet, prefix, key) {
	if (!key.startsWith(prefix)) {
		throw new RangeError(`invalid key: ${key}`)
	} else {
		const digits = key.substring(prefix.length).split('')
		if (
			digits.length < 1
			|| digits.some(c => alphabet.indexOf(c) === -1)
		) {
			throw new RangeError(`invalid key: ${key}`)
		}
		else return digits
	}
}

export default class KeyPool {
	constructor({
		prefix = '',
		alphabet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
	} = {}) {
		this.prefix = prefix
		this.alphabet = alphabet
		this.released = []
		this.highest = [alphabet[0]]
	}
	next() {
		if (this.released.length) {
			return this.released.pop()
		} else {
			const result = `${this.prefix}${this.highest.join('')}`
			increment(this.alphabet, this.highest)
			return result
		}
	}
	release(key) {
		const actual = String(key)
		const digits = getDigits(this.alphabet, this.prefix, actual)
		if (compare(this.alphabet, digits, this.highest) >= 0) {
			throw new RangeError(`key has not been issued yet: ${actual}`)
		}
		// add it to the list of released keys if we haven't already
		else if (this.released.indexOf(actual) === -1) {
			this.released.push(actual)
		}
		return actual
	}
	isPlausibleKey(key) {
		try {
			return Boolean(getDigits(this.alphabet, this.prefix, String(key)))
		} catch (err) {
			return false
		}
	}
	compareKeys(left, right) {
		const leftDigits = getDigits(this.alphabet, this.prefix, String(left))
		const rightDigits = getDigits(this.alphabet, this.prefix, String(right))
		return compare(this.alphabet, leftDigits, rightDigits)
	}
	increment(key) {
		const digits = getDigits(this.alphabet, this.prefix, String(key))
		increment(this.alphabet, digits)
		return `${this.prefix}${digits.join('')}`
	}
}
