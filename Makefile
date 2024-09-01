.PHONY: deploy

deploy:
	[ -n "${message}" ] && git add .
	git commit -a -m "${message}"
	git push