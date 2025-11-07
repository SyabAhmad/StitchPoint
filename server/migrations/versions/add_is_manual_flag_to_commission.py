"""add is_manual flag to commission

Revision ID: add_is_manual_flag_to_commission
Revises: 90214fe417a0
Create Date: 2025-11-07 00:00:00
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_is_manual_flag_to_commission'
down_revision = '90214fe417a0'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('commission') as batch_op:
        batch_op.add_column(
            sa.Column('is_manual', sa.Boolean(), nullable=False, server_default=sa.text('false'))
        )
        batch_op.alter_column('is_manual', server_default=None)


def downgrade():
    with op.batch_alter_table('commission') as batch_op:
        batch_op.drop_column('is_manual')
