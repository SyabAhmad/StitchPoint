"""merge multiple heads

Revision ID: 4b9548733582
Revises: 
Create Date: 2025-10-31 18:44:24.591072

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4b9548733582'
down_revision = None
branch_labels = None
depends_on = ['a0b509847b58', 'add_parent_id_to_category', 'b6a31bbdfda8']


def upgrade():
    pass


def downgrade():
    pass
