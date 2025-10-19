"""
Example usage of new seller analytics and inventory tracking features
"""

from db import db
from db.models import (
    Product, Order, OrderItem, SellerStats, InventoryLog,
    User
)
from datetime import datetime, timedelta

# ============================================================================
# EXAMPLE 1: Creating SellerStats for a new seller
# ============================================================================

def initialize_seller_stats(seller_id):
    """Initialize seller stats when seller makes first sale"""
    existing = SellerStats.query.filter_by(seller_id=seller_id).first()
    
    if not existing:
        seller_stats = SellerStats(
            seller_id=seller_id,
            total_revenue=0,
            monthly_revenue=0,
            total_orders=0,
            completed_orders=0,
            total_products=0,
            active_products=0,
            average_rating=0,
            total_reviews=0,
            positive_feedback_rate=100
        )
        db.session.add(seller_stats)
        db.session.commit()
        print(f"✓ Seller stats created for {seller_id}")
    
    return seller_stats


# ============================================================================
# EXAMPLE 2: Logging inventory changes
# ============================================================================

def log_inventory_change(product_id, quantity_change, action_type, reference_id=None, notes=None):
    """Log when inventory changes"""
    
    product = Product.query.get(product_id)
    if not product:
        print(f"✗ Product {product_id} not found")
        return None
    
    previous_stock = product.stock
    new_stock = max(0, previous_stock + quantity_change)  # Prevent negative stock
    
    # Create log entry
    log = InventoryLog(
        product_id=product_id,
        quantity_change=quantity_change,
        previous_stock=previous_stock,
        new_stock=new_stock,
        action_type=action_type,
        reference_id=reference_id,
        notes=notes
    )
    
    # Update product stock
    product.stock = new_stock
    
    db.session.add(log)
    db.session.commit()
    
    print(f"✓ Inventory log: {product.title} | {action_type} | "
          f"{previous_stock} → {new_stock} ({quantity_change:+d})")
    
    return log


# ============================================================================
# EXAMPLE 3: Processing an order and updating seller stats
# ============================================================================

def process_order_completion(order_id):
    """When order is completed, update seller stats and inventory"""
    
    order = Order.query.get(order_id)
    if not order or order.status != "delivered":
        print("✗ Order not found or not delivered")
        return
    
    seller_id = order.seller_id
    if not seller_id:
        print("✗ Order has no seller assigned")
        return
    
    # Get seller stats
    seller_stats = SellerStats.query.filter_by(seller_id=seller_id).first()
    if not seller_stats:
        seller_stats = initialize_seller_stats(seller_id)
    
    # Update stats
    seller_stats.total_orders += 1
    seller_stats.completed_orders += 1
    seller_stats.total_revenue += order.total_amount
    seller_stats.monthly_revenue += order.total_amount
    seller_stats.total_payout += order.seller_payout
    seller_stats.last_sale_at = datetime.utcnow()
    
    # Update product stats for each item
    for item in order.items:
        product = item.product
        product.total_sold += item.quantity
        product.monthly_revenue += item.price_at_purchase * item.quantity
        product.last_sale_date = datetime.utcnow()
        
        # Log inventory change
        log_inventory_change(
            product_id=product.id,
            quantity_change=-item.quantity,
            action_type='sold',
            reference_id=order_id,
            notes=f"Order {order.order_number} completed"
        )
    
    db.session.commit()
    print(f"✓ Order {order.order_number} processed. Stats updated.")


# ============================================================================
# EXAMPLE 4: Recording customer rating and review
# ============================================================================

def record_order_rating(order_id, rating, review_text=None):
    """Record customer rating for an order"""
    
    order = Order.query.get(order_id)
    if not order:
        print("✗ Order not found")
        return
    
    if not (1 <= rating <= 5):
        print("✗ Rating must be between 1 and 5")
        return
    
    order.rating_by_customer = rating
    order.customer_review = review_text
    
    # Update seller average rating
    if order.seller_id:
        seller_stats = SellerStats.query.filter_by(seller_id=order.seller_id).first()
        
        if seller_stats:
            # Calculate new average
            total_rating = (seller_stats.average_rating * seller_stats.total_reviews) + rating
            seller_stats.total_reviews += 1
            seller_stats.average_rating = total_rating / seller_stats.total_reviews
            
            # Update positive feedback rate (ratings 4-5 = positive)
            if rating >= 4:
                positive_count = seller_stats.total_reviews - 1
                seller_stats.positive_feedback_rate = (positive_count + 1) / seller_stats.total_reviews * 100
            
            print(f"✓ Order rated {rating}/5. Seller rating now: {seller_stats.average_rating:.1f}★")
    
    db.session.commit()


# ============================================================================
# EXAMPLE 5: Handling product restocking
# ============================================================================

def restock_product(product_id, quantity_added, notes=None):
    """Add inventory when seller restocks"""
    
    log_inventory_change(
        product_id=product_id,
        quantity_change=quantity_added,
        action_type='added',
        notes=notes or 'Seller restocked'
    )


# ============================================================================
# EXAMPLE 6: Handling product returns
# ============================================================================

