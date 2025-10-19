"""merge permanent heads fix

Revision ID: f65ed33db47d
Revises: b2c3d4e5f6a7, 9fb3f140c758
Create Date: 2025-10-19 14:38:36.587507

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f65ed33db47d'
down_revision = ('b2c3d4e5f6a7', '9fb3f140c758')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
