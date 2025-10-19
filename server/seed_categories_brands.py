#!/usr/bin/env python
"""
Seed script for categories and brands
Run with: python seed_categories_brands.py
"""

from app import create_app
from db import db
from db.models import Category, Brand

def seed_categories():
    """Seed product categories"""
    categories_data = [
        {'name': 'Women', 'description': 'Women fashion and clothing'},
        {'name': 'Men', 'description': 'Men fashion and clothing'},
        {'name': 'Accessories', 'description': 'Fashion accessories and jewels'},
        {'name': 'Shoes', 'description': 'Footwear and shoes'},
        {'name': 'Bags', 'description': 'Handbags and luggage'},
        {'name': 'Traditional', 'description': 'Traditional and ethnic wear'},
        {'name': 'Sportswear', 'description': 'Sports and activewear'},
        {'name': 'Underwear', 'description': 'Innerwear and undergarments'},
    ]
    
    existing = Category.query.count()
    if existing >= len(categories_data):
        print(f"✓ Categories already seeded ({existing} records)")
        return
    
    for category_data in categories_data:
        # Check if category already exists
        if not Category.query.filter_by(name=category_data['name']).first():
            category = Category(
                name=category_data['name'],
                description=category_data['description'],
                is_active=True
            )
            db.session.add(category)
    
    db.session.commit()
    new_count = Category.query.count()
    print(f"✓ Categories seeded - Total: {new_count}")


def seed_brands():
    """Seed product brands"""
    brands_data = [
        {'name': 'Naqosh Couture', 'description': 'Premium luxury couture brand', 'website': 'https://naqosh.com'},
        {'name': 'Elite Collection', 'description': 'Exclusive designer collection', 'website': 'https://elitecollection.com'},
        {'name': 'Luxury Line', 'description': 'High-end fashion line', 'website': 'https://luxuryline.com'},
        {'name': 'Premium Essentials', 'description': 'Premium everyday wear', 'website': 'https://premiumessentials.com'},
        {'name': 'Designer Plus', 'description': 'Contemporary designer wear', 'website': 'https://designerplus.com'},
        {'name': 'Couture Palace', 'description': 'Royal couture designs', 'website': 'https://couturepalace.com'},
        {'name': 'Vogue Trends', 'description': 'Latest fashion trends', 'website': 'https://voguetrends.com'},
        {'name': 'Elegance Pro', 'description': 'Elegant professional wear', 'website': 'https://elegancepro.com'},
    ]
    
    existing = Brand.query.count()
    if existing >= len(brands_data):
        print(f"✓ Brands already seeded ({existing} records)")
        return
    
    for brand_data in brands_data:
        # Check if brand already exists
        if not Brand.query.filter_by(name=brand_data['name']).first():
            brand = Brand(
                name=brand_data['name'],
                description=brand_data['description'],
                website=brand_data.get('website'),
                is_active=True
            )
            db.session.add(brand)
    
    db.session.commit()
    new_count = Brand.query.count()
    print(f"✓ Brands seeded - Total: {new_count}")


def main():
    """Run all seed functions"""
    app = create_app()
    with app.app_context():
        print("\n🌱 Seeding Categories and Brands...\n")
        
        seed_categories()
        seed_brands()
        
        print("\n✅ Categories and brands seeded successfully!\n")


if __name__ == '__main__':
    main()
