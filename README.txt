Razvija se isključivo na develop branchu, master se ne dira.

pip install -r requirements

python manage.py makemigrations
python manage.py migrate
python manage.py runserver