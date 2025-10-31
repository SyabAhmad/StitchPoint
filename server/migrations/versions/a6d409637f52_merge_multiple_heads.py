"""Retired duplicate merge file.

This file was created by automated/failed merge attempts and has been
disabled (stripped of Alembic revision identifiers) so it is ignored by
Alembic. The real merge revision is `4b9548733582_merge_multiple_heads.py`.

Keep this file only for history; it contains no Alembic revision data.
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a6d409637f52'
down_revision = '23c0505195b5'
branch_labels = None
depends_on = None


def upgrade():
	# no-op merge placeholder; this file was created by a failed merge
	# attempt and has been repointed to an existing revision so it is
	# not treated as a head.
	pass


def downgrade():
	pass
