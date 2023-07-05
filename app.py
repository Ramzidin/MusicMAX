from flask import *
from flask_sqlalchemy import *
from flask_migrate import *
from sqlalchemy import *
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:123@localhost/MusicMAX'
app.config["SQLALCHEMY_TRACK_MODIFICATION"] = True
app.config['UPLOAD_FOLDER'] = 'static/img'
app.config["SECRET_KEY"] = "MusicMAX-web-programing"
ALLOW_EXTENSION = {'png', 'jpg', 'jpeg', 'webp', 'avif', 'mp3', 'jfif'}
db = SQLAlchemy(app)

migrate = Migrate(app, db)

user_album = db.Table("user_album",
                      db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                      db.Column('album_id', db.Integer, db.ForeignKey('album.id'))
                      )
user_playlist = db.Table("user_playlist",
                         db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                         db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'))
                         )
album_song = db.Table("album_song",
                      db.Column('album_id', db.Integer, db.ForeignKey('album.id')),
                      db.Column('song_id', db.Integer, db.ForeignKey('song.id'))
                      )
playlist_song = db.Table("playlist_song",
                         db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id')),
                         db.Column('song_id', db.Integer, db.ForeignKey('song.id'))
                         )
user_song_like = db.Table("user_song_like",
                          db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                          db.Column('song_id', db.Integer, db.ForeignKey('song.id'))
                          )
user_album_like = db.Table('user_album_like',
                           db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                           db.Column('album_id', db.Integer, db.ForeignKey('album.id'))
                           )
user_playlist_like = db.Table('user_playlist_like',
                              db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                              db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'))
                              )
user_song_table = db.Table("user_song_table",
                           db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                           db.Column('song_id', db.Integer, db.ForeignKey('song.id'))
                           )


class User(db.Model):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    photo = Column(String)
    artist = Column(Boolean)
    category_id = Column(Integer, ForeignKey('category.id'))
    len_love_song = Column(Integer)
    songs = db.relationship("Song", backref="user", secondary=user_song_table, order_by='Song.id')
    album = db.relationship("Album", backref="user", secondary=user_album, order_by="Album.id")
    playlist = db.relationship("Playlist", backref="user", secondary=user_playlist, order_by="Playlist.id")
    song_like = db.relationship("Song", backref='user_like', secondary=user_song_like, order_by='Song.id')
    album_like = db.relationship("Album", backref='user_like', secondary=user_album_like, order_by='Album.id')
    playlist_like = db.relationship("Playlist", backref='user_like', secondary=user_playlist_like,
                                    order_by='Playlist.id')


class Category(db.Model):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = db.relationship('User', backref='category', order_by='User.id')


class Song(db.Model):
    __tablename__ = "song"
    id = Column(Integer, primary_key=True)
    rating = Column(Integer)
    name = Column(String)
    url = Column(String)
    photo = Column(String)
    like = Column(Integer)
    duration = Column(String)
    genre_id = Column(Integer, ForeignKey('genre.id'))


class Album(db.Model):
    __tablename__ = "album"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    photo = Column(String)
    songs = db.relationship("Song", backref="album", secondary=album_song, order_by='Song.id')
    like = Column(Integer)
    date = Column(Date)


class Playlist(db.Model):
    __tablename__ = "playlist"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    photo = Column(String)
    author = Column(String)
    songs = db.relationship("Song", backref="playlist", secondary=playlist_song, order_by='Song.id')
    like = Column(Integer)
    date = Column(Date)
    length_song = Column(Integer)


class Genre(db.Model):
    __tablename__ = 'genre'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    song_id = db.relationship('Song', backref='genre', order_by='Song.id')


def check_file(filename):
    value = '.' in filename
    type_file = filename.rsplit('.', 1)[1].lower() in ALLOW_EXTENSION
    return value and type_file


def user_folder():
    folder = 'static/img/user_img/'
    return folder


def add_folder():
    folder = 'static/img/album_and_playlist_img/'
    return folder


def audio_folder():
    folder = 'static/audio/'
    return folder


def song_folder():
    folder = 'static/img/song_img/'
    return folder


