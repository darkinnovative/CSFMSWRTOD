"""
Automatic database migration system.
Handles schema changes automatically on application startup.
"""
from sqlalchemy import text
from app.database.database import get_db, engine
from app.database.models import Base
import logging

logger = logging.getLogger(__name__)

def run_migrations():
    """Run all pending migrations."""
    migrations = [
        {
            "name": "001_create_tables",
            "description": "Create all tables",
            "up": create_tables,
            "check": check_tables_exist
        },
        {
            "name": "002_add_site_order",
            "description": "Add site_order column to construction_sites",
            "up": add_site_order_column,
            "check": check_site_order_exists
        },
        {
            "name": "003_add_quotation_fields",
            "description": "Add missing quotation fields",
            "up": add_quotation_fields,
            "check": check_quotation_fields_exist
        },
        {
            "name": "004_add_created_by_field",
            "description": "Add created_by field to quotations table",
            "up": add_created_by_field,
            "check": check_created_by_exists
        },
    ]
    
    # Use Session for proper transaction management
    from app.database.database import SessionLocal
    db = SessionLocal()
    
    try:
        # Create migrations table if not exist
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # Get applied migrations
        result = db.execute(text("SELECT name FROM migrations"))
        applied_migrations = {row[0] for row in result}
        
        # Run pending migrations
        for migration in migrations:
            if migration["name"] not in applied_migrations:
                logger.info(f"Running migration: {migration['name']}")
                try:
                    migration["up"](db)
                    db.execute(text(
                        f"INSERT INTO migrations (name) VALUES ('{migration['name']}')"
                    ))
                    db.commit()
                    logger.info(f"Migration {migration['name']} completed successfully")
                except Exception as e:
                    logger.error(f"Migration {migration['name']} failed: {e}")
                    db.rollback()
                    raise
            else:
                logger.info(f"Migration {migration['name']} already applied, skipping")
    finally:
        db.close()

def create_tables(db):
    """Create all tables using SQLAlchemy models."""
    Base.metadata.create_all(bind=engine)
    logger.info("All tables created successfully")

def check_tables_exist(db):
    """Check if all tables exist."""
    required_tables = [
        'users', 'companies', 'construction_sites', 'vehicles', 
        'employees', 'detections', 'quotations', 'orders', 
        'traffic_logs', 'gate_passes'
    ]
    
    result = db.execute(text("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
    """))
    existing_tables = {row[0] for row in result}
    
    return all(table in existing_tables for table in required_tables)

def add_site_order_column(db):
    """Add site_order column to construction_sites table."""
    try:
        db.execute(text("""
            ALTER TABLE construction_sites 
            ADD COLUMN site_order INTEGER DEFAULT 0
        """))
        
        # Update existing sites with order
        db.execute(text("""
            UPDATE construction_sites 
            SET site_order = (
                SELECT COUNT(*) - 1 
                FROM construction_sites cs2 
                WHERE cs2.id <= construction_sites.id
            )
        """))
        
        logger.info("site_order column added to construction_sites")
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            logger.info("site_order column already exists")
        else:
            raise

def check_site_order_exists(db):
    """Check if site_order column exists in construction_sites."""
    try:
        result = db.execute(text("""
            PRAGMA table_info(construction_sites)
        """))
        columns = {row[1] for row in result}
        return 'site_order' in columns
    except:
        return False

def add_quotation_fields(db):
    """Add missing quotation fields."""
    try:
        # Add valid_until if not exists
        db.execute(text("""
            ALTER TABLE quotations 
            ADD COLUMN valid_until TIMESTAMP
        """))
    except:
        pass
    
    try:
        # Add created_date if not exists
        db.execute(text("""
            ALTER TABLE quotations 
            ADD COLUMN created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """))
    except:
        pass
    
    logger.info("Quotation fields added/verified")

def check_quotation_fields_exist(db):
    """Check if quotation fields exist."""
    try:
        result = db.execute(text("""
            PRAGMA table_info(quotations)
        """))
        columns = {row[1] for row in result}
        return 'valid_until' in columns and 'created_date' in columns
    except:
        return False

def add_created_by_field(db):
    """Add created_by field to quotations table."""
    try:
        db.execute(text("""
            ALTER TABLE quotations 
            ADD COLUMN created_by INTEGER
        """))
        logger.info("created_by field added to quotations")
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            logger.info("created_by field already exists")
        else:
            raise

def check_created_by_exists(db):
    """Check if created_by field exists in quotations."""
    try:
        result = db.execute(text("""
            PRAGMA table_info(quotations)
        """))
        columns = {row[1] for row in result}
        return 'created_by' in columns
    except:
        return False

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_migrations()
