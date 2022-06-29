import os
import json
import random
from PIL import Image

from flask import Flask, render_template, url_for

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True, static_folder='static')
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    def get_images(album_id):
        images = [image for image in os.listdir(os.path.join(app.static_folder, f"albums/{album_id}")) if os.path.splitext(image)[1].lower() not in [".json", ""]]
        return images

    def random_image(album_id, thumbnail = True, homepage=False):
        if homepage:
            random_album = random.choice(album_id)
            return f"{random_album}/{random.choice(get_images(random_album))}"
        images = get_images(album_id)
        image = random.choice(images)
        if thumbnail:
            return get_thumbnail(album_id, image)
        return image

    def get_image(json_file, image_id):
        for image in json_file["images"]:
            if os.path.splitext(image["filename"])[0].lower() == image_id.lower():
                return image

    def get_json(album_id):
        with open(os.path.join(app.static_folder, f"albums/{album_id}/album.json"), "r") as file:
            json_file = json.load(file)
            print(json_file)
        return json_file
    
    def remove_extension(filename):
        return os.path.splitext(filename)[0]
    
    def create_thumbnail(album_id, image_filename):
        path_to_full_size = os.path.join(app.static_folder, f"albums/{album_id}")
        path_to_thumbnails = os.path.join(app.static_folder, f"albums/{album_id}/thumbnails")
        image_name = os.path.splitext(image_filename)[0]
        image_ext = os.path.splitext(image_filename)[1]
        image = Image.open(os.path.join(path_to_full_size, image_filename))
        full_width, full_height = image.size
        new_width, new_height = round(500 * full_width / full_height), 500
        thumbnail = image.resize((new_width, new_height))
        thumbnail.save(os.path.join(path_to_thumbnails, f"{image_name}_thumbnail{image_ext}"))

    def get_thumbnail(album_id, image_filename):
        path_to_thumbnails = os.path.join(app.static_folder, f"albums/{album_id}/thumbnails")
        image_name = os.path.splitext(image_filename)[0]
        image_ext = os.path.splitext(image_filename)[1]
        if not os.path.exists(path_to_thumbnails):
            os.makedirs(path_to_thumbnails)
        if not os.path.exists(os.path.join(path_to_thumbnails, f"{image_name}_thumbnail{image_ext}")):
            create_thumbnail(album_id, image_filename)
        return f"{image_name}_thumbnail{image_ext}"
        

    @app.route("/")
    def home():
        albums = os.listdir(os.path.join(app.static_folder, "albums"))
        return render_template('home.html', albums=albums, random_image = random_image, get_json = get_json, get_thumbnail = get_thumbnail)

    @app.route('/a/<album_id>')
    def album(album_id):
        with open(os.path.join(app.static_folder, f"albums/{album_id}/album.json"), "r") as file:
            json_file = json.load(file)
        return render_template('album.html', album_id = album_id, json_file = json_file, remove_extension = remove_extension, random_image = random_image, get_thumbnail = get_thumbnail) 
        
    @app.route('/a/<album_id>/<image_id>')
    def image(album_id, image_id):
        with open(os.path.join(app.static_folder, f"albums/{album_id}/album.json"), "r") as file:
            json_file = json.load(file)
        return render_template('image.html', album_id = album_id, image_id = image_id, album_json = json_file['album'], image_json = get_image(json_file, image_id), get_thumbnail = get_thumbnail) 
    
    return app