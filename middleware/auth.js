export default function ({route, req, res, redirect}) {
	let isClient = process.client;
	let isServer = process.server;
	if (isServer) {
		let service_cookie = {};
		req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
			let parts = val.split('=');
			service_cookie[parts[0].trim()] = (parts[1] || '').trim();
		});
		console.log(service_cookie)
	}
		// console.log(route, req.headers.cookie,isClient,isServer)
}