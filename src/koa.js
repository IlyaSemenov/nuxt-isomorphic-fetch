import parseArgs from './parseArgs'

export default function fetcher(opts) {
	return async function fetch(context, ...args) {
		const fetchOpts = parseArgs(...args)
		const koaCtx = {
			method: fetchOpts.method,
			path: (opts.prefix || "") + fetchOpts.path,
			request: {
				body: fetchOpts.body,
			},
			disableBodyParser: true,
		}
		await opts.middleware(koaCtx, () => {})
		if (!koaCtx.status) {
			koaCtx.status = (koaCtx.body !== undefined) ? 200 : 404
		}
		if (koaCtx.status != 200) {
			throw new Error(`Isomorphic Koa fetch returned HTTP status ${koaCtx.status}.`) // TODO: unify with client throw
		}
		return koaCtx.body
	}
}
