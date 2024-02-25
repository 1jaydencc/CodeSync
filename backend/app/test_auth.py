import pytest
from httpx import AsyncClient
from main import app  # assuming your FastAPI app instance is named 'app'
from bson.objectid import ObjectId
from config.database import users_collection
from passlib.context import CryptContext

@pytest.fixture
def client():
    """
    Create a test client using the FastAPI app instance.
    """
    return AsyncClient(app=app, base_url="http://test")

@pytest.mark.asyncio
async def test_correct_signup(client):
    """
    Test the sign-up endpoint.
    """
    # Define test user data
    user_data = {
        "email": "test@example.com",
        "first_name": "testuser",
        "password": "Test@1234"  
    }
    
    # Make a request to the sign-up endpoint
    response = await client.post("/auth/sign-up/", json=user_data)

    # Check if the request was successful (status code 200)
    assert response.status_code == 200

    # Check if the response contains the user data
    assert "email" in response.json()
    assert response.json()["email"] == user_data["email"]
    assert "username" in response.json()
    assert response.json()["username"] == user_data["username"]

@pytest.mark.asyncio
async def test_signup_no_special_character(client):
    """
    Test the sign-up endpoint when the password doesn't contain a special character.
    """
    # Define test user data with a password missing a special character
    user_data = {
        "email": "test@example.com",
        "first_name": "testuser",
        "password": "Test1234"  # Missing special character
    }
    
    # Make a request to the sign-up endpoint
    response = await client.post("/auth/sign-up/", json=user_data)

    # Check if the request fails with a status code 400 (Bad Request)
    assert response.status_code == 400

    # Check if the response contains an error message indicating the missing special character
    assert "special character" in response.text.lower()  # Assuming the error message contains this phrase

@pytest.mark.asyncio
async def test_signup_no_capital_character(client):
    """
    Test the sign-up endpoint when the password doesn't start with a capital.
    """
    # Define test user data with a password not starting with a capital
    user_data = {
        "email": "test@example.com",
        "first_name": "testuser",
        "password": "test@1234"  # lowercase start
    }
    
    # Make a request to the sign-up endpoint
    response = await client.post("/auth/sign-up/", json=user_data)

    # Check if the request fails with a status code 400 (Bad Request)
    assert response.status_code == 400

    # Check if the response contains an error message indicating the missing special character
    assert "capital letter" in response.text.lower()  # Assuming the error message contains this phrase

@pytest.mark.asyncio
async def test_signup_length(client):
    """
    Test the sign-up endpoint when the password isn't 7 or more characters.
    """
    # Define test user data with a password that isn't long enough
    user_data = {
        "email": "test@example.com",
        "first_name": "testuser",
        "password": "A@n"  # Missing special character
    }
    
    # Make a request to the sign-up endpoint
    response = await client.post("/auth/sign-up/", json=user_data)

    # Check if the request fails with a status code 400 (Bad Request)
    assert response.status_code == 400

    # Check if the response contains an error message indicating the missing special character
    assert "long" in response.text.lower()  # Assuming the error message contains this phrase

@pytest.mark.asyncio
async def test_password_hashing(client):
    """
    Test password hashing when a user signs up.
    """
    # Define test user data
    user_data = {
        "email": "test@example.com",
        "first_name": "testuser",
        "password": "Test@1234"  # Password to be hashed
    }
    
    # Make a request to the sign-up endpoint
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 200
    
    # Check if the password stored in the database is hashed
    user = await users_collection.find_one({"email": user_data["email"]})
    assert user is not None
    assert "password" in user
    
    # Verify that the stored password is hashed
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    assert pwd_context.verify(user_data["password"], user["password"])  # Verify password hashing
