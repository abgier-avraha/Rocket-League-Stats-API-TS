import { startBridgeServer } from "./bridge";

function parseArgs() {
	const args = process.argv.slice(2);

	const get = (key: string, fallback: string) => {
		const index = args.indexOf(`--${key}`);
		return index !== -1 ? args[index + 1] : fallback;
	};

	return {
		port: Number(get("port", "3001")),
		rlhost: get("rlhost", "localhost"),
		rlport: Number(get("rlport", "49123")),
	};
}

startBridgeServer(parseArgs());
