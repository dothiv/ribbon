.DEFAULT_GOAL := help
.PHONY: help deploy

help: ## (default), display the list of make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Helpers

guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

# Assets

assetsbuild := build/img/logo.png build/img/ribbon-dots.png build/img/ribbon-dots@2x.png build/favicon.ico build/img/header-960px.jpg build/img/logo.svg build/img/favicon.png

build/img/%: src/img/%
	@mkdir -p $(dir $@)
	cp -u $< $@

build/favicon.ico: src/img/favicon.ico
	cp -u $< $@

# HTML

DOTHIV__TITLE ?= "dotHIV Initiative"
DOTHIV__REDIRECT ?= "https://click4life.hiv"
DOTHIV__LANGUAGE ?= "en"

htmlbuild := build/iframe.html build/microsite.html
build/%.html: src/%.html config.web.js strings.json
	@mkdir -p $(dir $@)
ifeq ($(ENVIRONMENT),development)
	DOTHIV__TITLE=$(DOTHIV__TITLE) DOTHIV__REDIRECT=$(DOTHIV__REDIRECT) ./node_modules/.bin/babel-node ./node_modules/.bin/rheactor-build-views build ./config.web $< $@
else
	DOTHIV__TITLE=$(DOTHIV__TITLE) DOTHIV__REDIRECT=$(DOTHIV__REDIRECT) ./node_modules/.bin/babel-node ./node_modules/.bin/rheactor-build-views build -m ./config.web $< $@
endif

# JavaScript

# Build variables for JS artefacts
jsbrowserified := build/js/iframe.js build/js/microsite.js
jsbuild := build/js/iframe.min.js build/js/microsite.min.js

build/js/%.min.js: build/js/%.js
ifeq ($(ENVIRONMENT),development)
	cp -u $< $@
else
	./node_modules/.bin/uglifyjs $< -o $@
endif

build/js/%.js: src/js/%.js src/js/module/*.js package.json
	@mkdir -p $(dir $@)
	./node_modules/.bin/browserify $< -o $@

# Stylesheets

# Build variables for CSS artefacts
csssassed := build/css/iframe.css build/css/microsite.css
cssbuild := build/css/iframe.min.css build/css/microsite.min.css

build/css/%.min.css: build/css/%.css
ifeq ($(ENVIRONMENT),development)
	cp -u $< $@
else
	./node_modules/.bin/uglifycss $< > $@
endif

build/css/%.css: src/scss/%.scss build/fonts
	@mkdir -p $(dir $@)
	./node_modules/.bin/node-sass $< $@

build/fonts: node_modules/ionicons/dist/fonts/*.*
	mkdir -p build/fonts
	cp -u node_modules/ionicons/dist/fonts/*.* build/fonts/

deploy: build ## Deploy to production
	rsync -crvz --delete --delete-after build/ $(RSYNC)/$(DOTHIV__DOMAIN)


# Cleanup

clean:
	rm -rf build

# MAIN

.SECONDARY: $(jsbrowserified) $(csssassed)

development: ## Build for development environment
	ENVIRONMENT=development make build

build: $(assetsbuild) $(htmlbuild) $(jsbuild) $(cssbuild) ## Build for production environment
