# Nature go

## Run locally

- Set the server's `BASE_URL` in `nature_go/settings.py` to `http://localhost/`.
- Set the `SECRET_KEY` env variable (e.g. through a `.env` file)
- Run the server:

```heroku local```

or

```heroku local windows```

Run django directly:

```python manage.py runserver```

## See remote logs

```heroku logs --tail```
