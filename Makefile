.PHONY: deploy

deploy:
	[ -n "${message}" ] && rm -rf fdnr
	ssc fdnr.s.sh fdnr
	git add .
	git commit -a -m "${message}"
	git push