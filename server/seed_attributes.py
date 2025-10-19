#!/usr/bin/env python
"""
Seed script for product attributes (sizes, colors, materials, shipping countries)
Run with: python seed_attributes.py
"""

from app import create_app
from db import db
from db.models import Size, Color, Material, ShippingCountry

def seed_sizes():
    """Seed available sizes"""
    sizes_data = [
        {'name': 'XS', 'description': 'Extra Small'},
        {'name': 'S', 'description': 'Small'},
        {'name': 'M', 'description': 'Medium'},
        {'name': 'L', 'description': 'Large'},
        {'name': 'XL', 'description': 'Extra Large'},
        {'name': 'XXL', 'description': '2XL'},
        {'name': '32', 'description': 'Size 32'},
        {'name': '34', 'description': 'Size 34'},
        {'name': '36', 'description': 'Size 36'},
        {'name': '38', 'description': 'Size 38'},
        {'name': '40', 'description': 'Size 40'},
        {'name': '42', 'description': 'Size 42'},
    ]
    
    existing = Size.query.count()
    if existing > 0:
        print(f"✓ Sizes already seeded ({existing} records)")
        return
    
    for size_data in sizes_data:
        size = Size(**size_data)
        db.session.add(size)
    
    db.session.commit()
    print(f"✓ Seeded {len(sizes_data)} sizes")


def seed_colors():
    """Seed available colors"""
    colors_data = [
        {'name': 'Black', 'hex_code': '#000000'},
        {'name': 'White', 'hex_code': '#FFFFFF'},
        {'name': 'Red', 'hex_code': '#FF0000'},
        {'name': 'Blue', 'hex_code': '#0000FF'},
        {'name': 'Green', 'hex_code': '#00AA00'},
        {'name': 'Yellow', 'hex_code': '#FFFF00'},
        {'name': 'Pink', 'hex_code': '#FFC0CB'},
        {'name': 'Purple', 'hex_code': '#800080'},
        {'name': 'Orange', 'hex_code': '#FFA500'},
        {'name': 'Brown', 'hex_code': '#A52A2A'},
        {'name': 'Gray', 'hex_code': '#808080'},
        {'name': 'Gold', 'hex_code': '#D4AF37'},
        {'name': 'Silver', 'hex_code': '#C0C0C0'},
        {'name': 'Beige', 'hex_code': '#F5F5DC'},
        {'name': 'Navy', 'hex_code': '#000080'},
    ]
    
    existing = Color.query.count()
    if existing > 0:
        print(f"✓ Colors already seeded ({existing} records)")
        return
    
    for color_data in colors_data:
        color = Color(**color_data)
        db.session.add(color)
    
    db.session.commit()
    print(f"✓ Seeded {len(colors_data)} colors")


def seed_materials():
    """Seed available materials"""
    materials_data = [
        {'name': 'Cotton', 'description': '100% organic cotton'},
        {'name': 'Silk', 'description': 'Premium silk fabric'},
        {'name': 'Wool', 'description': 'Pure wool'},
        {'name': 'Polyester', 'description': 'Durable polyester blend'},
        {'name': 'Linen', 'description': 'Natural linen'},
        {'name': 'Denim', 'description': 'Classic denim'},
        {'name': 'Leather', 'description': 'Genuine leather'},
        {'name': 'Suede', 'description': 'Soft suede'},
        {'name': 'Satin', 'description': 'Glossy satin'},
        {'name': 'Velvet', 'description': 'Luxurious velvet'},
        {'name': 'Chiffon', 'description': 'Lightweight chiffon'},
        {'name': 'Lace', 'description': 'Delicate lace'},
        {'name': 'Rayon', 'description': 'Viscose rayon'},
        {'name': 'Nylon', 'description': 'Synthetic nylon'},
        {'name': 'Canvas', 'description': 'Heavy duty canvas'},
    ]
    
    existing = Material.query.count()
    if existing > 0:
        print(f"✓ Materials already seeded ({existing} records)")
        return
    
    for material_data in materials_data:
        material = Material(**material_data)
        db.session.add(material)
    
    db.session.commit()
    print(f"✓ Seeded {len(materials_data)} materials")


def seed_shipping_countries():
    """Seed shipping countries"""
    countries_data = [
        {'name': 'United States', 'country_code': 'US', 'shipping_cost': 10, 'estimated_days': 3, 'is_active': True},
        {'name': 'Canada', 'country_code': 'CA', 'shipping_cost': 15, 'estimated_days': 5, 'is_active': True},
        {'name': 'United Kingdom', 'country_code': 'GB', 'shipping_cost': 20, 'estimated_days': 5, 'is_active': True},
        {'name': 'Australia', 'country_code': 'AU', 'shipping_cost': 30, 'estimated_days': 10, 'is_active': True},
        {'name': 'Germany', 'country_code': 'DE', 'shipping_cost': 18, 'estimated_days': 5, 'is_active': True},
        {'name': 'France', 'country_code': 'FR', 'shipping_cost': 18, 'estimated_days': 5, 'is_active': True},
        {'name': 'Italy', 'country_code': 'IT', 'shipping_cost': 18, 'estimated_days': 5, 'is_active': True},
        {'name': 'Spain', 'country_code': 'ES', 'shipping_cost': 18, 'estimated_days': 5, 'is_active': True},
        {'name': 'Japan', 'country_code': 'JP', 'shipping_cost': 35, 'estimated_days': 12, 'is_active': True},
        {'name': 'India', 'country_code': 'IN', 'shipping_cost': 8, 'estimated_days': 7, 'is_active': True},
        {'name': 'UAE', 'country_code': 'AE', 'shipping_cost': 12, 'estimated_days': 4, 'is_active': True},
        {'name': 'Singapore', 'country_code': 'SG', 'shipping_cost': 15, 'estimated_days': 6, 'is_active': True},
        {'name': 'Mexico', 'country_code': 'MX', 'shipping_cost': 12, 'estimated_days': 5, 'is_active': True},
        {'name': 'Brazil', 'country_code': 'BR', 'shipping_cost': 20, 'estimated_days': 8, 'is_active': True},
        {'name': 'South Africa', 'country_code': 'ZA', 'shipping_cost': 25, 'estimated_days': 10, 'is_active': True},
    ]
    
    existing = ShippingCountry.query.count()
    if existing > 0:
        print(f"✓ Shipping countries already seeded ({existing} records)")
        return
    
    for country_data in countries_data:
        country = ShippingCountry(**country_data)
        db.session.add(country)
    
    db.session.commit()
    print(f"✓ Seeded {len(countries_data)} shipping countries")


def main():
    """Run all seed functions"""
    app = create_app()
    with app.app_context():
        print("\n🌱 Seeding Product Attributes...\n")
        
        seed_sizes()
        seed_colors()
        seed_materials()
        seed_shipping_countries()
        
        print("\n✅ All attributes seeded successfully!\n")


if __name__ == '__main__':
    main()
