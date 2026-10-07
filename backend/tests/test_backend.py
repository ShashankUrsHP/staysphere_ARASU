import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.db.session import Base, get_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_staysphere.db"

engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = async_sessionmaker(bind=engine_test, class_=AsyncSession, expire_on_commit=False)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture(scope="module", autouse=True)
async def setup_test_db():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Create test users
    async with TestingSessionLocal() as session:
        pw = get_password_hash("Password123!")
        u_guest = User(id="test-guest-id", full_name="Test Guest", email="testguest@example.com", password_hash=pw, role=UserRole.GUEST)
        u_staff = User(id="test-staff-id", full_name="Test Staff", email="teststaff@example.com", password_hash=pw, role=UserRole.STAFF)
        u_admin = User(id="test-admin-id", full_name="Test Admin", email="testadmin@example.com", password_hash=pw, role=UserRole.ADMIN)
        session.add_all([u_guest, u_staff, u_admin])
        await session.commit()

    yield

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_healthcheck():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert data["hotel"] == "StaySphere Grand Bengaluru"

@pytest.mark.asyncio
async def test_auth_login_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/v1/auth/login", json={"email": "testguest@example.com", "password": "Password123!"})
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["email"] == "testguest@example.com"

@pytest.mark.asyncio
async def test_auth_login_invalid_password():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/v1/auth/login", json={"email": "testguest@example.com", "password": "WrongPassword"})
        assert res.status_code == 401

@pytest.mark.asyncio
async def test_ai_concierge_housekeeping_intent():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/v1/ai/concierge", json={"message": "I need housekeeping for room 304", "room_number": "304"})
        assert res.status_code == 200
        data = res.json()
        assert data["intent_detected"] == "HOUSEKEEPING_REQUEST"
        assert data["action_taken"]["action_type"] == "GUEST_REQUEST_CREATED"

@pytest.mark.asyncio
async def test_ml_pricing_recommendation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/v1/ml/pricing-recommendation?base_price=12500&occupancy_rate=85&lead_days=3")
        assert res.status_code == 200
        data = res.json()
        assert data["recommended_adr"] > 12500
        assert "model_confidence" in data
