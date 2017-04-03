"""empty message

Revision ID: 2ea9ca16cf23
Revises: 
Create Date: 2017-04-03 00:17:26.714374

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2ea9ca16cf23'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('post',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('author', sa.String(length=120), nullable=True),
    sa.Column('title', sa.String(length=120), nullable=True),
    sa.Column('text', sa.Text(), nullable=True),
    sa.Column('update_time', sa.DateTime(), nullable=True),
    sa.Column('passphrase', sa.String(length=120), nullable=True),
    sa.Column('cookie_id', sa.String(length=10), nullable=True),
    sa.Column('searchable', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('post')
    # ### end Alembic commands ###