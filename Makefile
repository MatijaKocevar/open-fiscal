.PHONY: dev setup build up down backup restore db-migrate db-studio lint typecheck test bridge clean

dev:
	docker compose -f docker-compose.dev.yml up -d postgres
	./scripts/dev.sh

setup:
	./scripts/setup-dev.sh

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

backup:
	./scripts/backup.sh

restore:
	./scripts/restore.sh $(FILE)

db-migrate:
	cd web && npx prisma migrate dev

db-studio:
	cd web && npx prisma studio

lint:
	cd web && npm run lint

typecheck:
	cd web && npm run typecheck

test:
	cd web && npm run test
	dotnet test furs-bridge-tests/Unit
	dotnet test furs-bridge-tests/Integration

bridge:
	dotnet run --project furs-bridge/src

clean:
	rm -rf web/.next web/node_modules furs-bridge/bin furs-bridge/obj
