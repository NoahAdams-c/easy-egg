#!/usr/bin/env node

const { program } = require("commander")
const open = require("open")

const { port } = require("../config")
const { getServerInstance } = require("../server")

// $ eegg ui
program
	.command("ui")
	.description("show config page")
	.action(() => {
		getServerInstance()
		const url = `http://127.0.0.1:${port}/index.html`
		open(url)
	})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
	program.outputHelp()
}
