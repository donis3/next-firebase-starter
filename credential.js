//Generate credentials for your google service account
const path = require("path");
const fs = require("node:fs");

/**
 * Place in ./private folder and paste the filename here as <filename>.json
 */
const CREDENTIAL_FILE_NAME =
	"donis-next-firebase-starter-firebase-adminsdk-6amwg-0dd3d53f1d.json";

function loadData() {
	try {
		const filepath = path.join(__dirname, "private", CREDENTIAL_FILE_NAME);
		const data = require(filepath);
		return data;
	} catch (error) {
		console.log("Unable to load your google credentials");
	}
}

function generate(data) {
	try {
		const outputPath = path.join(
			__dirname,
			"private",
			"service-account-string.txt",
		);
		const json_string = JSON.stringify(data);

		const encoded = btoa(json_string);

		fs.writeFile(outputPath, encoded, (err) => {
			if (err) {
				console.error(err);
			}
			// file written successfully
		});
	} catch (error) {
		console.log("Unable to convert google credentials to json string.");
	}
}

const data = loadData();

generate(data);
