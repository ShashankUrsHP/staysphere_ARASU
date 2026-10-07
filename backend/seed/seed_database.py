import asyncio
import random
import uuid
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import engine, AsyncSessionLocal, Base
from app.core.security import get_password_hash
from app.models import (
    User, UserRole,
    Hotel,
    Room, RoomType, RoomStatus,
    Booking, BookingStatus, BookingSource, PaymentStatus,
    Payment, PaymentMethod, PaymentTransactionStatus,
    MenuCategory, MenuItem, RestaurantOrder, RestaurantOrderItem, RestaurantOrderStatus,
    HousekeepingTask, HousekeepingTaskType, TaskPriority, TaskStatus,
    MaintenanceRequest, MaintenanceIssueType, MaintenancePriority, MaintenanceStatus,
    GuestRequest, GuestRequestType, GuestRequestStatus,
    Review,
    Notification,
    AuditLog
)

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        print("Seeding StaySphere Grand Bengaluru demo data...")

        # 1. Create Demo Hotel
        hotel = Hotel(
            id="hotel-bengaluru-001",
            name="StaySphere Grand Bengaluru",
            description="Fictional luxury 5-star urban sanctuary located in Indiranagar, Bengaluru. Blending modern technological intelligence with timeless Indian hospitality.",
            address="100 Feet Road, Indiranagar",
            city="Bengaluru",
            state="Karnataka",
            country="India",
            latitude=12.9716,
            longitude=77.5946,
            phone="+91 80 4900 1000",
            email="concierge.bengaluru@staysphere.com",
            check_in_time="15:00",
            check_out_time="11:00",
            rating=4.9
        )
        session.add(hotel)

        # 2. Create Seed Users
        hashed_pw = get_password_hash("Password123!")

        admin_user = User(
            id="user-admin-01",
            full_name="Rajesh Iyer (Admin)",
            email="admin@staysphere.com",
            phone="+91 98765 00001",
            password_hash=hashed_pw,
            role=UserRole.ADMIN,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
        )
        staff_user = User(
            id="user-staff-01",
            full_name="Priya Sharma (Operations Staff)",
            email="staff@staysphere.com",
            phone="+91 98765 00002",
            password_hash=hashed_pw,
            role=UserRole.STAFF,
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
        )
        primary_guest = User(
            id="user-guest-01",
            full_name="Shashank URS",
            email="guest@staysphere.com",
            phone="+91 98765 43210",
            password_hash=hashed_pw,
            role=UserRole.GUEST,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
        )

        session.add_all([admin_user, staff_user, primary_guest])

        guest_names = [
            ("Ananya Sharma", "ananya@example.com"),
            ("Rahul Verma", "rahul@example.com"),
            ("Priya Nair", "priya.n@example.com"),
            ("Vikram Malhotra", "vikram.m@example.com"),
            ("Arjun Patel", "arjun.p@example.com"),
            ("Devika Rao", "devika.r@example.com"),
            ("Siddharth Menon", "siddharth@example.com"),
            ("Kavya Kulkarni", "kavya@example.com"),
            ("Aarav Gupta", "aarav@example.com"),
            ("Meera Joshi", "meera@example.com")
        ]

        additional_guests = []
        for idx, (name, email) in enumerate(guest_names):
            g = User(
                id=f"user-guest-{idx+2:02d}",
                full_name=name,
                email=email,
                phone=f"+91 98765 {idx+10:04d}",
                password_hash=hashed_pw,
                role=UserRole.GUEST
            )
            additional_guests.append(g)
            session.add(g)

        all_guests = [primary_guest] + additional_guests

        # 3. Create Room Types
        rt_deluxe_king = RoomType(
            id="rt-deluxe-king",
            hotel_id=hotel.id,
            name="Deluxe King",
            description="Spacious sanctuary featuring a plush King bed, marble bathroom, smart room controls, and panoramic views of Bengaluru cityscape.",
            capacity=2,
            base_price=7500.0,
            size_sqft=420,
            bed_type="1 King Bed",
            amenities=["City View", "Smart TV", "High-Speed Wi-Fi", "Rain Shower", "Espresso Machine", "Work Desk"],
            images=["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200"]
        )
        rt_deluxe_twin = RoomType(
            id="rt-deluxe-twin",
            hotel_id=hotel.id,
            name="Deluxe Twin",
            description="Elegantly designed room featuring two single twin beds, ergonomic workspace, and high-speed fiber internet for business travelers.",
            capacity=2,
            base_price=6800.0,
            size_sqft=400,
            bed_type="2 Twin Beds",
            amenities=["City View", "Work Desk", "High-Speed Wi-Fi", "Mini Bar", "Rain Shower"],
            images=["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200"]
        )
        rt_exec_king = RoomType(
            id="rt-exec-king",
            hotel_id=hotel.id,
            name="Executive King",
            description="Corner executive room with access to the Executive Club Lounge, complimentary evening cocktails, and deep soaking tub.",
            capacity=2,
            base_price=12500.0,
            size_sqft=550,
            bed_type="1 Super King Bed",
            amenities=["Executive Lounge Access", "Cocktail Hour", "Soaking Tub", "City Skyline View", "Butler Service"],
            images=["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200"]
        )
        rt_exec_suite = RoomType(
            id="rt-exec-suite",
            hotel_id=hotel.id,
            name="Executive Suite",
            description="Expansive suite featuring separate living room, dining space, master bedroom, and private balcony overlooking Indiranagar greens.",
            capacity=3,
            base_price=22000.0,
            size_sqft=850,
            bed_type="1 Super King Bed",
            amenities=["Private Balcony", "Separate Living Lounge", "Walk-in Closet", "Luxury Toiletries", "Lounge Access"],
            images=["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200"]
        )
        rt_presidential = RoomType(
            id="rt-presidential",
            hotel_id=hotel.id,
            name="Presidential Suite",
            description="The pinnacle of luxury. 1,800 sq ft suite with private dining hall, grand piano, Jacuzzi terrace, and 24/7 dedicated personal butler.",
            capacity=4,
            base_price=45000.0,
            size_sqft=1800,
            bed_type="1 Emperor Bed",
            amenities=["Private Jacuzzi", "Grand Piano", "Personal Chef Available", "Airport Limousine", "Dedicated Butler"],
            images=["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200"]
        )
        rt_villa = RoomType(
            id="rt-pool-villa",
            hotel_id=hotel.id,
            name="Pool Villa",
            description="Secluded private villa featuring a temperature-controlled private plunge pool, tropical garden terrace, and open-air bath.",
            capacity=4,
            base_price=38000.0,
            size_sqft=1400,
            bed_type="1 Super King Bed",
            amenities=["Private Plunge Pool", "Garden Terrace", "Outdoor Rain Shower", "Barbecue Set", "Floating Breakfast"],
            images=["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200"]
        )

        room_types = [rt_deluxe_king, rt_deluxe_twin, rt_exec_king, rt_exec_suite, rt_presidential, rt_villa]
        session.add_all(room_types)

        # 4. Create Exactly 50 Rooms across floors 1-5
        rooms_config = [
            (rt_deluxe_king, [(1, range(101, 106)), (2, range(201, 206)), (3, range(301, 306)), (4, range(401, 406))]),
            (rt_deluxe_twin, [(1, range(106, 109)), (2, range(206, 209)), (3, range(306, 309)), (4, range(406, 409))]),
            (rt_exec_king, [(1, range(109, 111)), (2, range(209, 211)), (3, range(309, 311)), (4, range(409, 411))]),
            (rt_exec_suite, [(5, range(501, 507))]),
            (rt_presidential, [(5, range(507, 509))]),
            (rt_villa, [(5, range(509, 511))])
        ]

        created_rooms = []
        statuses = [RoomStatus.AVAILABLE, RoomStatus.OCCUPIED, RoomStatus.CLEANING, RoomStatus.MAINTENANCE, RoomStatus.RESERVED]

        for rt, floor_ranges in rooms_config:
            for floor, num_range in floor_ranges:
                for room_no in num_range:
                    st = random.choices(statuses, weights=[55, 25, 10, 5, 5])[0]
                    room_inst = Room(
                        id=f"room-{room_no}",
                        hotel_id=hotel.id,
                        room_type_id=rt.id,
                        room_number=str(room_no),
                        floor=floor,
                        status=st,
                        current_guest_id=primary_guest.id if st == RoomStatus.OCCUPIED and room_no == 304 else None
                    )
                    created_rooms.append(room_inst)
                    session.add(room_inst)

        print(f"Created {len(created_rooms)} rooms.")

        # 5. Create Restaurant Menu Categories & Items
        cat_bf = MenuCategory(id="cat-bf", name="Breakfast", description="Artisanal breakfast selection")
        cat_lunch = MenuCategory(id="cat-lunch", name="Lunch & Dinner", description="Gourmet entrees and Indian specialties")
        cat_drinks = MenuCategory(id="cat-drinks", name="Beverages", description="Specialty teas, Coorg coffee and juices")
        cat_dessert = MenuCategory(id="cat-dessert", name="Desserts", description="Decadent sweet creations")
        session.add_all([cat_bf, cat_lunch, cat_drinks, cat_dessert])

        menu_items = [
            MenuItem(id="mi-1", category_id=cat_bf.id, category_name="Breakfast", name="Royal Mysore Masala Dosa", description="Crispy rice crepe filled with spiced potato mash, served with coconut chutney & sambar.", price=480.0, dietary=["Vegetarian", "Chef Special"], prep_time="15 min"),
            MenuItem(id="mi-2", category_id=cat_bf.id, category_name="Breakfast", name="Eggs Benedict Royale", description="Poached organic eggs on toasted brioche with smoked salmon & hollandaise sauce.", price=650.0, dietary=["Chef Special"], prep_time="20 min"),
            MenuItem(id="mi-3", category_id=cat_lunch.id, category_name="Dinner", name="Bengaluru Butter Chicken", description="Tender chicken tikka simmered in creamy tomato gravy with garlic naan.", price=850.0, dietary=[], prep_time="25 min"),
            MenuItem(id="mi-4", category_id=cat_lunch.id, category_name="Dinner", name="Truffle Wild Mushroom Risotto", description="Arborio rice cooked with porcini mushrooms, black truffle oil, and aged parmesan.", price=920.0, dietary=["Vegetarian"], prep_time="25 min"),
            MenuItem(id="mi-5", category_id=cat_drinks.id, category_name="Drinks", name="Artisanal Filter Coffee", description="Traditional South Indian brass filter coffee brewed with high-grown Coorg beans.", price=280.0, dietary=["Vegetarian"], prep_time="10 min"),
            MenuItem(id="mi-6", category_id=cat_dessert.id, category_name="Desserts", name="Belgian Dark Chocolate Fondant", description="Warm chocolate cake with molten center, vanilla bean ice cream & berry compote.", price=550.0, dietary=["Vegetarian", "Chef Special"], prep_time="15 min")
        ]
        session.add_all(menu_items)

        # 6. Create Seed Bookings
        today = date.today()
        seed_bookings = []

        active_b = Booking(
            id="booking-active-01",
            booking_reference="STY-10482",
            guest_id=primary_guest.id,
            hotel_id=hotel.id,
            room_id="room-304",
            check_in_date=today - timedelta(days=1),
            check_out_date=today + timedelta(days=2),
            adults=2,
            children=0,
            base_amount=37500.0,
            tax_amount=6075.0,
            discount_amount=3750.0,
            total_amount=39825.0,
            status=BookingStatus.CHECKED_IN,
            payment_status=PaymentStatus.PAID,
            booking_source=BookingSource.DIRECT,
            special_requests="High floor, extra feather pillows, quiet room."
        )
        session.add(active_b)
        seed_bookings.append(active_b)

        for i in range(1, 35):
            guest = random.choice(all_guests)
            room = random.choice(created_rooms)
            offset = random.randint(-45, 30)
            check_in = today + timedelta(days=offset)
            nights = random.randint(1, 5)
            check_out = check_in + timedelta(days=nights)

            if offset < -2:
                b_status = random.choice([BookingStatus.CHECKED_OUT, BookingStatus.CANCELLED])
            elif -2 <= offset <= 0:
                b_status = BookingStatus.CHECKED_IN
            else:
                b_status = random.choice([BookingStatus.CONFIRMED, BookingStatus.PENDING])

            b_ref = f"STY-{random.randint(20000, 99999)}"
            base_amt = 10000.0 * nights
            b_inst = Booking(
                id=f"booking-seed-{i:03d}",
                booking_reference=b_ref,
                guest_id=guest.id,
                hotel_id=hotel.id,
                room_id=room.id,
                check_in_date=check_in,
                check_out_date=check_out,
                adults=random.randint(1, 2),
                children=0,
                base_amount=base_amt,
                tax_amount=base_amt * 0.18,
                discount_amount=base_amt * 0.05,
                total_amount=base_amt * 1.13,
                status=b_status,
                payment_status=PaymentStatus.PAID if b_status in [BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT] else PaymentStatus.UNPAID,
                booking_source=random.choice([BookingSource.DIRECT, BookingSource.WEBSITE, BookingSource.OTA])
            )
            session.add(b_inst)

        # 7. Create Operational Tasks & Requests
        hk_task1 = HousekeepingTask(
            id="hk-1",
            room_id="room-204",
            assigned_staff_id=staff_user.id,
            task_type=HousekeepingTaskType.ROOM_CLEANING,
            priority=TaskPriority.HIGH,
            status=TaskStatus.IN_PROGRESS,
            description="Checkout Deep Clean after guest departure."
        )
        hk_task2 = HousekeepingTask(
            id="hk-2",
            room_id="room-304",
            assigned_staff_id=staff_user.id,
            task_type=HousekeepingTaskType.AMENITY_RESTOCK,
            priority=TaskPriority.MEDIUM,
            status=TaskStatus.PENDING,
            description="Deliver extra feather pillows and complimentary mineral water."
        )
        session.add_all([hk_task1, hk_task2])

        maint_req1 = MaintenanceRequest(
            id="maint-1",
            room_id="room-217",
            reported_by=primary_guest.id,
            assigned_staff_id=staff_user.id,
            issue_type=MaintenanceIssueType.HVAC_CLIMATE,
            description="Air conditioning cooling unit temperature regulation check.",
            priority=MaintenancePriority.HIGH,
            status=MaintenanceStatus.IN_PROGRESS
        )
        session.add(maint_req1)

        g_req1 = GuestRequest(
            id="greq-1",
            guest_id=primary_guest.id,
            room_id="room-304",
            booking_id=active_b.id,
            request_type=GuestRequestType.HOUSEKEEPING,
            description="Requesting evening turndown service with lavender essential oil.",
            priority=TaskPriority.MEDIUM,
            status=GuestRequestStatus.IN_PROGRESS,
            assigned_staff_id=staff_user.id
        )
        session.add(g_req1)

        # 8. Notifications & Audit Logs
        notif1 = Notification(
            id="notif-1",
            user_id=primary_guest.id,
            title="Welcome to StaySphere Grand Bengaluru",
            message="Your stay in Executive King 304 has begun. Enjoy 24/7 AI Concierge assistance.",
            type="SUCCESS",
            is_read=False
        )
        session.add(notif1)

        audit1 = AuditLog(
            id="audit-1",
            user_id=admin_user.id,
            action="SYSTEM_INIT",
            entity_type="Hotel",
            entity_id=hotel.id,
            new_value="Database initialized with 50 operational rooms and AI engine."
        )
        session.add(audit1)

        await session.commit()
        print("StaySphere Grand Bengaluru database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
