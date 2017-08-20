export default function(path, body, opts) {
	if (typeof path === "object") {
		opts = {...path}
	} else {
		opts = {...opts, path, body}
	}
	if (!opts.path) {
		throw new Error("fetch: path required.")
	}
	if (!opts.method) {
		opts.method = (opts.body === undefined) ? 'GET' : 'POST'
	}
	return opts
}
