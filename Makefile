.PHONY: install run
install:
	npm install

run:
	node_modules/forever/bin/forever index.js ${LISTEN} || exit 1