@app.route('/', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        username = request.form.get('username')
        password = request.form.get('password')
        type_user = request.form.get('type')
        category = request.form.get('category')
        check_user = User.query.filter(User.username == username).first()
        if not (check_user):
            if name and username and password and type_user:
                if type_user == '1':
                    type_user = True
                else:
                    type_user = False
                photo_url = '/static/img/web_img/defoult_user_img.png'
                if password == 'MusicMAX-web-programing':
                    add = User(name=name, username=username, password=password, artist=True, photo=photo_url,
                               len_love_song=0, category_id=0)
                else:
                    add = User(name=name, username=username, password=password, artist=type_user, photo=photo_url,
                               len_love_song=0, category_id=int(category))
                db.session.add(add)
                db.session.commit()
                session['username'] = username
                return redirect(url_for('user'))
            else:
                return render_template('login.html', error='Fill all correct !')
        else:
            return render_template('login.html', error='This user already registered !')
    categorys = Category.query.filter(Category.name != 'Admin').all()
    return render_template('login.html', categorys=categorys)


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        check_user = User.query.filter(User.username == username).first()
        if username and check_user:
            if check_user.password == password:
                session['username'] = username
                return redirect(url_for('index'))
            else:
                return render_template('login.html', error='Wrong password or username !')
        else:
            return render_template('login.html', error='Fill all correct !')
    return render_template('login.html')


@app.route('/index')
def index():
    user_now = User.query.filter(User.username == session["username"]).first()
    if user_now.password == "MusicMAX-web-programing":
        return redirect(url_for('admin'))
    all_album = Album.query.order_by(desc(Album.like)).all()
    all_playlist = Playlist.query.order_by(desc(Playlist.like)).all()
    singers = User.query.filter(User.artist).all()
    for i in singers:
        if i.password == 'MusicMAX-web-programing':
            singers.remove(i)
    all_genre = Genre.query.filter()
    return render_template('index.html', all_pl=all_playlist, all_ab=all_album, user_now=user_now, singers=singers,
                           all_genre=all_genre)


@app.route('/user')
def user():
    session["name"] = ''
    user_now = User.query.filter(User.username == session["username"]).first()
    user_album = user_now.album
    user_playlist = user_now.playlist
    genre_all = Genre.query.all()
    return render_template('user.html', user_now=user_now, user_album=user_album, user_playlist=user_playlist,
                           genre_all=genre_all)


@app.route('/user_check')
def user_check():
    all_songs = Song.query.all()
    list = []
    user_name = ''
    for u in all_songs:
        for user_n in u.user:
            user_name = user_n.name
        list.append({'id': f'{u.id}',
                     'name': f'{u.name}',
                     'photo': f'{u.photo}',
                     'url': f'{u.url}',
                     'author': f'{user_name}',
                     'duration': f'{u.duration}'
                     })
    return jsonify(list)


@app.route('/get_playlist_song', methods=['POST', 'GET'])
def get_playlist_song():
    playlist_id = request.get_json()['playlist_id']
    int(playlist_id)
    playlist_now = Playlist.query.filter(Playlist.id == playlist_id).first()
    list_songs = playlist_now.songs
    list1 = Song.query.all()
    for i in list_songs:
        list1.remove(i)
    list = []
    if list1:
        for u in list1:
            for user_n in u.user:
                user_name = user_n.name

            list.append({'id': f'{u.id}',
                         'name': f'{u.name}',
                         'photo': f'{u.photo}',
                         'url': f'{u.url}',
                         'author': f'{user_name}',
                         'duration': f'{u.duration}'
                         })
    return jsonify(list)


@app.route('/playlist_add_treck', methods=['POST', 'GET'])
def playlist_add_treck():
    if request.method == 'POST':
        get_info = request.get_json()['playlist']
        int(get_info['id'])
        playlist_now = Playlist.query.filter(Playlist.id == get_info['id']).first()
        for i in get_info['track_id']:
            int(i)
            song_now = Song.query.filter(Song.id == i).first()
            playlist_now.songs.append(song_now)
        db.session.commit()
    return jsonify(True)


@app.route('/singer/<int:singer_id>')
def singer(singer_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    user_singer = User.query.filter(User.id == singer_id).first()
    length_songs = len(user_singer.songs)
    all_genre = Genre.query.filter()
    all_user = User.query.filter(User.category_id == user_singer.category_id).all()
    return render_template('singer.html', user_now=user_now, artist=user_singer, length_songs=length_songs,
                           genre_all=all_genre, all_user=all_user)


@app.route('/album/<int:album_id>')
def album(album_id):
    album_now = Album.query.filter(Album.id == album_id).first()
    user_now = User.query.filter(User.username == session["username"]).first()
    length_songs = len(album_now.songs)
    all_genre = Genre.query.filter()
    all_user = User.query.filter(User.category_id == album_now.user[0].category_id)
    return render_template('album.html', album=album_now, user_now=user_now, length_songs=length_songs,
                           genre_all=all_genre, all_user=all_user)


@app.route('/playlist/<int:play_list_id>')
def playlist(play_list_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    playlist_now = Playlist.query.filter(Playlist.id == play_list_id).first()
    length_songs = len(playlist_now.songs)
    playlist_now.length_song = length_songs
    db.session.commit()
    all_genre = Genre.query.filter()
    all_user = User.query.filter(User.category_id == playlist_now.user[0].category_id)
    return render_template('playlist.html', playlist=playlist_now, user_now=user_now, length_songs=length_songs,
                           genre_all=all_genre, all_user=all_user)


@app.route('/add_track', methods=['POST', 'GET'])
def add_track():
    user_now = User.query.filter(User.username == session["username"]).first()
    if request.method == 'POST':
        name = request.form.get('name')
        photo = request.files['photo']
        audio = request.files['audio']
        duration = request.form.get('duration')
        genre_song = request.form.get('genre')
        if name and check_file(photo.filename) and check_file(audio.filename) and duration:
            folder = song_folder()
            photo_file = secure_filename(photo.filename)
            photo_url = '/' + folder + photo_file
            app.config['UPLOAD_FOLDER'] = folder
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_file))
            folder = audio_folder()
            audio_file = secure_filename(audio.filename)
            audio_url = '/' + folder + audio_file
            app.config['UPLOAD_FOLDER'] = folder
            audio.save(os.path.join(app.config['UPLOAD_FOLDER'], audio_file))
            all_song_rating = Song.query.all()
            add = Song(name=name, photo=photo_url, url=audio_url, duration=duration, like=0,
                       rating=(len(all_song_rating) + 1), genre_id=int(genre_song))
            db.session.add(add)
            db.session.commit()
            user_now.songs.append(add)
            db.session.commit()
        else:
            return redirect(url_for('index'))
    return redirect(url_for('user'))


@app.route('/add_photo', methods=['POST', 'GET'])
def add_photo():
    if request.method == 'POST':
        photo = request.files.get('file')
        name = request.form.get('filename')
        folder = add_folder()
        if check_file(name):
            photo_file = secure_filename(name)
            photo_url = '/' + folder + photo_file
            session["name"] = photo_url
            app.config['UPLOAD_FOLDER'] = folder
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_file))
    return session['name']


