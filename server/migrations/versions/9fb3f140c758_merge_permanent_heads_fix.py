"""merge permanent heads fix

Revision ID: 9fb3f140c758
Revises: 61b021725a14, 8b9e0f2d3c4a
Create Date: 2025-10-19 14:24:29.034695

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9fb3f140c758'
down_revision = ('61b021725a14', '8b9e0f2d3c4a')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
