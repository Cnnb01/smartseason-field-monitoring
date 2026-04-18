import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from fields.models import User

def create_admin():
    username = "admin"
    password = "asecretpass321"
    
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser {username}...")
        User.objects.create_superuser(
            username=username, 
            password=password, 
            email="admin@example.com",
            role="ADMIN" # Ensure your custom role is set
        )
        print("Superuser created successfully.")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    create_admin()