@app.route('/user_add', methods=['POST', 'GET'])
def user_add():
    user_now = User.query.filter(User.username == session["username"]).first()
    if request.method == 'POST':
        photo_url = session["name"]
        list = request.get_json()['listValue']
        if session['name']:
            if list['type_list']:
                creat_album = Album(photo=photo_url, name=list['name'], date=list['date'], like=0)
                db.session.add(creat_album)
                db.session.commit()
                user_now.album.append(creat_album)
                db.session.commit()
                for song in list['listMusic']:
                    creat_album.songs.append(Song.query.filter(Song.id == song).first())
                db.session.commit()
            else:
                creat_playlist = Playlist(photo=photo_url, name=list['name'], date=list['date'], length_song=0, like=0,
                                          author=user_now.name)
                db.session.add(creat_playlist)
                db.session.commit()
                user_now.playlist.append(creat_playlist)
                db.session.commit()
                for song in list['listMusic']:
                    creat_playlist.songs.append(Song.query.filter(Song.id == song).first())
                    creat_playlist.length_song += 1
                db.session.commit()
    return jsonify(True)


@app.route('/user_edit/<int:user_id>', methods=['POST', 'GET'])
def user_edit(user_id):
    if request.method == 'POST':
        name = request.form.get('name')
        photo = request.files['photo']
        username = request.form.get('username')
        password = request.form.get('password')
        folder = user_folder()
        if username and name and password and check_file(photo.filename):
            check_user = User.query.filter(User.username == username).first()
            if check_user.username == session['username'] or not check_user:
                photo_file = secure_filename(photo.filename)
                photo_url = '/' + folder + photo_file
                app.config['UPLOAD_FOLDER'] = folder
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_file))
                User.query.filter(User.id == user_id).update({
                    'name': name,
                    'username': username,
                    'password': password,
                    'photo': photo_url
                })
                db.session.commit()
    return redirect(url_for('user'))


@app.route('/log_out')
def log_out():
    session['username'] = ''
    return redirect(url_for('register'))


@app.route('/delete_user')
def delete_user():
    user_now = User.query.filter(User.username == session["username"]).first()
    if user_now.songs:
        for song in user_now.songs:
            db.session.delete(song)
    if user_now.album:
        for albumF in user_now.album:
            db.session.delete(albumF)
    if user_now.playlist:
        for playlistF in user_now.playlist:
            db.session.delete(playlistF)
    db.session.commit()
    User.query.filter(User.username == session["username"]).delete()
    session['username'] = ''
    db.session.commit()
    return redirect(url_for('register'))


