"""Add seller analytics and inventory tracking tables

Revision ID: 7a8d9f1e2c3b
Revises: e97bfc74d7e9
Create Date: 2025-10-19 14:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a8d9f1e2c3b'
down_revision = 'e97bfc74d7e9'
branch_labels = None
depends_on = None


def upgrade():
    # ### Add columns to products table ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_sold', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('monthly_revenue', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('last_sale_date', sa.DateTime(), nullable=True))

    # ### Add columns to orders table ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('payment_status', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('payment_method', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('refund_amount', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('commission_fee', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('seller_payout', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('rating_by_customer', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('customer_review', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('seller_id', sa.String(length=36), nullable=True))
        
        # Create foreign key for seller_id
        batch_op.create_foreign_key('fk_orders_seller_id', 'users', ['seller_id'], ['id'])
        batch_op.create_index(batch_op.f('ix_orders_seller_id'), ['seller_id'], unique=False)

    # ### Create seller_stats table ###
    op.create_table('seller_stats',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('seller_id', sa.String(length=36), nullable=False),
    sa.Column('total_revenue', sa.Float(), nullable=True),
    sa.Column('monthly_revenue', sa.Float(), nullable=True),
    sa.Column('total_payout', sa.Float(), nullable=True),
    sa.Column('pending_payout', sa.Float(), nullable=True),
    sa.Column('total_commission', sa.Float(), nullable=True),
    sa.Column('total_orders', sa.Integer(), nullable=True),
    sa.Column('completed_orders', sa.Integer(), nullable=True),
    sa.Column('cancelled_orders', sa.Integer(), nullable=True),
    sa.Column('returned_orders', sa.Integer(), nullable=True),
    sa.Column('total_products', sa.Integer(), nullable=True),
    sa.Column('active_products', sa.Integer(), nullable=True),
    sa.Column('total_items_sold', sa.Integer(), nullable=True),
    sa.Column('average_rating', sa.Float(), nullable=True),
    sa.Column('total_reviews', sa.Integer(), nullable=True),
    sa.Column('response_time_hours', sa.Float(), nullable=True),
    sa.Column('cancellation_rate', sa.Float(), nullable=True),
    sa.Column('return_rate', sa.Float(), nullable=True),
    sa.Column('positive_feedback_rate', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('last_sale_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['seller_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('seller_id')
    )
    with op.batch_alter_table('seller_stats', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_seller_stats_seller_id'), ['seller_id'], unique=True)

    # ### Create inventory_logs table ###
    op.create_table('inventory_logs',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('product_id', sa.String(length=36), nullable=False),
    sa.Column('quantity_change', sa.Integer(), nullable=False),
    sa.Column('previous_stock', sa.Integer(), nullable=True),
    sa.Column('new_stock', sa.Integer(), nullable=True),
    sa.Column('action_type', sa.String(length=50), nullable=False),
    sa.Column('reference_id', sa.String(length=36), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('inventory_logs', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_inventory_logs_product_id'), ['product_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_inventory_logs_created_at'), ['created_at'], unique=False)


def downgrade():
    # ### Drop inventory_logs table ###
    op.drop_table('inventory_logs')

    # ### Drop seller_stats table ###
    op.drop_table('seller_stats')

    # ### Remove columns from orders table ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_orders_seller_id'))
        batch_op.drop_constraint('fk_orders_seller_id', type_='foreignkey')
        batch_op.drop_column('seller_id')
        batch_op.drop_column('customer_review')
        batch_op.drop_column('rating_by_customer')
        batch_op.drop_column('seller_payout')
        batch_op.drop_column('commission_fee')
        batch_op.drop_column('refund_amount')
        batch_op.drop_column('payment_method')
        batch_op.drop_column('payment_status')

    # ### Remove columns from products table ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('last_sale_date')
        batch_op.drop_column('monthly_revenue')
        batch_op.drop_column('total_sold')
