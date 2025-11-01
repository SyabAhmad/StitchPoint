"""Rename user to users and order to orders

Revision ID: 32b29afb8cab
Revises: 2db269cd0267
Create Date: 2025-11-01

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '32b29afb8cab'
down_revision = '2db269cd0267'
branch_labels = None
depends_on = None


def upgrade():
    # Rename tables instead of dropping/recreating
    op.rename_table('user', 'users')
    op.rename_table('order', 'orders')
    
    # Rename sequences to match new table names
    op.execute('ALTER SEQUENCE user_id_seq RENAME TO users_id_seq')
    op.execute('ALTER SEQUENCE order_id_seq RENAME TO orders_id_seq')


def downgrade():
    # Reverse the renaming
    op.rename_table('users', 'user')
    op.rename_table('orders', 'order')
    
    # Rename sequences back
    op.execute('ALTER SEQUENCE users_id_seq RENAME TO user_id_seq')
    op.execute('ALTER SEQUENCE orders_id_seq RENAME TO order_id_seq')
