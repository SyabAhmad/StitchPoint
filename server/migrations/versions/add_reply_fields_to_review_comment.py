"""Add reply fields to review and comment tables

Revision ID: 8f3a2b1c9d7e
Revises: fa1964905f83
Create Date: 2026-05-06 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers
revision = '8f3a2b1c9d7e'
down_revision = 'fa1964905f83'
branch_labels = None
depends_on = None


def upgrade():
    # Add reply and replied_at columns to review table
    op.add_column('review', sa.Column('reply', sa.Text(), nullable=True))
    op.add_column('review', sa.Column('replied_at', sa.DateTime(), nullable=True))

    # Add reply and replied_at columns to comment table
    op.add_column('comment', sa.Column('reply', sa.Text(), nullable=True))
    op.add_column('comment', sa.Column('replied_at', sa.DateTime(), nullable=True))


def downgrade():
    # Remove columns from comment table
    op.drop_column('comment', 'replied_at')
    op.drop_column('comment', 'reply')

    # Remove columns from review table
    op.drop_column('review', 'replied_at')
    op.drop_column('review', 'reply')
