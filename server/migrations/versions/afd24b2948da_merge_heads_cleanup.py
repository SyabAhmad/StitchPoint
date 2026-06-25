"""merge heads cleanup

Revision ID: afd24b2948da
Revises: a6d409637f52, fa1964905f83, cebb862f3c81
Create Date: 2025-10-31 20:40:21.608751

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'afd24b2948da'
down_revision = ('a6d409637f52', 'fa1964905f83', 'cebb862f3c81')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
