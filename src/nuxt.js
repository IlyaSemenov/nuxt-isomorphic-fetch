export default function fetcher(opts) {
	const fetch = opts.client
	fetch.isomorphic = function (context, ...args) {
		if (context.isServer) {
			return opts.server(context, ...args)
		} else {
			return opts.client(...args)
		}
	}
	return fetch
}
