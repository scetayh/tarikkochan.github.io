.PHONY: deploy

deploy:
	git add .
	git commit -a -m "${message}"
	git push