import parseArgs from './parseArgs'

export default function fetcher(opts) {
	return async function fetch(...args) {
		const fetchOpts = parseArgs(...args)

		const path = (opts.prefix || "") + fetchOpts.path
		const windowFetchOpts = {
			...opts.opts,
			method: fetchOpts.method,
		}
		if (fetchOpts.body !== undefined && fetchOpts.body !== null) {
			windowFetchOpts.body = JSON.stringify(fetchOpts.body)
			windowFetchOpts.headers = {
				'Content-Type': 'application/json'
			}
		}
		const res = await window.fetch(path, windowFetchOpts)
		if (!res.ok) {
			throw new Error(res) // TODO: unify with server throw
		}
		return await res.json()
	}
}
