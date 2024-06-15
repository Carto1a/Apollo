// TRACE 0
// DEBUG 1
// FATAL 2
// ERROR 3
// INFO  4
// [FATAL 10/10/2003 10:10:10] Aconteceu alguma coisa

class LoggerClass {
	LOG_LEVEL: number = Number(process.env.LOG_LEVEL);

	constructor() {

	}

	fatal(log: any): void {
		if (this.LOG_LEVEL <= 2) {
			let date: Date = new Date();
			console.log(`[FATAL ${date.toLocaleString()}] ${log}`);
		}
	}

	error(log: any): void {
		if (this.LOG_LEVEL <= 3) {
			let date: Date = new Date();
			console.log(`[ERROR ${date.toLocaleString()}] ${log}`);
		}
	}

	info(log: any): void {
		if (this.LOG_LEVEL <= 4) {
			let date: Date = new Date();
			console.log(`[INFO  ${date.toLocaleString()}] ${log}`);
		}
	}

	debug(log: any): void {
		if (this.LOG_LEVEL <= 1) {
			let date: Date = new Date();
			console.log(`[DEBUG ${date.toLocaleString()}] ${log}`);
		}
	}

	trace(log: any): void {
		if (this.LOG_LEVEL <= 0) {
			let date: Date = new Date();
			console.log(`[TRACE ${date.toLocaleString()}] ${log}`);
		}
	}
}

let Logger = new LoggerClass();

export default Logger;
