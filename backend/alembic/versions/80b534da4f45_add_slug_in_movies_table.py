"""Add slug in movies table

Revision ID: 80b534da4f45
Revises: 0ba6dbc10e37
Create Date: 2025-03-16 17:30:22.889740

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '80b534da4f45'
down_revision: Union[str, None] = '0ba6dbc10e37'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('movies', sa.Column('slug', sa.String(length=255), nullable=True))
    op.create_unique_constraint(None, 'movies', ['slug'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'movies', type_='unique')
    op.drop_column('movies', 'slug')
    # ### end Alembic commands ###
