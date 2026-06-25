#!/usr/bin/env python3
"""
Script to initialize default commission rates for the marketplace
"""

import sys
import os

# Add the server directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

from server.app import create_app
from server.models import db, CommissionRate, User
from datetime import datetime

def initialize_commission_rates():
    """Initialize default commission rates"""
    app = create_app()
    
    with app.app_context():
        # Check if commission rates already exist
        existing_rates = CommissionRate.query.count()
        if existing_rates > 0:
            print(f"Commission rates already exist ({existing_rates} rates found). Deleting existing rates to reinitialize...")
            # Delete existing rates to allow reinitialization
            CommissionRate.query.delete()
            db.session.commit()
        
        # Create default commission rates
        default_rates = [
            {
                'name': 'Standard Rate',
                'min_price': 0,
                'max_price': 500,
                'commission_percentage': 3.0,
                'is_active': True
            },
            {
                'name': 'Premium Rate',
                'min_price': 500,
                'max_price': None,  # No upper limit
                'commission_percentage': 8.0,
                'is_active': True
            }
        ]
        
        # Create commission rates
        created_rates = []
        for rate_data in default_rates:
            rate = CommissionRate(**rate_data)
            db.session.add(rate)
            created_rates.append(rate)
            print(f"Created commission rate: {rate_data['name']} - {rate_data['commission_percentage']}% for PKR {rate_data['min_price']}-{rate_data['max_price'] or 'unlimited'}")
        
        # Commit to database
        db.session.commit()
        
        print(f"\nSuccessfully initialized {len(created_rates)} commission rates!")
        print("Default structure:")
        print("- Products ≤500 PKR: 3% commission")
        print("- Products >500 PKR: 8% commission")
        
        # Display current rates
        print("\nCurrent commission rates:")
        rates = CommissionRate.query.filter_by(is_active=True).order_by(CommissionRate.min_price.asc()).all()
        for rate in rates:
            max_price_str = f"PKR {rate.max_price}" if rate.max_price else "Unlimited"
            print(f"- {rate.name}: {rate.commission_percentage}% for PKR {rate.min_price}-{max_price_str}")

if __name__ == "__main__":
    initialize_commission_rates()