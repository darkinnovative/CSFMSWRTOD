"""
Database migration script to add site_order column to construction_sites table.
"""
import sqlite3
import os

def migrate_site_order():
    """Add site_order column to construction_sites table."""
    db_path = os.getenv("DATABASE_URL", "sqlite:///./detections.db").replace("sqlite:///", "")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if site_order column already exists
        cursor.execute("PRAGMA table_info(construction_sites)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'site_order' not in columns:
            print("Adding site_order column to construction_sites table...")
            cursor.execute("""
                ALTER TABLE construction_sites 
                ADD COLUMN site_order INTEGER DEFAULT 0
            """)
            
            # Set initial order based on creation date
            cursor.execute("""
                UPDATE construction_sites 
                SET site_order = id 
                WHERE site_order IS NULL OR site_order = 0
            """)
            
            conn.commit()
            print("✅ Migration completed successfully!")
        else:
            print("✅ site_order column already exists")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    migrate_site_order()
