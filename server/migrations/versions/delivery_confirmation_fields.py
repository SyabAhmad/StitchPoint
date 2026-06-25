"""Add delivery confirmation fields to Order model

Revision ID: delivery_confirmation_fields
Revises: 752ad485458c
Create Date: 2025-11-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'delivery_confirmation_fields'
down_revision = '752ad485458c'
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to orders table
    op.add_column('orders', sa.Column('is_delivered', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('orders', sa.Column('delivery_confirmed_at', sa.DateTime(), nullable=True))
    op.add_column('orders', sa.Column('delivery_confirmed_by_customer', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    # Remove columns
    op.drop_column('orders', 'delivery_confirmed_by_customer')
    op.drop_column('orders', 'delivery_confirmed_at')
    op.drop_column('orders', 'is_delivered')
