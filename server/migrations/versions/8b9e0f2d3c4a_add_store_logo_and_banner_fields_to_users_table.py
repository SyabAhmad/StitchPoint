"""Add store logo and banner fields to users table

Revision ID: 8b9e0f2d3c4a
Revises: 7a8d9f1e2c3b
Create Date: 2025-10-19 15:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b9e0f2d3c4a'
down_revision = '7a8d9f1e2c3b'
branch_labels = None
depends_on = None


def upgrade():
    # ### Add columns to users table ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('store_logo', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('store_banner', sa.Text(), nullable=True))


def downgrade():
    # ### Remove columns from users table ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('store_banner')
        batch_op.drop_column('store_logo')
