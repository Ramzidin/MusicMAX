"""empty message

Revision ID: fd9ec76dcb37
Revises: 
Create Date: 2023-06-12 11:47:59.588445

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fd9ec76dcb37'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('album',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('photo', sa.String(), nullable=True),
    sa.Column('like', sa.Integer(), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('playlist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('photo', sa.String(), nullable=True),
    sa.Column('author', sa.String(), nullable=True),
    sa.Column('like', sa.Integer(), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('photo', sa.String(), nullable=True),
    sa.Column('artist', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('song',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('photo', sa.String(), nullable=True),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.Column('like', sa.Integer(), nullable=True),
    sa.Column('duration', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_album',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('album_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['album_id'], ['album.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('user_album_like',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('album_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['album_id'], ['album.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('user_playlist',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('playlist_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['playlist_id'], ['playlist.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('user_playlist_like',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('playlist_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['playlist_id'], ['playlist.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    op.create_table('album_song',
    sa.Column('album_id', sa.Integer(), nullable=True),
    sa.Column('song_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['album_id'], ['album.id'], ),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], )
    )
    op.create_table('playlist_song',
    sa.Column('playlist_id', sa.Integer(), nullable=True),
    sa.Column('song_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['playlist_id'], ['playlist.id'], ),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], )
    )
    op.create_table('user_song_like',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('song_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_song_like')
    op.drop_table('playlist_song')
    op.drop_table('album_song')
    op.drop_table('user_playlist_like')
    op.drop_table('user_playlist')
    op.drop_table('user_album_like')
    op.drop_table('user_album')
    op.drop_table('song')
    op.drop_table('user')
    op.drop_table('playlist')
    op.drop_table('album')
    # ### end Alembic commands ###