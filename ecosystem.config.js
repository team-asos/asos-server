module.exports = {
	apps : [{
		name : "app",
		script : "dist/main.js",
		instances : 2,
		exec_mode : "cluster"
	}]
}
