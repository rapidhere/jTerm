all: std

std: make.py release
	python make.py std

min: make.py release
	python make.py min

release: ./jTerm/__arch__release.json
	cp ./jTerm/__arch__release.json ./jTerm/__arch__.json

debug: ./jTerm/__arch__debug.json
	cp ./jTerm/__arch__debug.json ./jTerm/__arch__.json
	python make.py std

clean:
	rm -f ./jTerm/__arch__.json

cleanall: clean
	rm -f ./jterm.jquery.js ./jterm.jquery.min.js
