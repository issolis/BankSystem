.PHONY: deploy up down

deploy:
	chmod +x deploy.sh
	./deploy.sh

up:
	chmod +x up.sh
	./up.sh

down:
	chmod +x down.sh
	./down.sh