def process_order_return(order_id, items_returned):
    """
    Process a return and update inventory
    
    Args:
        order_id: Order ID
        items_returned: Dict of {product_id: quantity}
    """
    
    order = Order.query.get(order_id)
    if not order:
        print("✗ Order not found")
        return
    
    total_refund = 0
    
    for product_id, quantity in items_returned.items():
        # Log inventory change (returned)
        log_inventory_change(
            product_id=product_id,
            quantity_change=quantity,
            action_type='returned',
            reference_id=order_id,
            notes=f'Return processed for order {order.order_number}'
        )
        
        # Find item in order to get refund amount
        for item in order.items:
            if item.product_id == product_id:
                total_refund += item.price_at_purchase * quantity
                break
    
    # Update order
    order.refund_amount = total_refund
    order.seller_payout -= total_refund
    
    # Update seller stats
    if order.seller_id:
        seller_stats = SellerStats.query.filter_by(seller_id=order.seller_id).first()
        if seller_stats:
            seller_stats.returned_orders += 1
            seller_stats.total_revenue -= total_refund
            seller_stats.total_payout -= total_refund
    
    db.session.commit()
    print(f"✓ Return processed. Refund: ${total_refund:.2f}")


# ============================================================================
# EXAMPLE 7: Generating seller dashboard data
# ============================================================================

def get_seller_dashboard_data(seller_id):
    """Get all dashboard metrics for seller"""
    
    seller_stats = SellerStats.query.filter_by(seller_id=seller_id).first()
    
    if not seller_stats:
        return None
    
    return {
        # Key metrics
        'total_products': seller_stats.total_products,
        'active_orders': seller_stats.total_orders - seller_stats.completed_orders,
        'total_revenue': seller_stats.monthly_revenue,
        'store_rating': seller_stats.average_rating,
        
        # Sales overview
        'sales_overview': {
            'total_sales': seller_stats.monthly_revenue,
            'total_orders': seller_stats.total_orders,
            'total_views': 0,  # Implement separately
            'conversion_rate': 0  # Implement separately
        },
        
        # Performance
        'performance': {
            'profile_completion': 100,
            'response_time_hours': seller_stats.response_time_hours,
            'seller_rating': seller_stats.average_rating,
            'positive_feedback': seller_stats.positive_feedback_rate,
            'cancellation_rate': seller_stats.cancellation_rate,
            'return_rate': seller_stats.return_rate
        },
        
        # Detailed stats
        'completed_orders': seller_stats.completed_orders,
        'cancelled_orders': seller_stats.cancelled_orders,
        'returned_orders': seller_stats.returned_orders,
        'total_items_sold': seller_stats.total_items_sold,
        'pending_payout': seller_stats.pending_payout
    }


# ============================================================================
# EXAMPLE 8: Viewing inventory history for a product
# ============================================================================

def get_product_inventory_history(product_id, days=30):
    """Get inventory change history for last N days"""
    
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    logs = InventoryLog.query.filter(
        InventoryLog.product_id == product_id,
        InventoryLog.created_at >= cutoff_date
    ).order_by(InventoryLog.created_at.desc()).all()
    
    print(f"\nInventory history for product {product_id} (last {days} days):")
    print(f"{'Date':<20} {'Action':<15} {'Change':<10} {'Before':<10} {'After':<10}")
    print("-" * 65)
    
    for log in logs:
        print(f"{log.created_at.strftime('%Y-%m-%d %H:%M'):<20} "
              f"{log.action_type:<15} {log.quantity_change:+6d}   "
              f"{log.previous_stock:<10} {log.new_stock:<10}")
    
    return logs


# ============================================================================
# EXAMPLE 9: Monthly revenue report
# ============================================================================

def get_seller_monthly_report(seller_id, month, year):
    """Generate monthly report for seller"""
    
    # Get orders for the month
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    orders = Order.query.filter(
        Order.seller_id == seller_id,
        Order.created_at >= start_date,
        Order.created_at < end_date,
        Order.status == 'delivered'
    ).all()
    
    total_sales = sum(o.total_amount for o in orders)
    total_commission = sum(o.commission_fee for o in orders)
    total_payout = sum(o.seller_payout for o in orders if o.seller_payout)
    
    report = {
        'month': f"{month}/{year}",
        'total_orders': len(orders),
        'total_sales': total_sales,
        'total_commission': total_commission,
        'total_payout': total_payout,
        'average_order_value': total_sales / len(orders) if orders else 0
    }
    
    return report


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

if __name__ == "__main__":
    """
    Example flow:
    
    1. Seller uploads a product
    2. Customer buys product
    3. Order is processed and completed
    4. Inventory is updated
    5. Customer rates order
    6. Seller views dashboard
    """
    
    # Initialize seller stats
    seller_id = "seller-123"
    seller_stats = initialize_seller_stats(seller_id)
    
    # Simulate product restocking
    restock_product("prod-001", 100, "Initial stock")
    
    # Simulate a sale
    order_id = "order-001"
    log_inventory_change("prod-001", -2, "sold", order_id)
    
    # Record customer rating
    record_order_rating(order_id, 5, "Great quality, fast shipping!")
    
    # Get dashboard data
    dashboard = get_seller_dashboard_data(seller_id)
    print("\nDashboard Data:", dashboard)
    
    # View inventory history
    get_product_inventory_history("prod-001")
