"""Edit column gender

Revision ID: 330ed998fdbf
Revises: 9ee3984142f8
Create Date: 2025-04-16 23:14:01.557796

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '330ed998fdbf'
down_revision: Union[str, None] = '9ee3984142f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('movies', 'difficulty',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    op.alter_column('series', 'difficulty',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    op.alter_column('users', 'gender',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'gender',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('series', 'difficulty',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    op.alter_column('movies', 'difficulty',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    # ### end Alembic commands ###
