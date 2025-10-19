# This file documents the model updates needed for the seller dashboard
# The following columns/changes are being added:

# ============================================================================
# PRODUCT MODEL UPDATES
# ============================================================================
# - rating: FLOAT (already exists, but will track 0-5 stars)
# - review_count: INTEGER (already exists, tracks number of reviews)
# - total_sold: INTEGER - NEW (track total units sold)
# - monthly_revenue: FLOAT - NEW (revenue from product this month)
# - last_sale_date: DATETIME - NEW (track last sale)

# ============================================================================
# ORDER MODEL UPDATES
# ============================================================================
# - seller_id: VARCHAR - NEW (to track which seller's products are in the order)
# - payment_status: VARCHAR - NEW (pending, completed, failed, refunded)
# - payment_method: VARCHAR - NEW (credit_card, paypal, etc)
# - refund_amount: FLOAT - NEW (if order was refunded)
# - commission_fee: FLOAT - NEW (platform commission)
# - seller_payout: FLOAT - NEW (amount seller receives)
# - rating_by_customer: INTEGER - NEW (1-5 stars, order rating)
# - customer_review: TEXT - NEW (review comment on order)

# ============================================================================
# NEW SELLER STATS MODEL
# ============================================================================
# This will track aggregated seller statistics for the dashboard
# - seller_id: VARCHAR (FK to User)
# - total_revenue: FLOAT
# - total_orders: INTEGER
# - total_products: INTEGER
# - average_rating: FLOAT
# - response_time_hours: FLOAT
# - cancellation_rate: FLOAT
# - return_rate: FLOAT
# - last_updated: DATETIME

# ============================================================================
# INVENTORY MODEL (Optional but useful)
# ============================================================================
# Track inventory changes for each product
# - product_id: VARCHAR (FK)
# - quantity_added: INTEGER
# - quantity_sold: INTEGER
# - quantity_returned: INTEGER
# - action_date: DATETIME
# - notes: TEXT