@app.route('/love')
def love():
    user_now = User.query.filter(User.username == session["username"]).first()
    user_love = user_now.song_like
    length_songs = len(user_love)
    return render_template('love.html', user_now=user_now, user_love=user_love, length_songs=length_songs)


@app.route('/love_song/<int:song_id>')
def love_song(song_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    song_now = Song.query.filter(Song.id == song_id).first()
    song_now.like += 1
    user_now.song_like.append(song_now)
    user_now.len_love_song += 1
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/love_playlist/<int:playlist_id>')
def love_playlist(playlist_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    playlist_now = Playlist.query.filter(Playlist.id == playlist_id).first()
    playlist_now.like += 1
    user_now.playlist_like.append(playlist_now)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/love_album/<int:album_id>')
def love_album(album_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    album_now = Album.query.filter(Album.id == album_id).first()
    album_now.like += 1
    user_now.album_like.append(album_now)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/dislike_song/<int:song_id>')
def dislike_song(song_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    song_now = Song.query.filter(Song.id == song_id).first()
    song_now.like -= 1
    user_now.song_like.remove(song_now)
    user_now.len_love_song -= 1
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/dislike_playlist/<int:playlist_id>')
def dislike_playlist(playlist_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    playlist_now = Playlist.query.filter(Playlist.id == playlist_id).first()
    playlist_now.like -= 1
    user_now.playlist_like.remove(playlist_now)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/dislike_album/<int:album_id>')
def dislike_album(album_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    album_now = Album.query.filter(Album.id == album_id).first()
    album_now.like -= 1
    user_now.album_like.remove(album_now)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/delete_track/<int:track_id>')
def delete_track(track_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    delete_song = Song.query.filter(Song.id == track_id).first()
    user_now.songs.remove(delete_song)
    delete_song = Song.query.filter(Song.id == track_id).first()
    db.session.delete(delete_song)
    db.session.commit()
    return redirect(url_for('user'))


@app.route('/delete_album/<int:album_id>')
def delete_album(album_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    album_now = Album.query.filter(Album.id == album_id).first()
    if album_now in user_now.album:
        db.session.delete(album_now)
        db.session.commit()
    else:
        return redirect(url_for('user', error='Error'))
    return redirect(url_for('user'))


@app.route('/delete_playlist/<int:playlist_id>')
def delete_playlist(playlist_id):
    user_now = User.query.filter(User.username == session["username"]).first()
    playlist_now = Playlist.query.filter(Playlist.id == playlist_id).first()
    if playlist_now in user_now.playlist:
        db.session.delete(playlist_now)
        db.session.commit()
    else:
        return redirect(url_for('user', error='Error'))
    return redirect(url_for('user'))


@app.route('/delete_playlist_song/<int:p_id>/<int:s_id>')
def delete_playlist_song(p_id, s_id):
    playlist_now = Playlist.query.filter(Playlist.id == p_id).first()
    song_now = Song.query.filter(Song.id == s_id).first()
    playlist_now.length_song = len(playlist_now.songs) - 1
    playlist_now.songs.remove(song_now)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/add_playlist_song/<int:p_id>/<int:s_id>')
def add_playlist_song(p_id, s_id):
    playlist_now = Playlist.query.filter(Playlist.id == p_id).first()
    song_now = Song.query.filter(Song.id == s_id).first()
    playlist_now.length_song = len(playlist_now.songs) + 1
    playlist_now.songs.append(song_now)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/admin')
def admin():
    user_now = User.query.filter(User.username == session["username"]).first()
    all_user = User.query.filter(User.artist).all()
    return render_template('admin.html', user_now=user_now, all_user=all_user)


@app.route('/add_genre', methods=['POST', 'GET'])
def add_genre():
    if request.method == 'POST':
        name = request.form.get('name')
        check_genre = Genre.query.filter(Genre.name == name).first()
        if not check_genre:
            add = Category(name=name)
            add_genre = Genre(name=name)
            db.session.add_all([add_genre, add])
            db.session.commit()
    return redirect(url_for('admin'))


@app.route('/add_category', methods=['POST', 'GET'])
def add_category():
    if request.method == 'POST':
        name = request.form.get('name')
        add = Category(name=name)
        db.session.add(add)
        db.session.commit()
    return redirect(url_for('admin'))


@app.route('/download/<path:filename>')
def download(filename):
    filename = filename[0:]
    return send_file(filename, as_attachment=True)


if __name__ == '__main__':
    app.run()
