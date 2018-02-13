const counters = {};

require('http').createServer((req, res) => {
	res.writeHead(200, { 'content-type' : 'text/plain' });

	const [_, key, number] = req.url.split('/');
	let set = counters[key];

	if(!key) {
		printHelp(res);
	}
	else switch(req.method) {
		case 'DELETE': 
			if(number) {
				if(set && set.has(+number)) {
					set.delete(+number);
					if(set.size == 0) {
						delete counters[key];
					}
				}
			}
			else {
				delete counters[key];
			}

		case 'GET':
			dumpCounters(res, set);
			break;

		case 'POST':
			let i = 0;
			if(!set) {
				set = counters[key] = new Set([]);
			}
			while(set.has(i)) {
				i++;
			}
			set.add(i);
			res.write('' + i);
			break;

		default:
			printHelp(res);
	}
  	res.end();
}).listen(process.argv[2] || 80);

function dumpCounters(res, set) {
	res.write(JSON.stringify([...(set || [])].sort((a, b) => a - b)));
}

function printHelp(res) {
	res.write('A naive sessions counter. Usage:\n' + 
			'\tPOST /foo      returns a new session number for key foo\n' +
			'\tGET /foo       shows active session numbers\n' + 
			'\tDELETE /foo/n  frees session number n for key foo\n' + 
			'\tDELETE /foo    frees all session numbers for key foo\n\n' + 
			'Example:\n' + 
			'\t> POST /test\n' +
			'\t< 0\n\n' +
			'\t> POST /test\n' +
			'\t< 1\n\n' +
			'\t> POST /test\n' +
			'\t< 2\n\n' +
			'\t> GET /test\n' +
			'\t< [0,1,2]\n\n' +
			'\t> DELETE /test/1\n' +
			'\t< [0,2]\n\n' +
			'\t> POST /test\n' +
			'\t< 1\n\n' +
			'\t> GET /test\n' +
			'\t< [0,1,2]\n\n' +
			'\t> DELETE /test/3\n' +
			'\t< [0,1,2]\n\n' +
			'\t> DELETE /test\n' +
			'\t< []\n\n');
}