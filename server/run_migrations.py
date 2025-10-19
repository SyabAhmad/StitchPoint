#!/usr/bin/env python
"""
Database migration script
Run this to apply pending migrations
"""

import os
import sys
from pathlib import Path

# Add server directory to path
server_dir = Path(__file__).parent
sys.path.insert(0, str(server_dir))

from app import app, db
from flask_migrate import upgrade

def run_migrations():
    """Run pending database migrations"""
    try:
        with app.app_context():
            print("Running database migrations...")
            upgrade()
            print("✓ Migrations completed successfully!")
            print("\nNew tables and columns added:")
            print("  - Products: total_sold, monthly_revenue, last_sale_date")
            print("  - Orders: payment_status, payment_method, refund_amount,")
            print("            commission_fee, seller_payout, rating_by_customer,")
            print("            customer_review, seller_id")
            print("  - New table: seller_stats (aggregated seller statistics)")
            print("  - New table: inventory_logs (inventory change tracking)")
            return True
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        return False

if __name__ == '__main__':
    success = run_migrations()
    sys.exit(0 if success else 1)
