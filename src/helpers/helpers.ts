import { ProcessedQuery } from "../types.js"; 


function processQuery(item: string, slice: string): ProcessedQuery{
	let args: Array<string> = item.slice(slice.length).trim().split(/ +/g);
	let command: string | undefined = args.shift();
	let query: string = args.join(" ");

	return { command, query, args };
}

export default {
	processQuery,
};
