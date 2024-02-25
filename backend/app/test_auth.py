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
    user_data = {"email": "test@example.com", "first_name": "testuser", "password": "Test@1234"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 200
    assert "email" in response.json() and response.json()["email"] == user_data["email"]
    assert "username" in response.json() and response.json()["username"] == user_data["username"]

@pytest.mark.asyncio
async def test_invalid_signup_missing_special_character(client):
    user_data = {"email": "test@example.com", "first_name": "testuser", "password": "Test1234"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 400
    assert "special character" in response.text.lower()

@pytest.mark.asyncio
async def test_invalid_signup_missing_capital_character(client):
    user_data = {"email": "test@example.com", "first_name": "testuser", "password": "test@1234"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 400
    assert "capital letter" in response.text.lower()

@pytest.mark.asyncio
async def test_invalid_signup_short_password(client):
    user_data = {"email": "test@example.com", "first_name": "testuser", "password": "A@n"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 400
    assert "long" in response.text.lower()

@pytest.mark.asyncio
async def test_password_hashing(client):
    user_data = {"email": "test@example.com", "first_name": "testuser", "password": "Test@1234"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 200
    user = await users_collection.find_one({"email": user_data["email"]})
    assert user is not None and "password" in user
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    assert pwd_context.verify(user_data["password"], user["password"])

@pytest.mark.asyncio
async def test_correct_login(client):
    user_data = {"email": "test@example.com", "password": "Test@1234"}
    response = await client.post("/auth/login/", json=user_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"

@pytest.mark.asyncio
async def test_invalid_login_wrong_email(client):
    user_data = {"email": "wrong@example.com", "password": "Test@1234"}
    response = await client.post("/auth/login/", json=user_data)
    assert response.status_code == 401
    assert "incorrect email or password" in response.text.lower()

@pytest.mark.asyncio
async def test_invalid_login_wrong_password(client):
    user_data = {"email": "test@example.com", "password": "WrongPassword"}
    response = await client.post("/auth/login/", json=user_data)
    assert response.status_code == 401
    assert "incorrect email or password" in response.text.lower()

async def test_invalid_signup_blank_fields(client):
    # Test with blank email
    user_data = {"email": "", "first_name": "testuser", "password": "Test@1234"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 400
    assert "value_error.missing" in response.text.lower()

    # Test with blank first name
    user_data = {"email": "test@example.com", "first_name": "", "password": "Test@1234"}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 400
    assert "value_error.missing" in response.text.lower()

    # Test with blank password
    user_data = {"email": "test@example.com", "first_name": "testuser", "password": ""}
    response = await client.post("/auth/sign-up/", json=user_data)
    assert response.status_code == 400
    assert "value_error.missing" in response.text.lower()