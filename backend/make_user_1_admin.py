"""
Script to make user with ID 1 an administrator.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import SessionLocal
from app.database.models import User

def make_user_1_admin():
    """Update user with ID 1 to have administrator role."""
    db = SessionLocal()
    
    try:
        # Find user with ID 1
        user = db.query(User).filter(User.id == 1).first()
        
        if user:
            # Update role to administrator
            user.role = "administrator"
            db.commit()
            print(f"[SUCCESS] User {user.email} (ID: {user.id}) updated to administrator role")
            print(f"[SUCCESS] Previous role: {user.role}")
        else:
            print(f"[ERROR] User with ID 1 not found")
            
    except Exception as e:
        print(f"[ERROR] Failed to update user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    make_user_1_admin()
