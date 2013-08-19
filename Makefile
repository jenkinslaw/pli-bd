.PHONY: default test casperjs jshint

default: test

test: casperjs jshint

casperjs:
	casperjs test tests

jshint: jshint .
